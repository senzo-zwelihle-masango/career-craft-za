"use client"

import { create } from "zustand"
import type { CvWithRelations } from "./types"

interface HistoryEntry {
  cv: CvWithRelations
}

const MAX_HISTORY = 50

interface EditorStore {
  cv: CvWithRelations | null
  isDirty: boolean
  saveStatus: "idle" | "saving" | "saved" | "error"
  history: HistoryEntry[]
  redoStack: HistoryEntry[]

  setCv: (cv: CvWithRelations) => void
  updateCv: (data: Partial<CvWithRelations>) => void
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void
  markDirty: () => void
  undo: () => void
  redo: () => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  cv: null,
  isDirty: false,
  saveStatus: "idle",
  history: [],
  redoStack: [],

  setCv: (cv) => set({ cv, isDirty: false, history: [], redoStack: [] }),

  updateCv: (data) =>
    set((state) => {
      if (!state.cv) return state
      const snapshot: HistoryEntry = { cv: JSON.parse(JSON.stringify(state.cv)) }
      const history = [...state.history.slice(-(MAX_HISTORY - 1)), snapshot]
      return {
        cv: { ...state.cv, ...data },
        isDirty: true,
        history,
        redoStack: [],
      }
    }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  markDirty: () => set({ isDirty: true }),

  undo: () =>
    set((state) => {
      if (state.history.length === 0 || !state.cv) return state
      const previous = state.history[state.history.length - 1]
      const redoEntry: HistoryEntry = { cv: JSON.parse(JSON.stringify(state.cv)) }
      return {
        cv: previous.cv,
        history: state.history.slice(0, -1),
        redoStack: [...state.redoStack, redoEntry],
        isDirty: true,
      }
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0 || !state.cv) return state
      const next = state.redoStack[state.redoStack.length - 1]
      const undoEntry: HistoryEntry = { cv: JSON.parse(JSON.stringify(state.cv)) }
      return {
        cv: next.cv,
        redoStack: state.redoStack.slice(0, -1),
        history: [...state.history, undoEntry],
        isDirty: true,
      }
    }),
}))
