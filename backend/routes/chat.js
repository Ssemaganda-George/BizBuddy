import express from 'express'
import { SupabaseChat } from '../models/SupabaseChat.js'
import { SupabaseUser } from '../models/SupabaseUser.js'
import { protect } from '../middleware/auth.js'
import { WebsiteAnalyzer } from '../services/websiteAnalyzer.js'

const router = express.Router()

// App context for consistent responses
const APP_CONTEXT = {
  goal: "Help local small businesses and hustlers find simple ways to do better",
  approach: "Practical, affordable tips that work in local settings with day-to-day examples",
  tone: "Conversational, human, encouraging - like talking to a knowledgeable neighbor",
  focus: "One small step at a time, building confidence through achievable wins"
}

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

// Enhanced AI response function with conversational tone
const generateEnhancedAIResponse = (message, businessAge, businessType, conversationHistory, isInitialDiagnosis) => {
  const lowerMessage = message.toLowerCase()
  
  // Initial diagnosis with comprehensive insights
  if (isInitialDiagnosis) {
    if (lowerMessage.includes('cash') || lowerMessage.includes('money') || lowerMessage.includes('finance')) {
      return `Hey there! I get it - cash flow worries keep a lot of us up at night. Let's tackle this together with some practical steps that work right here in our community.

**Start with what you can control today:**
First, grab a notebook and track every dollar coming in and going out for just one week. Most local business owners are shocked at what they find - it's usually not as bad as they think!

**Quick wins that don't cost much:**
- Call your best customers and ask if they'd like a small discount (2-5%) for paying their invoice early
- Join your local chamber of commerce - they often have free workshops on cash flow management
- Talk to your bank about a small business line of credit before you need it

**Local resources that actually help:**
Check out the Small Business Development Center in your area - they helped my neighbor get his bakery's cash flow sorted out for free. Or look into community development financial institutions (CDFIs) that understand local business challenges.

What's your biggest cash flow headache right now? Is it customers paying late, seasonal ups and downs, or something else? Let's break it down step by step! 💰`
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('customer') || lowerMessage.includes('sales') || lowerMessage.includes('grow')) {
      return `Marketing doesn't have to be this big scary thing that costs a fortune! Let's keep it simple and focus on what actually works for local businesses like yours.

**Start where your customers already are:**
Most people in our community check Google first when they're looking for local services. Make sure your Google Business Profile is complete with photos, hours, and a good description. It's free and can increase visibility by 200%!

**Build trust through real stories:**
People don't buy from businesses, they buy from people they trust and understand. Share why you started this business. What problem are you solving? Be real about it.

**Simple social media that works:**
Post 3 times a week: one educational tip, one behind-the-scenes look at your business, and one customer success story. Don't worry about fancy videos - authentic content gets shared.

**Word-of-mouth on steroids:**
Happy customers telling their friends is worth more than any ad. Ask for reviews and referrals. One satisfied customer telling 3 friends beats most marketing budgets.

What's been your biggest marketing challenge so far? Getting new customers through the door, or keeping the ones you have coming back? 🎯`
    }
    
    return generateContextualResponse(message, businessAge, businessType)
  }
  
  // Ongoing conversation responses
  return generateConversationalResponse(message, businessAge, businessType, conversationHistory)
}

