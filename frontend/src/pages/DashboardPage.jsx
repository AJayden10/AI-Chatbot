import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  getAnalyticsSummary,
  getConversationVolume,
  getSentimentTrends,
  getTopCategories,
} from '../services/api'
import { TrendingUp, MessageSquare, AlertTriangle, Users } from 'lucide-react'

const COLORS = ['#0ea5e9', '#10b981', '#ef4444', '#f59e0b']

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [volume, setVolume] = useState([])
  const [sentimentTrends, setSentimentTrends] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    loadData()
  }, [days])

  const loadData = async () => {
    setLoading(true)
    try {
      const [summaryData, volumeData, trendsData, categoriesData] = await Promise.all([
        getAnalyticsSummary(days),
        getConversationVolume(days),
        getSentimentTrends(days),
        getTopCategories(),
      ])
      setSummary(summaryData)
      setVolume(volumeData)
      setSentimentTrends(trendsData)
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  const sentimentData = summary
    ? [
        { name: 'Positive', value: summary.sentiment_distribution.positive },
        { name: 'Neutral', value: summary.sentiment_distribution.neutral },
        { name: 'Negative', value: summary.sentiment_distribution.negative },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Conversations"
          value={summary?.total_conversations || 0}
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="Active Conversations"
          value={summary?.active_conversations || 0}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Escalated"
          value={summary?.escalated_conversations || 0}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Positive Sentiment"
          value={summary?.sentiment_distribution?.positive || 0}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Conversation Volume */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Conversation Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sentiment Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top Query Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
