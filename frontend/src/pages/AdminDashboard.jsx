import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { MessageCircle, Users, TrendingUp, Star, ArrowLeft } from 'lucide-react'
import axios from 'axios'

export const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChats: 0,
    commonChallenges: [],
    mentorStats: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/chat')
      return
    }
    fetchStats()
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats')
      setStats(response.data)
    } catch (error) {
      // Mock data for demo
      setStats({
        totalUsers: 1247,
        totalChats: 3891,
        commonChallenges: [
          { challenge: 'Cash Flow Management', count: 342 },
          { challenge: 'Digital Marketing', count: 298 },
          { challenge: 'Staff Hiring', count: 187 },
          { challenge: 'Operations Efficiency', count: 156 },
          { challenge: 'Customer Acquisition', count: 134 }
        ],
        mentorStats: [
          { name: 'Sarah Chen', sessions: 89, rating: 4.9, revenue: '$3,960' },
          { name: 'Mike Rodriguez', sessions: 76, rating: 4.8, revenue: '$4,560' },
          { name: 'Emma Thompson', sessions: 62, rating: 4.7, revenue: '$3,100' },
          { name: 'David Kim', sessions: 58, rating: 4.9, revenue: '$4,060' }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-mint-50 to-sunny-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-mint-50 to-sunny-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/chat')}
                className="text-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chat
              </Button>
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-primary-500 to-mint-500 p-2 rounded-xl">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">BizBuddy Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor platform performance and user engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-primary-100 rounded-xl p-3">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Chats</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalChats.toLocaleString()}</p>
              </div>
              <div className="bg-mint-100 rounded-xl p-3">
                <MessageCircle className="h-6 w-6 text-mint-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-800">4.8</p>
              </div>
              <div className="bg-sunny-100 rounded-xl p-3">
                <Star className="h-6 w-6 text-sunny-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-800">+23%</p>
              </div>
              <div className="bg-primary-100 rounded-xl p-3">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Common Challenges */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Most Common Challenges</h2>
            <div className="space-y-4">
              {stats.commonChallenges.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-primary-500 to-mint-500 text-white rounded-lg w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{item.challenge}</span>
                  </div>
                  <span className="text-gray-500 font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mentor Performance */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Mentor Performance</h2>
            <div className="space-y-4">
              {stats.mentorStats.map((mentor, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{mentor.name}</h3>
                    <div className="flex items-center gap-1 text-sunny-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">{mentor.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{mentor.sessions} sessions</span>
                    <span className="font-medium text-mint-600">{mentor.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
