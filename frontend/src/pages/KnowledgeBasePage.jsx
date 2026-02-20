import { useState, useEffect } from 'react'
import {
  getKnowledgeEntries,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
} from '../services/api'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'

export default function KnowledgeBasePage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  })

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const data = await getKnowledgeEntries()
      setEntries(data)
    } catch (error) {
      console.error('Error loading knowledge base:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingEntry(null)
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: '',
    })
    setShowModal(true)
  }

  const handleEdit = (entry) => {
    setEditingEntry(entry)
    setFormData({
      title: entry.title,
      content: entry.content,
      category: entry.category || '',
      tags: entry.tags ? entry.tags.join(', ') : '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteKnowledgeEntry(id)
        loadEntries()
      } catch (error) {
        console.error('Error deleting entry:', error)
        alert('Error deleting entry')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const entryData = {
        title: formData.title,
        content: formData.content,
        category: formData.category || null,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim())
          : [],
      }

      if (editingEntry) {
        await updateKnowledgeEntry(editingEntry.id, entryData)
      } else {
        await createKnowledgeEntry(entryData)
      }

      setShowModal(false)
      loadEntries()
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Error saving entry')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Manage FAQ and support content</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>
      </div>

      {/* Entries Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No knowledge base entries yet</p>
          <button
            onClick={handleCreate}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Create First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1 text-gray-400 hover:text-primary-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {entry.category && (
                <span className="inline-block px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded mb-2">
                  {entry.category}
                </span>
              )}
              <p className="text-sm text-gray-600 line-clamp-3">{entry.content}</p>
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {entry.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingEntry ? 'Edit Entry' : 'Create Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., FAQ, Product Info, Policy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., shipping, returns, billing"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingEntry ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
