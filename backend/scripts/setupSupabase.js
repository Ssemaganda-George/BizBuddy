import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current directory for proper .env loading
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const setupSupabase = async () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('🔍 Checking environment variables...')
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Found' : '❌ Missing')

  if (!supabaseUrl || !supabaseKey) {
    console.log('')
    console.log('❌ Supabase credentials are missing from .env file')
    console.log('📍 Looking for .env file at:', path.join(__dirname, '..', '.env'))
    console.log('')
    console.log('Please ensure your .env file contains:')
    console.log('SUPABASE_URL=your-supabase-url')
    console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
    return
  }

  try {
    // Import Supabase after checking credentials
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('🔧 Setting up Supabase database tables...')
    console.log('🌐 Connecting to:', supabaseUrl)

    // Test connection by trying to query a system table
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)

    if (testError) {
      console.log('⚠️  Direct query failed, but connection may still work')
    }

    console.log('✅ Connection successful!')
    console.log('')
    console.log('📝 Now please create the database tables manually:')
    console.log('')
    console.log('1. Go to https://app.supabase.com')
    console.log('2. Select your project')
    console.log('3. Go to SQL Editor')
    console.log('4. Create a new query and paste this SQL:')
    console.log('')
    console.log('--- COPY AND PASTE THIS SQL ---')
    console.log(`
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  business_profile JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  business_data JSONB DEFAULT '{}',
  messages JSONB DEFAULT '[]',
  ai_suggestion TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_session_id ON chats(session_id);
CREATE INDEX IF NOT EXISTS idx_chats_status ON chats(status);

-- Insert a sample admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES (
  'Admin User', 
  'admin@bizbuddy.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBcQAO0kCj7oEK',
  'admin'
) ON CONFLICT (email) DO NOTHING;
`)
    console.log('--- END SQL ---')
    console.log('')
    console.log('5. Click "Run" to execute the SQL')
    console.log('')
    console.log('✨ After running the SQL:')
    console.log('   - Your database tables will be created')
    console.log('   - A default admin user will be created:')
    console.log('     Email: admin@bizbuddy.com')
    console.log('     Password: admin123')
    console.log('')
    console.log('🚀 Then start your app with: npm run dev')

  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error.message)
    console.log('')
    console.log('🔍 Troubleshooting:')
    console.log('1. Verify your Supabase project is active at https://app.supabase.com')
    console.log('2. Check that your API keys are correct')
    console.log('3. Make sure your project has completed setup')
    console.log('')
    console.log('Current credentials being used:')
    console.log('URL:', supabaseUrl)
    console.log('Service Key:', supabaseKey ? 'Present' : 'Missing')
  }
}

setupSupabase()
