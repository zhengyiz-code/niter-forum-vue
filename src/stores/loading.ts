import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    loading: false,
    loadingText: ''
  }),
  actions: {
    startLoading(text: string = '') {
      this.loading = true
      this.loadingText = text
    },
    stopLoading() {
      this.loading = false
      this.loadingText = ''
    }
  }
})