const generateContextualResponse = (message, businessAge, businessType) => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('staff') || lowerMessage.includes('employee') || lowerMessage.includes('hire') || lowerMessage.includes('team')) {
    return `Building a great team - man, that's one of the most rewarding parts of owning a business! But it can also be the most stressful. Let me share what I've learned from helping other local business owners.

**Start with your core values first:**
What kind of culture do you actually want? Write down 3-5 things that matter most to you. This becomes your secret sauce for hiring.

**Find people who fit where you're at:**
${businessAge === 'Just starting (0-6 months)' ? 
  "For a brand new business, you need versatile generalists who can wear multiple hats and learn quickly. Specialists come later." :
  businessAge === 'Early stage (6 months - 2 years)' ? 
  "Now you're ready for people who can own specific areas but still be flexible when things change." :
  "At your stage, specialists who can scale operations are gold."
}

**Real talk hiring tips:**
- Post on local Facebook groups first - that's where the good people hang out
- Ask candidates: "Tell me about a time you solved a problem with limited resources" - that tells you everything
- Skip the interviews and do a paid trial project instead. You'll learn way more
- Check references like your life depends on it - past behavior predicts future behavior

**Keep 'em happy once you hire:**
- Regular feedback, not just annual reviews
- Professional development - even $500/year shows you care
- Fair pay and benefits
- Clear paths for growth

What's your biggest team challenge right now - finding the right people, or keeping them motivated and sticking around? 👥`
  }
  
  if (lowerMessage.includes('tech') || lowerMessage.includes('digital') || lowerMessage.includes('online') || lowerMessage.includes('website')) {
    return `Tech should make your life EASIER, not more complicated! Let's find the right tools for your ${businessType} without overwhelming you.

**The digital foundation you actually need:**
- A simple website (Squarespace or WordPress - don't overthink this)
- Google Business Profile (free local visibility boost)
- Basic accounting software (Wave is free and works great)

**Tools that pay for themselves:**
- Calendly for scheduling (saves hours of back-and-forth emails)
- Square or Stripe for payments (faster deposits, fewer headaches)
- Trello or Asana for keeping your team coordinated

**Mobile matters big time:**
60% of searches happen on mobile now. Make sure your site loads fast and your phone number is actually clickable.

**Security doesn't have to be scary:**
- Strong, unique passwords everywhere
- Two-factor authentication on everything important
- Regular backups (set it and forget it)

Want me to take a look at your current website? Just paste the URL and I'll give you honest feedback on what could be better! 💻`
  }
  
  return generateAIResponse(businessAge, businessType, message)
}

