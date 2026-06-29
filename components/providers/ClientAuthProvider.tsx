'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface ClientUser {
  id: number
  phone: string
  name: string
}

interface ClientAuthContextValue {
  client: ClientUser | null
  loading: boolean
  refresh: () => void
  logout: () => void
}

const ClientAuthContext = createContext<ClientAuthContextValue>({
  client: null,
  loading: true,
  refresh: () => {},
  logout: () => {},
})

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ClientUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/client/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setClient(data)
      } else {
        setClient(null)
      }
    } catch {
      setClient(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/client/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // ignore
    }
    setClient(null)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <ClientAuthContext.Provider value={{ client, loading, refresh, logout }}>
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  return useContext(ClientAuthContext)
}
