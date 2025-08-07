import type { StateCreator } from "zustand"

import type { ScanningMedia } from "~types/media"

type MediaState = {
  editingMedia: ScanningMedia | null
}

type MediaActions = {
  setEditingMedia: (media: ScanningMedia | null) => void
}

export type MediaSlice = MediaState & MediaActions

const initialState: MediaState = {
  editingMedia: null
}

export const createMediaSlice: StateCreator<MediaSlice> = (set) => ({
  ...initialState,
  setEditingMedia: (media: ScanningMedia | null) =>
    set({
      editingMedia: media
    })
})
