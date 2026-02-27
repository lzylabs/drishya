import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set) => ({
      // Theme: 'dark' | 'light'
      theme: 'dark',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),

      // Language: 'en' | 'te'
      language: 'en',
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'en' ? 'te' : 'en' })),

      // Nav state
      isMobileNavOpen: false,
      setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
    }),
    {
      name: 'drishyam-prefs',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
)

export default useStore
