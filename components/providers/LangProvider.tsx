'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextType>({
  lang: 'ru',
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ru')

  useEffect(() => {
    const stored = localStorage.getItem('hos-lang') as Lang | null
    if (stored === 'ru' || stored === 'tk') setLangState(stored)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('hos-lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
