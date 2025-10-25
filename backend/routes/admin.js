import express from 'express'
import { SupabaseUser } from '../models/SupabaseUser.js'
import { SupabaseChat } from '../models/SupabaseChat.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// Get admin dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    // Get total users
    const totalUsers = await SupabaseUser.countDocuments()
    
    // Get total chats
    const totalChats = await SupabaseChat.countDocuments()
    
    // Get common challenges
    const challengesAggregation = await SupabaseChat.aggregate([
      { $match: { 'businessData.challenges': { $exists: true, $ne: '' } } },
      { $group: { 
          _id: '$businessData.challenges',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])

    const commonChallenges = challengesAggregation.map(item => ({
      challenge: item._id ? item._id.substring(0, 50) + '...' : 'Unknown',
      count: item.count
    }))

    // Mock mentor stats (since we don't have mentor tracking yet)
    const mentorStats = [
      { name: 'Sarah Chen', sessions: 89, rating: 4.9, revenue: '$3,960' },
      { name: 'Mike Rodriguez', sessions: 76, rating: 4.8, revenue: '$4,560' },
      { name: 'Emma Thompson', sessions: 62, rating: 4.7, revenue: '$3,100' },
      { name: 'David Kim', sessions: 58, rating: 4.9, revenue: '$4,060' }
    ]

    res.json({
      success: true,
      totalUsers,
      totalChats,
      commonChallenges,
      mentorStats
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await SupabaseUser.find({
      sort: { createdAt: -1 },
      limit: 50
    })

    res.json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
