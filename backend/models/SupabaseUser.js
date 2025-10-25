import { supabase } from '../config/supabase.js'
import bcrypt from 'bcryptjs'

export class SupabaseUser {
  static async create({ name, email, password, role = 'user' }) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(password, salt)

      const { data, error } = await supabase
        .from('users')
        .insert([{
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role,
          business_profile: {}
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async findOne(query) {
    try {
      let supabaseQuery = supabase.from('users').select('*')
      
      if (query.email) {
        supabaseQuery = supabaseQuery.eq('email', query.email.toLowerCase())
      }
      if (query.id) {
        supabaseQuery = supabaseQuery.eq('id', query.id)
      }

      const { data, error } = await supabaseQuery.single()
      
      if (error) {
        if (error.code === 'PGRST116') return null // No rows found
        throw error
      }
      
      return data
    } catch (error) {
      return null
    }
  }

  static async findById(id) {
    return await this.findOne({ id })
  }

  static async findByIdAndUpdate(id, update) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...update,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async updateLastLogin(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async countDocuments() {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (error) throw error
      return count || 0
    } catch (error) {
      return 0
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
