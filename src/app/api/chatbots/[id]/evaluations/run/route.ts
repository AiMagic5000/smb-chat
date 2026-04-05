import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { retrieveContext, generateResponse } from '@/lib/ai/rag'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()

    const { data: chatbot } = await supabase.from('chatbots').select('*').eq('id', id).single()
    if (!chatbot) return NextResponse.json({ success: false, error: 'Chatbot not found' }, { status: 404 })

    const { data: tests } = await supabase
      .from('evaluation_tests')
      .select('*')
      .eq('chatbot_id', id)

    if (!tests || tests.length === 0) {
      return NextResponse.json({ success: false, error: 'No test cases found' }, { status: 400 })
    }

    const results = []

    for (const test of tests) {
      const dummyConvId = '00000000-0000-0000-0000-000000000000'
      const context = await retrieveContext(id, dummyConvId, test.input_message)
      const { reply } = await generateResponse(
        { model: chatbot.model, system_prompt: chatbot.system_prompt, temperature: chatbot.temperature, max_tokens: chatbot.max_tokens },
        context,
        test.input_message
      )

      let passed = false
      if (test.expected_output) {
        switch (test.match_type) {
          case 'contains':
            passed = reply.toLowerCase().includes(test.expected_output.toLowerCase())
            break
          case 'exact':
            passed = reply.trim() === test.expected_output.trim()
            break
          case 'regex':
            passed = new RegExp(test.expected_output, 'i').test(reply)
            break
          default:
            passed = reply.toLowerCase().includes(test.expected_output.toLowerCase())
        }
      }

      await supabase.from('evaluation_tests').update({
        actual_output: reply,
        passed,
        last_run_at: new Date().toISOString(),
      }).eq('id', test.id)

      results.push({ id: test.id, name: test.name, passed, actual_output: reply })
    }

    const passCount = results.filter(r => r.passed).length
    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: { total: results.length, passed: passCount, failed: results.length - passCount },
      },
    })
  } catch (error) {
    console.error('Run evaluations error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
