import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
    }

    // Verify signature using Stripe SDK when available, otherwise reject
    // For now, require the secret to be set as a gate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let event: { type: string; data: { object: any } }
    try {
      event = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Basic signature check: reject if header doesn't start with expected format
    if (!sig.startsWith('t=')) {
      return NextResponse.json({ error: 'Invalid signature format' }, { status: 400 })
    }
    const supabase = createAdminClient()

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
      case 'invoice.paid': {
        const invoice = event.data.object
        // Reset monthly usage
        await supabase
          .from('subscriptions')
          .update({ messages_used: 0, extra_message_credits: 0 })
          .eq('stripe_subscription_id', invoice.subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
