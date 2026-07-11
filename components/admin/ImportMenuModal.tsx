'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, FileJson, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react'

interface Props {
  venue: 'lounge' | 'coffee'
  onClose: () => void
  onImported: () => void
}

type Format = 'json' | 'csv'

const JSON_EXAMPLE = `[
  {
    "name_ru": "Кофе",
    "name_tk": "Kofe",
    "items": [
      { "name_ru": "Латте", "name_tk": "Latte", "price": 25, "description_ru": "Классика" }
    ]
  }
]`

const CSV_EXAMPLE = `category_ru,name_ru,price,description_ru
Кофе,Латте,25,Классика
Кофе,Капучино,25,`

export default function ImportMenuModal({ venue, onClose, onImported }: Props) {
  const [format, setFormat] = useState<Format>('json')
  const [mode, setMode] = useState<'merge' | 'replace'>('merge')
  const [raw, setRaw] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ categoriesCreated: number; itemsCreated: number; itemsUpdated: number } | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    if (file.name.toLowerCase().endsWith('.csv')) setFormat('csv')
    else if (file.name.toLowerCase().endsWith('.json')) setFormat('json')
    const text = await file.text()
    setRaw(text)
  }

  const handleImport = async () => {
    if (!raw.trim()) {
      setError('Вставьте данные или выберите файл')
      return
    }
    if (mode === 'replace' && !confirm('Все текущие категории и позиции этого зала будут удалены и заменены. Продолжить?')) {
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/admin/menu/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue, mode, format, raw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка импорта')
      setResult(data)
      onImported()
    } catch (err: any) {
      setError(err.message || 'Ошибка импорта')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-carbon-900 border border-carbon-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-cream-200 dark:border-sage-700">
          <h2 className="font-playfair font-semibold text-sage-800 dark:text-cream-100">
            Импорт меню
          </h2>
          <button onClick={onClose} className="text-sage-400 hover:text-sage-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('json')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border transition-colors ${
                format === 'json'
                  ? 'bg-sage-600 text-white border-sage-600'
                  : 'border-cream-200 dark:border-sage-700 text-sage-500'
              }`}
            >
              <FileJson className="w-4 h-4" /> JSON
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border transition-colors ${
                format === 'csv'
                  ? 'bg-sage-600 text-white border-sage-600'
                  : 'border-cream-200 dark:border-sage-700 text-sage-500'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" /> CSV
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-full py-2.5 px-3 border border-dashed border-sage-600 hover:border-gold-400 rounded-lg transition-colors text-sage-400 hover:text-gold-400 text-sm">
            <Upload className="w-4 h-4" />
            {fileName || 'Загрузить файл (.json или .csv)'}
            <input type="file" accept=".json,.csv,text/csv,application/json" onChange={handleFile} className="hidden" />
          </label>

          <div>
            <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">
              Или вставьте текст ({format === 'json' ? 'JSON' : 'CSV'})
            </label>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={8}
              placeholder={format === 'json' ? JSON_EXAMPLE : CSV_EXAMPLE}
              className="input text-xs font-mono resize-none w-full"
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === 'merge'} onChange={() => setMode('merge')} className="accent-sage-600" />
              <span className="text-sm text-sage-700 dark:text-sage-200">Добавить / обновить</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === 'replace'} onChange={() => setMode('replace')} className="accent-sage-600" />
              <span className="text-sm text-sage-700 dark:text-sage-200">Заменить всё меню</span>
            </label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {result && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Готово: категорий создано {result.categoriesCreated}, позиций создано {result.itemsCreated}, обновлено {result.itemsUpdated}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-cream-200 dark:border-sage-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">Закрыть</button>
          <button
            onClick={handleImport}
            disabled={loading}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Импортировать
          </button>
        </div>
      </motion.div>
    </div>
  )
}
