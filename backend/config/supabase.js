import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase = null

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} else {
  console.log('⚠️  Supabase credentials not found - run setup:supabase first')
}

export { supabase }

export const connectSupabase = async () => {
  if (!supabase) {
    console.log('❌ Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
    return
  }

  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist"
      throw error
    }
    console.log('✅ Supabase Connected Successfully')
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message)
    console.log('🔧 Run "npm run setup:supabase" to create database tables')
  }
}
