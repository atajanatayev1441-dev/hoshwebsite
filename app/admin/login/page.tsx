'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Coffee, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Неверный email или пароль')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-900 dark:bg-sage-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-sage-600 flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-playfair text-2xl font-semibold text-cream-100">
            HOS Admin
          </h1>
          <p className="text-sage-400 text-sm mt-1">Панель управления</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-sage-800 rounded-2xl p-6 space-y-4 border border-sage-700"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-sage-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-9 pr-4 py-3 bg-sage-700 border border-sage-600 rounded-xl text-cream-100 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition-colors text-sm"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-sage-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full pl-9 pr-4 py-3 bg-sage-700 border border-sage-600 rounded-xl text-cream-100 placeholder:text-sage-400 focus:outline-none focus:border-sage-400 transition-colors text-sm"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-500 hover:bg-sage-400 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
