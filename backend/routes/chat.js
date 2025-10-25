import express from 'express'
import { SupabaseChat } from '../models/SupabaseChat.js'
import { SupabaseUser } from '../models/SupabaseUser.js'
import { protect } from '../middleware/auth.js'
import { WebsiteAnalyzer } from '../services/websiteAnalyzer.js'

const router = express.Router()

// Generate AI response (mock implementation)
const generateAIResponse = (businessAge, businessType, challenges) => {
  const responses = {
    cashflow: "💰 **Cash Flow Solutions:**\n• Set up a simple accounting system (try Wave or QuickBooks)\n• Offer early payment discounts to customers\n• Consider invoice factoring for immediate cash\n• Create a 13-week cash flow forecast\n• Look into local small business grants",
    
    marketing: "📱 **Marketing on a Budget:**\n• Start with Google My Business (free!)\n• Create engaging social media content\n• Ask happy customers for reviews\n• Partner with complementary local businesses\n• Try Facebook/Instagram ads with $5/day budget",
    
    staff: "👥 **Staffing & HR Solutions:**\n• Use free job boards like Indeed\n• Create clear job descriptions and processes\n• Implement simple performance reviews\n• Consider part-time or contract workers\n• Look into local workforce development programs",
    
    operations: "⚙️ **Operational Efficiency:**\n• Document your key processes\n• Use free tools like Trello for task management\n• Automate repetitive tasks where possible\n• Review and optimize your supply chain\n• Implement simple quality control measures"
  }
  
  const lowerChallenges = challenges.toLowerCase()
  
  if (lowerChallenges.includes('cash') || lowerChallenges.includes('money') || lowerChallenges.includes('finance')) {
    return responses.cashflow
  } else if (lowerChallenges.includes('market') || lowerChallenges.includes('customer') || lowerChallenges.includes('sales')) {
    return responses.marketing
  } else if (lowerChallenges.includes('staff') || lowerChallenges.includes('employee') || lowerChallenges.includes('hire')) {
    return responses.staff
  } else if (lowerChallenges.includes('process') || lowerChallenges.includes('operation') || lowerChallenges.includes('efficiency')) {
    return responses.operations
  } else {
    return "🎯 **General Business Growth Tips:**\n• Focus on your most profitable customers\n• Streamline your core processes\n• Invest in digital tools gradually\n• Build strong local partnerships\n• Track key metrics weekly\n• Consider joining local business groups"
  }
}

