'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus, Pencil, Trash2, GripVertical, Eye, EyeOff, Star, X, Save,
} from 'lucide-react'

interface Category {
  id: number
  name_ru: string
  name_tk: string
  position: number
  visible: boolean
}

interface MenuItem {
  id: number
  categoryId: number
  name_ru: string
  name_tk: string
  description_ru: string | null
  description_tk: string | null
  price: number
  imageUrl: string | null
  available: boolean
  featured: boolean
}

const emptyItem: Omit<MenuItem, 'id'> = {
  categoryId: 0,
  name_ru: '',
  name_tk: '',
  description_ru: '',
  description_tk: '',
  price: 0,
  imageUrl: '',
  available: true,
  featured: false,
}

// Sortable category row
function SortableCategoryRow({
  cat,
  isSelected,
  onSelect,
  onToggleVisible,
  onEdit,
  onDelete,
}: {
  cat: Category
  isSelected: boolean
  onSelect: () => void
  onToggleVisible: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
        isSelected
          ? 'bg-sage-100 dark:bg-sage-700 border border-sage-300 dark:border-sage-600'
          : 'hover:bg-cream-100 dark:hover:bg-sage-800 border border-transparent'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="text-sage-300 hover:text-sage-500 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="flex-1 text-sm font-medium text-sage-800 dark:text-cream-100 truncate">
        {cat.name_ru}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleVisible() }}
        className="text-sage-400 hover:text-sage-600 dark:hover:text-sage-200"
      >
        {cat.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-sage-300" />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit() }}
        className="text-sage-400 hover:text-sage-600 dark:hover:text-sage-200"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="text-sage-400 hover:text-red-500"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// Item form modal
function ItemModal({
  item,
  categoryId,
  onSave,
  onClose,
}: {
  item: Partial<MenuItem> | null
  categoryId: number
  onSave: (data: Partial<MenuItem>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Omit<MenuItem, 'id'>>({
    ...emptyItem,
    categoryId,
    ...(item ?? {}),
  })

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-carbon-900 border border-carbon-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-cream-200 dark:border-sage-700">
          <h2 className="font-playfair font-semibold text-sage-800 dark:text-cream-100">
            {item?.id ? 'Редактировать позицию' : 'Новая позиция'}
          </h2>
          <button onClick={onClose} className="text-sage-400 hover:text-sage-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">Название (RU)</label>
              <input value={form.name_ru} onChange={(e) => set('name_ru', e.target.value)} className="input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">Название (TK)</label>
              <input value={form.name_tk} onChange={(e) => set('name_tk', e.target.value)} className="input text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">Описание (RU)</label>
              <textarea value={form.description_ru ?? ''} onChange={(e) => set('description_ru', e.target.value)} rows={2} className="input text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">Описание (TK)</label>
              <textarea value={form.description_tk ?? ''} onChange={(e) => set('description_tk', e.target.value)} rows={2} className="input text-sm resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">Цена (м.)</label>
              <input type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))} className="input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-sage-600 dark:text-sage-300 mb-1">URL изображения</label>
              <input value={form.imageUrl ?? ''} onChange={(e) => set('imageUrl', e.target.value)} className="input text-sm" placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => set('available', e.target.checked)} className="w-4 h-4 accent-sage-600" />
              <span className="text-sm text-sage-700 dark:text-sage-200">В наличии</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-sage-600" />
              <span className="text-sm text-sage-700 dark:text-sage-200">Рекомендуем</span>
            </label>
          </div>
        </div>
        <div className="p-5 border-t border-cream-200 dark:border-sage-700 flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">Отмена</button>
          <button
            onClick={() => onSave(form)}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null)
  const [itemModal, setItemModal] = useState<Partial<MenuItem> | null | 'new'>(null)
  const [newCatName, setNewCatName] = useState('')
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchAll = useCallback(async () => {
    const [cats, menuItems] = await Promise.all([
      fetch('/api/admin/categories').then((r) => r.json()),
      fetch('/api/menu').then((r) => r.json()),
    ])
    setCategories(cats)
    setItems(menuItems)
    if (!selectedCatId && cats.length > 0) setSelectedCatId(cats[0].id)
    setLoading(false)
  }, [selectedCatId])

  useEffect(() => { fetchAll() }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(categories, oldIndex, newIndex).map((c, i) => ({ ...c, position: i }))
    setCategories(reordered)
    await Promise.all(
      reordered.map((c) =>
        fetch(`/api/categories/${c.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: c.position }),
        })
      )
    )
  }

  const toggleCatVisible = async (cat: Category) => {
    await fetch(`/api/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !cat.visible }),
    })
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, visible: !c.visible } : c))
    )
  }

  const deleteCategory = async (id: number) => {
    if (!confirm('Удалить категорию со всеми позициями?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    setCategories((prev) => prev.filter((c) => c.id !== id))
    if (selectedCatId === id) setSelectedCatId(null)
  }

  const addCategory = async () => {
    if (!newCatName.trim()) return
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name_ru: newCatName, name_tk: newCatName, position: categories.length }),
    })
    const cat = await res.json()
    setCategories((prev) => [...prev, cat])
    setNewCatName('')
  }

  const saveItem = async (data: Partial<MenuItem>) => {
    if (data.id) {
      const res = await fetch(`/api/menu/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updated = await res.json()
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    } else {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, categoryId: selectedCatId }),
      })
      const created = await res.json()
      setItems((prev) => [...prev, created])
    }
    setItemModal(null)
  }

  const deleteItem = async (id: number) => {
    if (!confirm('Удалить позицию?')) return
    await fetch(`/api/menu/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const toggleAvailable = async (item: MenuItem) => {
    await fetch(`/api/menu/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !item.available }),
    })
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
    )
  }

  const catItems = items.filter((i) => i.categoryId === selectedCatId)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-playfair text-2xl font-semibold text-sage-800 dark:text-cream-100">Меню</h1>
      </div>

      {loading ? (
        <div className="h-64 card animate-pulse bg-cream-200 dark:bg-sage-800" />
      ) : (
        <div className="flex gap-6">
          {/* Categories sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="card p-3">
              <p className="text-xs font-semibold text-sage-500 uppercase tracking-wide px-1 mb-2">
                Категории
              </p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={categories.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-0.5">
                    {categories.map((cat) => (
                      <SortableCategoryRow
                        key={cat.id}
                        cat={cat}
                        isSelected={selectedCatId === cat.id}
                        onSelect={() => setSelectedCatId(cat.id)}
                        onToggleVisible={() => toggleCatVisible(cat)}
                        onEdit={() => {
                          const name = prompt('Название категории (RU):', cat.name_ru)
                          if (name) {
                            fetch(`/api/categories/${cat.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ name_ru: name }),
                            }).then(() =>
                              setCategories((prev) =>
                                prev.map((c) => (c.id === cat.id ? { ...c, name_ru: name } : c))
                              )
                            )
                          }
                        }}
                        onDelete={() => deleteCategory(cat.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add category */}
              <div className="mt-3 flex gap-2">
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                  placeholder="Новая категория"
                  className="input text-xs py-2 flex-1"
                />
                <button
                  onClick={addCategory}
                  className="w-8 h-8 flex items-center justify-center bg-sage-600 hover:bg-sage-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sage-800 dark:text-cream-100">
                {categories.find((c) => c.id === selectedCatId)?.name_ru ?? 'Выберите категорию'}
                <span className="ml-2 text-sm font-normal text-sage-400">({catItems.length})</span>
              </h2>
              {selectedCatId && (
                <button
                  onClick={() => setItemModal('new')}
                  className="btn-primary text-sm flex items-center gap-1.5 py-2"
                >
                  <Plus className="w-4 h-4" />
                  Добавить позицию
                </button>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {catItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="card p-3 flex items-center gap-3"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name_ru}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm text-sage-800 dark:text-cream-100 truncate">
                          {item.name_ru}
                        </span>
                        {item.featured && (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-sage-400 truncate">{item.description_ru}</p>
                      <p className="text-xs font-semibold text-sage-600 dark:text-sage-300 mt-0.5">
                        {new Intl.NumberFormat('ru-RU').format(item.price)} м.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleAvailable(item)}
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ${
                          item.available
                            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {item.available ? 'Есть' : 'Нет'}
                      </button>
                      <button
                        onClick={() => setItemModal(item)}
                        className="w-7 h-7 flex items-center justify-center text-sage-400 hover:text-sage-600 hover:bg-cream-100 dark:hover:bg-sage-700 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-sage-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Item modal */}
      {itemModal !== null && (
        <ItemModal
          item={itemModal === 'new' ? null : itemModal}
          categoryId={selectedCatId ?? 0}
          onSave={saveItem}
          onClose={() => setItemModal(null)}
        />
      )}
    </div>
  )
}
