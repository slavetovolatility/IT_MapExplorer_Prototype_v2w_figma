'use client'

import { useCallback } from 'react'
import { useUIStore } from '@/store/ui'
import { translate } from '@/lib/i18n'

// Returns a `t(key, params?)` function bound to the current language.
// Falls back to English, then to the key itself, so a missing translation
// never renders blank.
export function useT() {
  const lang = useUIStore(s => s.lang)
  return useCallback(
    (key: string, params?: Record<string, string | number>) => translate(lang, key, params),
    [lang],
  )
}
