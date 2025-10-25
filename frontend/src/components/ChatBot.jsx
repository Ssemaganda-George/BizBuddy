import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react'
import { MentorModal } from './MentorModal'
import axios from 'axios'

const businessTypes = [
  'Retail Store',
  'Restaurant/Food Service',
  'Professional Services',
  'Technology/Software',
  'Healthcare/Wellness',
  'Manufacturing',
  'Construction',
  'E-commerce',
  'Consulting',
  'Other'
]

const businessAges = [
  'Just starting (0-6 months)',
  'Early stage (6 months - 2 years)',
  'Growing (2-5 years)',
  'Established (5+ years)'
]

export const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "👋 Welcome to BizBuddy! I'm here to help with your business challenges and provide practical solutions. Let's start with some quick questions about your business.",
      timestamp: new Date()
    }
  ])
  const [currentStep, setCurrentStep] = useState('greeting')
  const [userInput, setUserInput] = useState('')
  const [businessData, setBusinessData] = useState({})
  const [showMentorModal, setShowMentorModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (currentStep === 'business-age') {
      askBusinessAge()
    } else if (currentStep === 'business-type') {
      askBusinessType()
    } else if (currentStep === 'challenges') {
      askChallenges()
    }
  }, [currentStep])

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const askBusinessAge = () => {
    setTimeout(() => {
      addMessage('bot', "Great! First, how long has your business been operating?")
    }, 1000)
  }

  const askBusinessType = () => {
    setTimeout(() => {
      addMessage('bot', "Perfect! Now, what type of business do you run?")
    }, 1000)
  }

  const askChallenges = () => {
    setTimeout(() => {
      addMessage('bot', "Excellent! Now tell me about your biggest business challenges right now. What's keeping you up at night? (Feel free to describe in detail)")
    }, 1000)
  }

  const handleBusinessAgeSelect = (age) => {
    setBusinessData(prev => ({ ...prev, age }))
    addMessage('user', age)
    setCurrentStep('business-type')
  }

  const handleBusinessTypeSelect = (type) => {
    setBusinessData(prev => ({ ...prev, type }))
    addMessage('user', type)
    setCurrentStep('challenges')
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const extractUrlFromMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const matches = message.match(urlRegex)
    return matches ? matches[0] : null
  }

  const analyzeWebsite = async (websiteUrl) => {
    setIsLoading(true)
    
    try {
      addMessage('bot', `🔍 Analyzing your website: ${websiteUrl}\n\nThis may take a moment while I examine your site's structure, content, SEO, and user experience...`)
      
      const response = await axios.post('/api/chat/analyze-website', {
        websiteUrl: websiteUrl,
        businessType: businessData.type
      })
      
      const analysisResponse = response.data.response
      addMessage('bot', analysisResponse)
      
    } catch (error) {
      console.error('Website analysis error:', error)
      addMessage('bot', `❌ I had trouble analyzing your website. This could be due to:\n\n• The website being password protected\n• Slow loading times\n• Technical restrictions\n\nHowever, I can still help you with general website improvement advice! What specific aspect of your website would you like to improve? (SEO, design, conversion, mobile experience, etc.)`)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userMessage, isInitialDiagnosis = false) => {
    setIsLoading(true)
    
    try {
      // Check if message contains a website URL
      const extractedUrl = extractUrlFromMessage(userMessage)
      
      if (extractedUrl && isValidUrl(extractedUrl)) {
        await analyzeWebsite(extractedUrl)
        return
      }

      const response = await axios.post('/api/chat/respond', {
        message: userMessage,
        businessAge: businessData.age,
        businessType: businessData.type,
        conversationHistory: messages.slice(-5), // Send last 5 messages for context
        isInitialDiagnosis
      })
      
      const aiResponse = response.data.response
      addMessage('bot', aiResponse)
      
    } catch (error) {
      // Enhanced fallback responses based on conversation context
      const mockResponse = generateEnhancedMockResponse(userMessage)
      addMessage('bot', mockResponse)
    } finally {
      setIsLoading(false)
    }
  }

  const generateEnhancedMockResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Check for website-related queries
    if (lowerMessage.includes('website') || lowerMessage.includes('site') || lowerMessage.includes('web')) {
      return "🌐 **Website Analysis & Improvement:**\n\n🔍 **Share Your Website:**\nJust paste your website URL (like https://yoursite.com) and I'll analyze it for you!\n\n📊 **What I'll Check:**\n• SEO optimization (meta tags, headings, keywords)\n• Mobile responsiveness and user experience\n• Loading speed and performance\n• Contact information and call-to-action buttons\n• Content structure and navigation\n• Conversion optimization opportunities\n\n🚀 **Common Website Issues I Find:**\n• Missing or poor meta descriptions\n• No clear call-to-action buttons\n• Poor mobile optimization\n• Slow loading times\n• Missing contact information\n• Weak content structure\n\n💡 **Quick Website Tips:**\n• Ensure your site loads in under 3 seconds\n• Make your phone number clickable on mobile\n• Add customer testimonials and reviews\n• Use clear, action-oriented button text\n• Optimize images for faster loading\n\nPaste your website URL and I'll give you a detailed analysis!"
    }
    
    if (lowerMessage.includes('cash') || lowerMessage.includes('money') || lowerMessage.includes('finance') || lowerMessage.includes('revenue')) {
      return "💰 **Cash Flow & Finance Insights:**\n\n🔍 **Recent Trends:** Many businesses are leveraging AI-powered financial tools to improve cash flow forecasting.\n\n📊 **Practical Steps:**\n• Try Wave Accounting (free) or QuickBooks for automated tracking\n• Set up recurring invoices to improve cash flow predictability\n• Consider offering 2/10 net 30 terms (2% discount if paid in 10 days)\n• Look into local CDFI loans or SBA microloans\n• Use tools like Fundbox for invoice factoring\n\n💡 **Pro Tip:** Create a 13-week rolling cash flow forecast and update it weekly. This helps you spot problems before they become critical!\n\nWhat specific financial challenge would you like to dive deeper into?"
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('customer') || lowerMessage.includes('sales') || lowerMessage.includes('grow')) {
      return "📱 **Marketing & Growth Strategies:**\n\n🎯 **Current Best Practices:**\n• Local SEO is crucial - claim your Google Business Profile\n• Video content gets 1200% more shares than text and images combined\n• Email marketing still has the highest ROI at $42 for every $1 spent\n\n🚀 **Action Plan:**\n• Start with Google My Business optimization (free traffic!)\n• Create weekly behind-the-scenes content for social media\n• Set up automated email sequences for new customers\n• Partner with complementary local businesses for cross-promotion\n• Try micro-influencer partnerships in your area\n\n📈 **Budget-Friendly Tools:**\n• Canva for design, Buffer for scheduling, Mailchimp for email\n• Start with $5/day Facebook/Instagram ads targeting local audience\n\nWhat's your current marketing challenge - getting new customers or keeping existing ones?"
    }
    
    if (lowerMessage.includes('staff') || lowerMessage.includes('employee') || lowerMessage.includes('hire') || lowerMessage.includes('team')) {
      return "👥 **Staffing & Team Building:**\n\n🔍 **Current Job Market Insights:** Remote work options and flexible schedules are now table stakes for attracting good talent.\n\n✅ **Smart Hiring Strategies:**\n• Post on Indeed (free), LinkedIn, and local Facebook groups\n• Offer skills-based assessments instead of just interviews\n• Consider part-time or contract workers to start\n• Create clear job descriptions with growth paths\n• Implement a referral bonus program\n\n🎯 **Retention Tips:**\n• Regular one-on-ones and feedback sessions\n• Professional development budget (even $500/year helps)\n• Flexible work arrangements where possible\n• Recognize achievements publicly\n\n💼 **Cost-Effective Benefits:**\n• Flexible PTO, professional development opportunities, remote work days\n\nWhat's your biggest staffing challenge right now - finding people or keeping them?"
    }
    
    if (lowerMessage.includes('tech') || lowerMessage.includes('digital') || lowerMessage.includes('online') || lowerMessage.includes('website')) {
      return "💻 **Technology & Digital Transformation:**\n\n🌐 **Essential Tech Stack for Small Business:**\n• Website: WordPress, Squarespace, or Wix for easy management\n• Payments: Square, Stripe, or PayPal for online transactions\n• Communication: Slack or Microsoft Teams for internal chat\n• Project Management: Trello, Asana, or Monday.com\n\n🚀 **AI Tools That Actually Help:**\n• ChatGPT for content creation and customer service\n• Canva's AI for quick design work\n• Calendly for automated scheduling\n• Zapier for connecting different tools\n\n📱 **Mobile-First Approach:**\n• 60% of searches happen on mobile - ensure your site is mobile-friendly\n• Consider a simple app or PWA for regular customers\n• QR codes for contactless menus/catalogs\n\n🔒 **Don't Forget Security:**\n• Use strong passwords and 2FA everywhere\n• Regular backups (automated if possible)\n• Basic cybersecurity training for staff\n\nWhat technology challenge can I help you solve?"
    }
    
    if (lowerMessage.includes('operation') || lowerMessage.includes('process') || lowerMessage.includes('efficiency') || lowerMessage.includes('productivity')) {
      return "⚙️ **Operations & Efficiency Optimization:**\n\n📋 **Process Documentation:**\n• Document your top 5 most important processes first\n• Use tools like Loom to create video tutorials\n• Create checklists for recurring tasks\n• Implement standard operating procedures (SOPs)\n\n🔄 **Automation Opportunities:**\n• Automate invoice generation and reminders\n• Set up email autoresponders\n• Use scheduling tools for social media\n• Implement inventory management systems\n\n📊 **Key Metrics to Track:**\n• Customer acquisition cost (CAC)\n• Customer lifetime value (CLV)\n• Time to complete key processes\n• Employee productivity metrics\n\n🎯 **Quick Wins:**\n• Batch similar tasks together\n• Eliminate unnecessary meetings\n• Use templates for common communications\n• Implement a simple project management system\n\nWhat operational bottleneck is slowing you down the most?"
    }
    
    // General business advice for other queries
    return "🎯 **General Business Growth Insights:**\n\n📈 **Focus Areas for 2024:**\n• Customer experience is the new competitive advantage\n• Sustainability practices are becoming customer expectations\n• Local community engagement drives loyalty\n• Data-driven decision making is essential\n\n💡 **Universal Business Principles:**\n• Know your numbers (revenue, costs, margins)\n• Listen to your customers obsessively\n• Invest in your team's growth\n• Stay lean but think big\n• Build systems, not just processes\n\n🚀 **Next Steps:**\n• Identify your biggest constraint right now\n• Focus on one improvement at a time\n• Measure results and adjust quickly\n• Connect with other local business owners\n\nWhat specific area of your business would you like to explore further? I'm here to help with detailed, actionable advice!"
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return
    
    if (currentStep === 'challenges') {
      const challenges = userInput
      setBusinessData(prev => ({ ...prev, challenges }))
      addMessage('user', challenges)
      setUserInput('')
      generateAIResponse(challenges, true)
      setCurrentStep('conversation')
      setConversationStarted(true)
    } else if (currentStep === 'conversation') {
      addMessage('user', userInput)
      const message = userInput
      setUserInput('')
      generateAIResponse(message, false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[600px] bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col relative">
      {/* Always visible mentor button */}
      {conversationStarted && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={() => setShowMentorModal(true)}
            className="bg-gradient-to-r from-mint-500 to-sunny-500 hover:from-mint-600 hover:to-sunny-600 text-white font-medium px-4 py-2 rounded-xl shadow-lg text-sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            💬 Mentors
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-mint-500 text-white p-4 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8" />
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              BizBuddy AI Assistant
              <Sparkles className="h-5 w-5" />
            </h3>
            <p className="text-primary-100 text-sm">Your 24/7 business growth companion with real-time insights</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'bot' && (
              <div className="bg-primary-100 rounded-full p-2 self-start">
                <Bot className="h-5 w-5 text-primary-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-xl ${
                message.type === 'user'
                  ? 'bg-primary-500 text-white ml-auto'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content.split('\n').map((line, index) => (
                <div key={index}>
                  {line.startsWith('**') && line.endsWith('**') ? (
                    <strong className="text-primary-600">{line.slice(2, -2)}</strong>
                  ) : line.startsWith('• ') ? (
                    <div className="ml-4 mb-1">• {line.slice(2)}</div>
                  ) : line.startsWith('🔍 ') || line.startsWith('📊 ') || line.startsWith('💡 ') || line.startsWith('🚀 ') || line.startsWith('📈 ') || line.startsWith('🎯 ') ? (
                    <div className="font-medium text-gray-700 mt-2 mb-1">{line}</div>
                  ) : (
                    <div>{line}</div>
                  )}
                </div>
              ))}
            </div>
            {message.type === 'user' && (
              <div className="bg-mint-100 rounded-full p-2 self-start">
                <User className="h-5 w-5 text-mint-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="bg-primary-100 rounded-full p-2">
              <Bot className="h-5 w-5 text-primary-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">Analyzing insights...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-4">
        {currentStep === 'business-age' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">Select your business age:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {businessAges.map((age) => (
                <Button
                  key={age}
                  onClick={() => handleBusinessAgeSelect(age)}
                  variant="outline"
                  className="text-left justify-start"
                >
                  {age}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {currentStep === 'business-type' && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">Select your business type:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {businessTypes.map((type) => (
                <Button
                  key={type}
                  onClick={() => handleBusinessTypeSelect(type)}
                  variant="outline"
                  className="text-left justify-start text-sm"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {(currentStep === 'challenges' || currentStep === 'conversation') && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentStep === 'challenges' 
                    ? "Describe your biggest business challenges..." 
                    : "Ask me anything or share your website URL for analysis..."
                }
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!userInput.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {currentStep === 'conversation' && (
              <div className="text-xs text-gray-500 text-center">
                💡 Tip: Paste your website URL for instant analysis, or ask about marketing, finance, operations, etc.
              </div>
            )}
          </div>
        )}
        
        {currentStep === 'greeting' && (
          <div className="text-center">
            <Button onClick={() => setCurrentStep('business-age')} className="px-8">
              Let's Get Started! 🚀
            </Button>
          </div>
        )}
      </div>

      <MentorModal open={showMentorModal} onOpenChange={setShowMentorModal} />
    </div>
  )
}