// Diagnose business challenges
router.post('/diagnose', protect, async (req, res) => {
  try {
    const { businessAge, businessType, challenges } = req.body
    const sessionId = `session_${Date.now()}_${req.user.id}`

    // Generate AI suggestion
    const suggestion = generateAIResponse(businessAge, businessType, challenges)

    // Save chat to database
    const chat = await SupabaseChat.create({
      userId: req.user.id,
      sessionId,
      businessData: {
        age: businessAge,
        type: businessType,
        challenges
      },
      messages: [
        {
          type: 'user',
          content: `Business Age: ${businessAge}, Type: ${businessType}, Challenges: ${challenges}`
        },
        {
          type: 'bot',
          content: suggestion
        }
      ],
      aiSuggestion: suggestion,
      status: 'completed'
    })

    // Update user business profile
    await SupabaseUser.findByIdAndUpdate(req.user.id, {
      business_profile: {
        age: businessAge,
        type: businessType,
        challenges: [challenges]
      }
    })

    res.json({
      success: true,
      suggestion,
      sessionId
    })
  } catch (error) {
    console.error('Diagnose error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user chat history
router.get('/history', protect, async (req, res) => {
  try {
    const chats = await SupabaseChat.find({ 
      userId: req.user.id,
      sort: { createdAt: -1 },
      limit: 10
    })

    res.json({
      success: true,
      chats
    })
  } catch (error) {
    console.error('Chat history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add new continuous chat endpoint
router.post('/respond', protect, async (req, res) => {
  try {
    const { message, businessAge, businessType, conversationHistory, isInitialDiagnosis } = req.body
    const sessionId = `conversation_${Date.now()}_${req.user.id}`

    // Enhanced AI response generation with web context
    const response = await generateEnhancedAIResponse(
      message, 
      businessAge, 
      businessType, 
      conversationHistory,
      isInitialDiagnosis
    )

    // Save conversation to database
    const chat = await SupabaseChat.create({
      userId: req.user.id,
      sessionId,
      businessData: {
        age: businessAge,
        type: businessType,
        lastMessage: message
      },
      messages: [
        {
          type: 'user',
          content: message,
          timestamp: new Date()
        },
        {
          type: 'bot', 
          content: response,
          timestamp: new Date()
        }
      ],
      aiSuggestion: response,
      status: 'active'
    })

    res.json({
      success: true,
      response,
      sessionId
    })
  } catch (error) {
    console.error('Chat response error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add website analysis endpoint
router.post('/analyze-website', protect, async (req, res) => {
  try {
    const { websiteUrl, businessType } = req.body

    if (!websiteUrl) {
      return res.status(400).json({ message: 'Website URL is required' })
    }

    console.log(`Analyzing website: ${websiteUrl}`)
    
    // Analyze the website
    const analysis = await WebsiteAnalyzer.analyzeWebsite(websiteUrl)
    
    // Generate insights
    const insights = WebsiteAnalyzer.generateWebsiteInsights(analysis, businessType)
    
    // Generate friendly response
    const analysisResponse = WebsiteAnalyzer.generateFriendlyResponse(analysis, insights, businessType)

    // Save analysis to database
    const sessionId = `website_analysis_${Date.now()}_${req.user.id}`

    await SupabaseChat.create({
      userId: req.user.id,
      sessionId,
      businessData: {
        websiteUrl,
        businessType: businessType || 'Unknown'
      },
      messages: [
        {
          type: 'user',
          content: `Please analyze my website: ${websiteUrl}`,
          timestamp: new Date()
        },
        {
          type: 'bot',
          content: analysisResponse,
          timestamp: new Date()
        }
      ],
      aiSuggestion: analysisResponse,
      status: 'completed'
    })

    res.json({
      success: true,
      analysis,
      insights,
      response: analysisResponse
    })

  } catch (error) {
    console.error('Website analysis error:', error)
    res.status(500).json({ 
      message: 'Failed to analyze website',
      error: error.message 
    })
  }
})

// Enhanced AI response function with web-like insights
const generateEnhancedAIResponse = async (message, businessAge, businessType, conversationHistory, isInitialDiagnosis) => {
  const lowerMessage = message.toLowerCase()
  
  // Initial diagnosis with comprehensive insights
  if (isInitialDiagnosis) {
    if (lowerMessage.includes('cash') || lowerMessage.includes('money') || lowerMessage.includes('finance')) {
      return `I understand cash flow is a major concern! Let me give you some practical solutions that actually work:

**Immediate Actions You Can Take:**
Getting your cash flow under control starts with tracking it better. Set up a simple system like Wave Accounting (it's free) or QuickBooks to see where your money goes.

Try offering early payment discounts - something like "pay within 10 days, get 2% off." Most businesses see a 30% improvement in payment speed with this simple change.

**Smart Financing Options:**
Look into invoice factoring companies like Fundbox if you need cash fast. They'll advance you money on unpaid invoices, usually within 24 hours.

For ${businessType.toLowerCase()} businesses, consider applying for an SBA microloan or checking with local CDFIs (Community Development Financial Institutions) - they often have better rates than traditional banks.

**The Weekly Habit That Changes Everything:**
Create a 13-week rolling cash flow forecast and update it every Friday. This simple habit helps you spot problems 2-3 months before they hit, giving you time to fix them.

What's your biggest cash flow challenge right now - slow-paying customers, seasonal dips, or something else? Let me give you more specific advice! 💰`
    }
    
    return generateContextualResponse(message, businessAge, businessType)
  }
  
  // Ongoing conversation responses
  return generateConversationalResponse(message, businessAge, businessType, conversationHistory)
}

const generateContextualResponse = (message, businessAge, businessType) => {
  const responses = {
    marketing: `Let me share some marketing strategies that are working really well for ${businessType} businesses right now:

**Start Here (Free & Effective):**
First things first - claim your Google Business Profile if you haven't already. This single step can increase your local visibility by 200%. Add photos, respond to reviews, and post updates weekly.

**Content That Actually Converts:**
Video content is dominating right now - it gets 12x more engagement than text posts. Don't worry about being perfect! Even simple behind-the-scenes videos on your phone work great.

**Email Marketing (Still the Best ROI):**
For every $1 you spend on email marketing, you typically get $42 back. Start collecting emails with something valuable - a discount, guide, or insider tips.

**Budget-Friendly Tools to Get Started:**
- Canva for creating graphics ($13/month, but has a good free plan)
- Buffer for scheduling social posts ($6/month)
- Mailchimp for email (free up to 2,000 contacts)

**Quick Win Strategy:**
Partner with 2-3 complementary local businesses for cross-promotion. For example, if you're a fitness trainer, partner with a healthy meal prep company and nutrition store.

What's your current biggest marketing challenge - finding new customers or keeping the ones you have engaged? 🎯`,

    operations: `Operations optimization can make a huge difference in your daily stress level and profits. Here's where to start:

**Document Your Key Processes First:**
Pick your 3 most important business processes and write them down step-by-step. Use a tool like Loom ($8/month) to create quick video tutorials for anything complex.

**Automation Wins:**
Start with invoice automation - tools like FreshBooks or Wave can automatically send invoices and payment reminders. This alone saves most business owners 3-5 hours per week.

**Simple Project Management:**
Try Trello (free) or Asana ($11/month) to keep track of tasks and deadlines. Having everything in one place reduces the mental load significantly.

**Key Metrics to Watch:**
- How long it takes to complete your main service/product delivery
- Customer acquisition cost (how much you spend to get each new customer)
- Customer lifetime value (how much each customer is worth over time)

**The 80/20 Rule:**
Focus on the 20% of tasks that drive 80% of your results. What's the one bottleneck that, if fixed, would make everything else easier?

What's your biggest operational headache right now? 🔧`
  }

  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('market') || lowerMessage.includes('customer') || lowerMessage.includes('sales')) {
    return responses.marketing
  } else if (lowerMessage.includes('process') || lowerMessage.includes('operation') || lowerMessage.includes('efficiency')) {
    return responses.operations
  }
  
  return generateAIResponse(businessAge, businessType, message) // fallback to original function
}

const generateConversationalResponse = (message, businessAge, businessType, conversationHistory) => {
  const lowerMessage = message.toLowerCase()
  
  // Analyze conversation context
  const recentTopics = conversationHistory?.slice(-3).map(msg => msg.content?.toLowerCase()).join(' ') || ''
  
  if (lowerMessage.includes('how') && lowerMessage.includes('start')) {
    return `🚀 **Getting Started Guide:**

Based on our conversation, here's your step-by-step plan:

**Week 1:**
• Set up basic business systems (accounting, CRM)
• Create your Google Business Profile
• Document your core process

**Week 2-3:**
• Launch simple marketing campaigns
• Connect with local business networks
• Implement customer feedback systems

**Month 2:**
• Analyze what's working and double down
• Automate repetitive tasks
• Plan for scaling

What would you like to tackle first?`
  }
  
  if (lowerMessage.includes('cost') || lowerMessage.includes('budget') || lowerMessage.includes('cheap')) {
    return `💰 **Budget-Conscious Solutions:**

🆓 **Free Tools:**
• Google Workspace (basic)
• Canva (limited free plan)
• Wave Accounting
• Hootsuite (3 social accounts)

💸 **Low-Cost, High-Impact:**
• Mailchimp ($10/month for email marketing)
• Calendly ($8/month for scheduling)
• Trello ($5/month for project management)

🎯 **ROI-Focused Spending:**
Focus your budget on tools that directly generate revenue or save significant time.

What's your monthly budget for business tools?`
  }
  
  // Default conversational response
  return `🤔 **Let me help you with that:**

Based on what you're asking about, here are some practical insights:

• Every business challenge has multiple solutions - let's find the right one for you
• The best approach often combines free/low-cost tools with strategic thinking
• Implementation is more important than perfection

Can you tell me more specifically what you'd like to achieve or what obstacle you're facing?

I'm here to provide detailed, actionable advice for your ${businessType} business! 🚀`
}

// Add website analysis endpoint
router.post('/analyze-website', protect, async (req, res) => {
  try {
    const { websiteUrl, businessType } = req.body

    if (!websiteUrl) {
      return res.status(400).json({ message: 'Website URL is required' })
    }

    console.log(`Analyzing website: ${websiteUrl}`)
    
    // Analyze the website
    const analysis = await WebsiteAnalyzer.analyzeWebsite(websiteUrl)
    
    // Generate insights
    const insights = WebsiteAnalyzer.generateWebsiteInsights(analysis, businessType)
    
    // Generate friendly response
    const analysisResponse = WebsiteAnalyzer.generateFriendlyResponse(analysis, insights, businessType)

    // Save analysis to database
    const sessionId = `website_analysis_${Date.now()}_${req.user.id}`

    await SupabaseChat.create({
      userId: req.user.id,
      sessionId,
      businessData: {
        websiteUrl,
        businessType: businessType || 'Unknown'
      },
      messages: [
        {
          type: 'user',
          content: `Please analyze my website: ${websiteUrl}`,
          timestamp: new Date()
        },
        {
          type: 'bot',
          content: analysisResponse,
          timestamp: new Date()
        }
      ],
      aiSuggestion: analysisResponse,
      status: 'completed'
    })

    res.json({
      success: true,
      analysis,
      insights,
      response: analysisResponse
    })

  } catch (error) {
    console.error('Website analysis error:', error)
    res.status(500).json({ 
      message: 'Failed to analyze website',
      error: error.message 
    })
  }
})

export default router
