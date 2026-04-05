'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WorkspaceState {
  currentWorkspaceId: string | null
  setWorkspace: (id: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspaceId: null,
      setWorkspace: (id: string) => set({ currentWorkspaceId: id }),
    }),
    { name: 'smb-chat-workspace' }
  )
)