const generateConversationalResponse = (message, businessAge, businessType, conversationHistory) => {
  const lowerMessage = message.toLowerCase()
  
  // Analyze conversation history for better context
  const recentMessages = conversationHistory?.slice(-6) || []
  const userMessages = recentMessages.filter(msg => msg.type === 'user')
  const botMessages = recentMessages.filter(msg => msg.type === 'bot')
  
  // Greetings and casual interactions
  if (lowerMessage.match(/^(hi|hello|hey|howdy|greetings|good morning|good afternoon|good evening|what's up|sup|yo)$/i) || 
      lowerMessage === 'hi' || lowerMessage === 'hello' || lowerMessage === 'hey') {
    const greetings = [
      `Hey there! Great to see you! How's business treating you today? 👋`,
      `Hello! How are things going with your ${businessType}? I'm here whenever you need to talk things through! 😊`,
      `Hey! Good to connect with you. What's on your mind today - any business challenges I can help you tackle? 🎯`,
      `Hi! How's it going? Running a ${businessType} keeps you busy, I bet. What would you like to chat about? 🚀`
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
  
  // Respond to "how are you" type questions
  if (lowerMessage.includes('how are you') || lowerMessage.includes('how\'re you') || 
      lowerMessage.includes('how are u') || lowerMessage.includes('hows it going') ||
      lowerMessage.includes('how\'s it going')) {
    return `I'm doing great, thanks for asking! I love chatting with business owners like you - every conversation is different and interesting.

More importantly though, how are YOU doing? How's the ${businessType} business going? Anything exciting happening, or any challenges you'd like to work through together? 😊`
  }
  
  // Casual check-ins
  if (lowerMessage.includes('wassup') || lowerMessage.includes('what\'s up') || lowerMessage.includes('whats up')) {
    return `Not much, just here helping business owners like you figure things out! You know, the usual - lots of interesting conversations and problem-solving.

What about you? What's happening with your ${businessType}? Got any wins to celebrate or challenges to tackle? 🎯`
  }
  
  // Track conversation topics
  const conversationTopics = {
    cashFlow: recentMessages.some(msg => 
      msg.content?.toLowerCase().includes('cash') || 
      msg.content?.toLowerCase().includes('money') ||
      msg.content?.toLowerCase().includes('finance') ||
      msg.content?.toLowerCase().includes('payment')
    ),
    marketing: recentMessages.some(msg => 
      msg.content?.toLowerCase().includes('market') || 
      msg.content?.toLowerCase().includes('customer') ||
      msg.content?.toLowerCase().includes('sales') ||
      msg.content?.toLowerCase().includes('advertising')
    ),
    staffing: recentMessages.some(msg => 
      msg.content?.toLowerCase().includes('staff') || 
      msg.content?.toLowerCase().includes('employee') ||
      msg.content?.toLowerCase().includes('hire') ||
      msg.content?.toLowerCase().includes('team')
    ),
    operations: recentMessages.some(msg => 
      msg.content?.toLowerCase().includes('process') || 
      msg.content?.toLowerCase().includes('operation') ||
      msg.content?.toLowerCase().includes('efficiency') ||
      msg.content?.toLowerCase().includes('workflow')
    ),
    technology: recentMessages.some(msg => 
      msg.content?.toLowerCase().includes('tech') || 
      msg.content?.toLowerCase().includes('digital') ||
      msg.content?.toLowerCase().includes('website') ||
      msg.content?.toLowerCase().includes('online')
    )
  }
  
  // Follow-up questions based on previous conversation
  if (conversationTopics.cashFlow && (lowerMessage.includes('yes') || lowerMessage.includes('good') || lowerMessage.includes('thanks'))) {
    return `Awesome! Now that we've got the cash flow basics covered, let's build on that foundation.

**Taking it to the next level:**
- Set up automatic invoice reminders (your accounting software can do this for you)
- Build a "cash cushion" - aim to have 3 months of expenses saved
- Track your daily revenue target - the amount you need to break even

**Pricing for actual profit:**
Are you pricing to cover your costs PLUS a reasonable profit? I see so many local businesses underpricing themselves because they're afraid to ask for what they're worth.

**Expense ninja moves:**
Look at your biggest expenses every month. Can you negotiate better rates? Switch to cheaper alternatives? Small savings add up fast.

What's one cash flow improvement you'd like to tackle next? Let's pick something specific and actionable! 💰`
  }
  
  if (conversationTopics.marketing && (lowerMessage.includes('social') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram'))) {
    return `Social media can be a total game-changer for local businesses when you do it right! But most people overcomplicate it. Here's what actually works:

**A simple content calendar:**
- Monday: Share one educational tip related to your industry
- Wednesday: Behind-the-scenes look at your business (people love this)
- Friday: Customer success story or testimonial

**Authenticity beats perfection every time:**
Don't stress about fancy videos or perfect lighting. Real, helpful content builds trust and gets shared naturally.

**Think local first:**
Tag other local businesses, use local hashtags, show up at community events. People really do prefer supporting local.

**Track what actually matters:**
Focus on engagement and website traffic from social, not just follower count. Quality over quantity.

What's your biggest social media struggle - creating content consistently, or getting people to actually engage with what you post? 📱`
  }
  
  if (lowerMessage.includes('how') && lowerMessage.includes('start')) {
    return `I love that you're ready to take action! Nothing happens until you start. Here's a realistic 30-day plan for your ${businessType} that won't overwhelm you:

**Week 1: Get Your Foundation Solid**
- Days 1-2: Set up basic accounting and track this week's cash flow
- Days 3-4: Complete your Google Business Profile with real photos and accurate info
- Days 5-7: Write down your most important business process

**Week 2: Get Visible**
- Days 8-10: Set up social media profiles and post your first authentic update
- Days 11-14: Reach out to 3 complementary local businesses about partnerships
- Days 15-21: Create a simple way to collect customer feedback

**Week 3: Build Systems**
- Days 22-24: Automate one repetitive task (invoicing, social posting, whatever)
- Days 25-28: Review your pricing - are you covering costs plus profit?

**Week 4: Review and Level Up**
- Days 29-30: Look at what worked, fix what didn't, plan your next 30 days

Pick just ONE thing from this list to focus on this week. Don't try to do everything at once. What's calling to you most right now? 🚀`
  }
  
  if (lowerMessage.includes('cost') || lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('free')) {
    return `Budget constraints are real, but they actually make you more creative and focused! Here's what works without breaking the bank:

**Free tools that actually help:**
- Google Workspace (professional email, docs, calendar)
- Canva (create graphics and social content)
- Google Analytics (understand your website visitors)
- Wave Accounting (basic bookkeeping)
- Hootsuite (schedule social media posts)

**Low-cost essentials ($5-15/month):**
- Mailchimp (email marketing that works)
- Calendly (stop the scheduling back-and-forth)
- Trello (keep your team organized)
- Buffer (social media management)

**Spend on what matters:**
Before buying anything, ask yourself: "Will this save me time or make me money?" If not, it's probably not worth it yet.

**Free marketing opportunities:**
- Optimize your Google Business Profile
- Network at local events
- Create a customer referral program
- Share helpful content consistently

What's your monthly budget for business tools? I can recommend based on what you can actually afford! 💰`
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('confused')) {
    return `I totally understand feeling stuck - every business owner hits these walls! It's completely normal. Let's break this down together.

**Common roadblocks and how to push through:**

**"I don't know where to even start":**
Pick the ONE thing that, if you fixed it, would make everything else easier. Start there. Don't try to boil the ocean.

**"I'm overwhelmed by all the choices":**
Focus on what your best customers are already asking for. That's your clearest signal for what matters.

**"I'm afraid of making mistakes":**
Every successful business owner has made tons of mistakes. The key is learning fast and adjusting quickly. Progress over perfection.

**"I don't have enough time":**
Block 2 hours every week for "business improvement time." Treat it like a meeting with your most important client - yourself.

**"I'm not sure about my pricing":**
Calculate your costs, add a profit margin, check what competitors charge. Your time and expertise are worth real money.

What specific area feels most stuck right now? Let's tackle it together - you've got this! 🤝`
  }
  
  // Default response with more personality and specific offers
  const defaultResponses = [
    `I'm here to help you navigate the ups and downs of running your ${businessType}! What's the biggest challenge you're wrestling with right now? I can dive deep into:

**💰 Money & Finance:** Cash flow, pricing, funding, expense control
**📱 Marketing & Sales:** Getting customers, keeping them, growing revenue  
**👥 Team & Operations:** Hiring, managing, processes, getting stuff done
**💻 Technology & Tools:** Website, automation, digital systems
**📊 Strategy & Growth:** Planning, goals, scaling your business

Or paste your website URL and I'll give you honest feedback on how to improve it! What would you like to explore? 🎯`,

    `Every business journey has its rough patches, but you're not alone in this! Based on what you've shared about your ${businessType}, I can help with:

**Quick Wins:** Immediate actions you can take this week
**Strategic Planning:** Long-term growth and sustainability  
**Practical Tools:** Free and affordable solutions that actually work
**Local Resources:** Community support and networking opportunities
**Real Examples:** Stories from similar businesses that made it work

What's one specific area you'd like to improve? I'm ready to roll up my sleeves and help! 🚀`,

    `Running a business is a marathon, not a sprint. Let's focus on sustainable progress for your ${businessType}.

**Current Business Challenges I Help With:**
- Getting consistent cash flow and managing money wisely
- Attracting and keeping great customers
- Building and managing a solid team
- Optimizing operations and processes
- Leveraging technology effectively
- Strategic planning and growth

**My Approach:**
- Practical, affordable solutions that work locally
- Step-by-step implementation you can actually follow
- Real results from real businesses
- Building confidence through achievable wins

What's your biggest priority right now? Let's create a plan to tackle it together! 💪`
  ]
  
  // Rotate through different default responses to avoid repetition
  const responseIndex = Math.floor(Math.random() * defaultResponses.length)
  return defaultResponses[responseIndex]
}

// Add continuous chat endpoint
router.post('/respond', protect, async (req, res) => {
  try {
    const { message, businessAge, businessType, conversationHistory, isInitialDiagnosis } = req.body
    const sessionId = `conversation_${Date.now()}_${req.user.id}`

    // Enhanced AI response generation
    const response = generateEnhancedAIResponse(
      message, 
      businessAge, 
      businessType, 
      conversationHistory,
      isInitialDiagnosis
    )

    // Save conversation to database
    await SupabaseChat.create({
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

export default router
