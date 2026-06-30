'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Check, CalendarDays, MapPin, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Event {
  id: number
  title_ru: string
  title_tk: string
  description_ru: string | null
  description_tk: string | null
  date: string
  time: string
  location: string | null
  imageUrl: string | null
  active: boolean
}

const empty: Omit<Event, 'id'> = {
  title_ru: '', title_tk: '',
  description_ru: '', description_tk: '',
  date: '', time: '',
  location: 'HOŞ Lounge',
  imageUrl: '',
  active: true,
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | number | null>(null)
  const [form, setForm] = useState<Omit<Event, 'id'>>(empty)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/events')
    setEvents(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit   = (e: Event) => { const { id: _id, ...rest } = e; setForm(rest); setModal(e.id) }
  const close      = () => setModal(null)

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'create') {
        const res = await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) throw new Error()
        toast.success('Мероприятие создано')
      } else {
        const res = await fetch(`/api/admin/events/${modal}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) throw new Error()
        toast.success('Сохранено')
      }
      close()
      load()
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Удалить мероприятие?')) return
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    toast.success('Удалено')
    load()
  }

  const toggle = async (ev: Event) => {
    await fetch(`/api/admin/events/${ev.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !ev.active }),
    })
    load()
  }

  const inp = 'w-full px-3 py-2 bg-sage-800 border border-sage-700 rounded-lg text-cream-100 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500'
  const lbl = 'block text-xs font-medium text-sage-400 mb-1 tracking-wide'

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-cream-100">Мероприятия</h1>
          <p className="text-sage-400 text-sm mt-0.5">Анонсы событий на главной странице</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-sage-600 hover:bg-sage-500 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Добавить
        </button>
      </div>

      {loading ? (
        <div className="text-sage-400 text-sm">Загрузка...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-sage-400">
          <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
          <p>Нет мероприятий. Добавьте первое!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => {
            const isPast = ev.date < today
            return (
              <div key={ev.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-opacity ${isPast ? 'opacity-50' : ''} bg-sage-900 border-sage-700`}>
                {/* Date block */}
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-2xl font-light text-amber-400 leading-none">{ev.date.slice(8)}</div>
                  <div className="text-xs text-sage-400 tracking-wide uppercase mt-0.5">
                    {['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][parseInt(ev.date.slice(5, 7)) - 1]}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-cream-100 truncate">{ev.title_ru}</span>
                    {isPast && <span className="text-xs px-2 py-0.5 rounded-full bg-sage-800 text-sage-400">прошедшее</span>}
                    {!ev.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-400">скрыто</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-sage-400">
                    <span className="flex items-center gap-1"><Clock size={11} />{ev.time}</span>
                    {ev.location && <span className="flex items-center gap-1"><MapPin size={11} />{ev.location}</span>}
                  </div>
                  {ev.description_ru && <p className="text-xs text-sage-500 mt-1 truncate">{ev.description_ru}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggle(ev)}
                    title={ev.active ? 'Скрыть' : 'Показать'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${ev.active ? 'bg-green-900/40 text-green-400 hover:bg-green-900/70' : 'bg-sage-800 text-sage-500 hover:bg-sage-700'}`}
                  >
                    <Check size={14} />
                  </button>
                  <button onClick={() => openEdit(ev)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-sage-800 text-sage-300 hover:bg-sage-700 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remove(ev.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-sage-800 text-red-400 hover:bg-red-900/40 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-sage-900 border border-sage-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-sage-700">
              <h2 className="font-semibold text-cream-100">{modal === 'create' ? 'Новое мероприятие' : 'Редактировать'}</h2>
              <button onClick={close} className="text-sage-400 hover:text-cream-100"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Название (RU)</label>
                  <input className={inp} value={form.title_ru} onChange={e => setForm(f => ({ ...f, title_ru: e.target.value }))} placeholder="Вечер джаза" />
                </div>
                <div>
                  <label className={lbl}>Название (TK)</label>
                  <input className={inp} value={form.title_tk} onChange={e => setForm(f => ({ ...f, title_tk: e.target.value }))} placeholder="Jazz agşamy" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Дата</label>
                  <input type="date" className={inp} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className={lbl}>Время</label>
                  <input type="time" className={inp} value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className={lbl}>Площадка</label>
                <select className={inp} value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
                  <option value="HOŞ Lounge">HOŞ Lounge</option>
                  <option value="HOŞ Coffee">HOŞ Coffee</option>
                  <option value="">Не указано</option>
                </select>
              </div>

              <div>
                <label className={lbl}>Описание (RU)</label>
                <textarea className={inp + ' resize-none'} rows={2} value={form.description_ru ?? ''} onChange={e => setForm(f => ({ ...f, description_ru: e.target.value }))} placeholder="Живая музыка, специальное меню..." />
              </div>
              <div>
                <label className={lbl}>Описание (TK)</label>
                <textarea className={inp + ' resize-none'} rows={2} value={form.description_tk ?? ''} onChange={e => setForm(f => ({ ...f, description_tk: e.target.value }))} />
              </div>

              <div>
                <label className={lbl}>Ссылка на фото (необязательно)</label>
                <input className={inp} value={form.imageUrl ?? ''} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-sage-500" />
                <label htmlFor="active" className="text-sm text-sage-300">Активно (показывать на сайте)</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-sage-700">
              <button onClick={close} className="px-4 py-2 text-sm text-sage-400 hover:text-cream-100 transition-colors">Отмена</button>
              <button
                onClick={save}
                disabled={saving || !form.title_ru || !form.date || !form.time}
                className="px-5 py-2 bg-sage-600 hover:bg-sage-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
