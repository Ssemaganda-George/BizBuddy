import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = mongoose.model('User', userSchema)

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bizbuddy.com' })
    if (existingAdmin) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@bizbuddy.com',
      password: 'admin123', // Change this!
      role: 'admin'
    })

    await adminUser.save()
    console.log('Admin user created successfully!')
    console.log('Email: admin@bizbuddy.com')
    console.log('Password: admin123')
    console.log('Please change the password after first login!')
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdmin()
