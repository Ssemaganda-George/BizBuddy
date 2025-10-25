<<<<<<< HEAD
# BizBuddy
Your daily business assistant
=======
# BizBuddy - AI Business Growth Platform

**Tagline**: "Real help. Simple ideas. Smarter growth."

BizBuddy is a friendly AI + mentor platform that helps small businesses diagnose challenges and discover simple, local, affordable solutions with real-time website analysis capabilities.

## 🚀 Features

- 🤖 **AI-Powered Business Diagnosis**: Interactive chat-style onboarding to understand business challenges
- 🌐 **Website Analysis**: Automated website auditing with SEO, UX, and conversion optimization insights
- 👥 **Expert Mentor Network**: Connect with experienced business professionals instantly
- 📊 **Admin Dashboard**: Comprehensive analytics and platform management
- 🔐 **Secure Authentication**: JWT-based authentication with Supabase integration
- 💬 **Persistent Chat History**: Store and retrieve conversation history
- ✏️ **Edit & Resend**: Modify and resend messages for better AI responses
- 📱 **Responsive Design**: Modern, mobile-first UI with pastel color scheme

## 🛠 Tech Stack

- **Frontend**: React (Vite) + TailwindCSS + shadcn/ui components
- **Backend**: Node.js + Express + Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt password hashing
- **Website Analysis**: Cheerio + Axios for web scraping
- **Real-time Features**: RESTful API with real-time insights

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase account
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ssemaganda-George/BizBuddy.git
   cd BizBuddy
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys
   - Update `backend/.env` with your Supabase credentials

4. **Configure environment**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your Supabase credentials
   ```

5. **Set up database**:
   ```bash
   npm run setup:supabase
   # Follow the instructions to run SQL in Supabase dashboard
   ```

6. **Start development servers**:
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## 📁 Project Structure

```
BizBuddy/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Base UI components (Button, Input, etc.)
│   │   │   ├── ChatBot.jsx  # Main chatbot interface
│   │   │   └── MentorModal.jsx # Mentor connection modal
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (authentication)
│   │   └── lib/             # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/               # Node.js backend application
│   ├── routes/             # API route handlers
│   ├── models/             # Supabase data models
│   ├── services/           # Business logic services
│   │   └── websiteAnalyzer.js # Website analysis service
│   ├── middleware/         # Express middleware
│   ├── config/             # Database and app configuration
│   └── scripts/            # Setup and utility scripts
├── .gitignore
├── package.json           # Root package.json for scripts
└── README.md
```

## 🔑 Environment Variables

Create `backend/.env` with:

```env
NODE_ENV=development
PORT=5001

# Supabase Configuration
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Chat & AI
- `POST /api/chat/respond` - Get AI response for user message
- `POST /api/chat/analyze-website` - Analyze website and provide insights
- `GET /api/chat/history` - Get user chat history

### Admin (Admin only)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users

## 👤 Default Accounts

### Admin User
- **Email**: admin@bizbuddy.com
- **Password**: admin123

### Sample Mentors
- Sarah Chen (Digital Marketing)
- Mike Rodriguez (Financial Planning)
- Emma Thompson (Operations & HR)
- David Kim (Tech & Innovation)

## 🌐 Website Analysis Features

BizBuddy can analyze any website URL and provide insights on:

- **SEO Optimization**: Meta tags, headings, structured data
- **Mobile Responsiveness**: Viewport configuration, responsive design
- **User Experience**: Call-to-action buttons, navigation, forms
- **Performance**: Image optimization, loading speed indicators
- **Content Quality**: Heading structure, content organization
- **Contact Information**: Accessibility of contact methods
- **Social Media Presence**: Connected platforms and engagement

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy from the `backend` directory
3. Run database setup script

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@bizbuddy.com
- **Documentation**: [Wiki](https://github.com/Ssemaganda-George/BizBuddy/wiki)
- **Issues**: [GitHub Issues](https://github.com/Ssemaganda-George/BizBuddy/issues)

## 🙏 Acknowledgments

- OpenAI for AI inspiration
- Supabase for backend infrastructure
- Vercel for hosting solutions
- The amazing open-source community

---

**Built with ❤️ for small businesses worldwide**
>>>>>>> master
