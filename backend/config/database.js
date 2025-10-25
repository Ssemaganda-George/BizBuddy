import { connectSupabase } from './supabase.js'

const connectDB = async () => {
  await connectSupabase()
}

export default connectDB
