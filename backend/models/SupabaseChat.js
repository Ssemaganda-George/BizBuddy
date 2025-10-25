import { supabase } from '../config/supabase.js'

export class SupabaseChat {
  static async create(chatData) {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([{
          user_id: chatData.userId,
          session_id: chatData.sessionId,
          business_data: chatData.businessData || {},
          messages: chatData.messages || [],
          ai_suggestion: chatData.aiSuggestion,
          status: chatData.status || 'active'
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async find(query = {}) {
    try {
      let supabaseQuery = supabase.from('chats').select('*')

      if (query.userId) {
        supabaseQuery = supabaseQuery.eq('user_id', query.userId)
      }

      if (query.sort) {
        const sortField = Object.keys(query.sort)[0]
        const sortOrder = query.sort[sortField] === -1 ? 'desc' : 'asc'
        supabaseQuery = supabaseQuery.order(sortField === 'createdAt' ? 'created_at' : sortField, { ascending: sortOrder === 'asc' })
      }

      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit)
      }

      const { data, error } = await supabaseQuery

      if (error) throw error
      return data || []
    } catch (error) {
      return []
    }
  }

  static async countDocuments() {
    try {
      const { count, error } = await supabase
        .from('chats')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return count || 0
    } catch (error) {
      return 0
    }
  }

  static async aggregate(pipeline) {
    try {
      // Simple aggregation for common challenges
      if (pipeline.some(stage => stage.$group && stage.$group._id === '$business_data.challenges')) {
        const { data, error } = await supabase
          .from('chats')
          .select('business_data')

        if (error) throw error

        // Process challenges data
        const challengeCounts = {}
        data.forEach(chat => {
          if (chat.business_data?.challenges) {
            const challenge = chat.business_data.challenges.substring(0, 50)
            challengeCounts[challenge] = (challengeCounts[challenge] || 0) + 1
          }
        })

        return Object.entries(challengeCounts)
          .map(([challenge, count]) => ({ _id: challenge, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      }

      return []
    } catch (error) {
      return []
    }
  }
}
