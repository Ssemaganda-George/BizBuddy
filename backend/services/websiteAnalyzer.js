import axios from 'axios'
import * as cheerio from 'cheerio'
import { URL } from 'url'

export class WebsiteAnalyzer {
  static async analyzeWebsite(websiteUrl) {
    try {
      // Validate URL
      const url = new URL(websiteUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid URL protocol')
      }

      console.log(`Analyzing website: ${websiteUrl}`)
      
      // Fetch the website content
      const response = await axios.get(websiteUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      const html = response.data
      const $ = cheerio.load(html)

      // Extract comprehensive website data
      const analysis = {
        basic: {
          title: $('title').text().trim() || 'No title found',
          description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
          keywords: $('meta[name="keywords"]').attr('content') || '',
          url: websiteUrl
        },
        
        navigation: {
          navLinks: [],
          mainNavigation: []
        },
        
        content: {
          headings: {
            h1: [],
            h2: [],
            h3: []
          },
          paragraphs: []
        },
        
        contact: {
          emails: [],
          phones: [],
          address: ''
        },
        
        social: [],
        forms: [],
        cta: [],
        images: [],
        
        performance: {
          imagesCount: 0,
          scriptsCount: 0,
          stylesheetsCount: 0,
          hasLazyLoading: false
        },
        
        mobile: {
          hasViewportMeta: false,
          responsiveImages: 0,
          flexboxUsage: false
        },
        
        seo: {
          hasMetaDescription: false,
          hasKeywords: false,
          h1Count: 0,
          hasStructuredData: false,
          hasCanonical: false
        }
      }

      // Navigation analysis
      $('nav a, header a, .navbar a, .menu a').each((i, el) => {
        const text = $(el).text().trim()
        if (text) analysis.navigation.navLinks.push(text)
      })

      // Content analysis
      $('h1').each((i, el) => {
        const text = $(el).text().trim()
        if (text) analysis.content.headings.h1.push(text)
      })

      $('h2').each((i, el) => {
        const text = $(el).text().trim()
        if (text) analysis.content.headings.h2.push(text)
      })

      $('h3').each((i, el) => {
        const text = $(el).text().trim()
        if (text) analysis.content.headings.h3.push(text)
      })

      $('p').slice(0, 10).each((i, el) => {
        const text = $(el).text().trim()
        if (text && text.length > 20) analysis.content.paragraphs.push(text)
      })

      // Contact information
      $('a[href^="mailto:"]').each((i, el) => {
        analysis.contact.emails.push($(el).attr('href'))
      })

      $('a[href^="tel:"]').each((i, el) => {
        analysis.contact.phones.push($(el).attr('href'))
      })

      // Social media links
      $('a[href*="facebook"], a[href*="twitter"], a[href*="instagram"], a[href*="linkedin"], a[href*="youtube"]').each((i, el) => {
        const href = $(el).attr('href')
        const platform = href.match(/(facebook|twitter|instagram|linkedin|youtube)/)?.[0]
        if (platform) {
          analysis.social.push({ platform, url: href })
        }
      })

      // Forms analysis
      $('form').each((i, form) => {
        const formData = {
          action: $(form).attr('action') || '',
          method: $(form).attr('method') || 'get',
          inputs: []
        }
        
        $(form).find('input, textarea, select').each((j, input) => {
          formData.inputs.push({
            type: $(input).attr('type') || 'text',
            name: $(input).attr('name') || '',
            placeholder: $(input).attr('placeholder') || '',
            required: $(input).prop('required') || false
          })
        })
        
        analysis.forms.push(formData)
      })

      // CTA buttons
      $('button, .btn, .cta, a[class*="button"], a[class*="btn"]').each((i, el) => {
        const text = $(el).text().trim()
        if (text && text.length > 0 && text.length < 100) {
          analysis.cta.push(text)
        }
      })

      // Images analysis
      $('img').slice(0, 20).each((i, el) => {
        analysis.images.push({
          src: $(el).attr('src') || '',
          alt: $(el).attr('alt') || '',
          hasAlt: !!$(el).attr('alt')
        })
      })

      // Performance indicators
      analysis.performance.imagesCount = $('img').length
      analysis.performance.scriptsCount = $('script').length
      analysis.performance.stylesheetsCount = $('link[rel="stylesheet"]').length
      analysis.performance.hasLazyLoading = $('img[loading="lazy"]').length > 0

      // Mobile responsiveness indicators
      analysis.mobile.hasViewportMeta = !!$('meta[name="viewport"]').length
      analysis.mobile.responsiveImages = $('img[srcset]').length

      // SEO factors
      analysis.seo.hasMetaDescription = !!analysis.basic.description
      analysis.seo.hasKeywords = !!analysis.basic.keywords
      analysis.seo.h1Count = analysis.content.headings.h1.length
      analysis.seo.hasStructuredData = !!$('[type="application/ld+json"]').length
      analysis.seo.hasCanonical = !!$('link[rel="canonical"]').length

      analysis.analyzedAt = new Date().toISOString()
      return analysis

    } catch (error) {
      console.error('Website analysis error:', error)
      throw new Error(`Failed to analyze website: ${error.message}`)
    }
  }

  static generateWebsiteInsights(analysis, businessType = '') {
    const insights = {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      priority: 'high'
    }

    // Analyze basic SEO
    if (!analysis.seo.hasMetaDescription) {
      insights.weaknesses.push('Missing meta description - impacts search engine visibility')
      insights.recommendations.push('Add a compelling meta description (150-160 characters) that describes your business value proposition')
    } else {
      insights.strengths.push('Meta description is present')
    }

    if (analysis.seo.h1Count === 0) {
      insights.weaknesses.push('No H1 heading found - poor for SEO and accessibility')
      insights.recommendations.push('Add a clear H1 heading that describes your main service/product')
    } else if (analysis.seo.h1Count > 1) {
      insights.weaknesses.push('Multiple H1 headings - confuses search engines')
      insights.recommendations.push('Use only one H1 per page, use H2-H6 for subheadings')
    } else {
      insights.strengths.push('Proper H1 heading structure')
    }

    // Contact information analysis
    if (analysis.contact.phones.length === 0 && analysis.contact.emails.length === 0) {
      insights.weaknesses.push('No clear contact information found')
      insights.recommendations.push('Add prominent contact information (phone, email) in header or footer')
    } else {
      insights.strengths.push('Contact information is available')
    }

    // Mobile responsiveness
    if (!analysis.mobile.hasViewportMeta) {
      insights.weaknesses.push('Not optimized for mobile devices')
      insights.recommendations.push('Add viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">')
    } else {
      insights.strengths.push('Mobile viewport configured')
    }

    // Images optimization
    const imagesWithoutAlt = analysis.images.filter(img => !img.hasAlt).length
    if (imagesWithoutAlt > 0) {
      insights.weaknesses.push(`${imagesWithoutAlt} images missing alt text`)
      insights.recommendations.push('Add descriptive alt text to all images for better accessibility and SEO')
    }

    // Call-to-action analysis
    if (analysis.cta.length === 0) {
      insights.weaknesses.push('No clear call-to-action buttons found')
      insights.recommendations.push('Add prominent CTA buttons (e.g., "Get Quote", "Contact Us", "Buy Now")')
    } else {
      insights.strengths.push(`${analysis.cta.length} call-to-action elements found`)
    }

    // Forms analysis
    if (analysis.forms.length === 0) {
      insights.recommendations.push('Consider adding a contact form or newsletter signup to capture leads')
    } else {
      insights.strengths.push('Contact/lead capture forms present')
    }

    // Social media presence
    if (analysis.social.length === 0) {
      insights.recommendations.push('Add social media links to build trust and community')
    } else {
      insights.strengths.push(`Connected to ${analysis.social.length} social platforms`)
    }

    // Performance insights
    if (analysis.performance.imagesCount > 50) {
      insights.recommendations.push('Consider optimizing images and implementing lazy loading for better performance')
    }

    // Business-specific recommendations
    if (businessType.toLowerCase().includes('restaurant') || businessType.toLowerCase().includes('food')) {
      insights.recommendations.push('Consider adding online ordering system, menu display, and customer reviews')
    } else if (businessType.toLowerCase().includes('retail')) {
      insights.recommendations.push('Add product catalog, customer testimonials, and easy checkout process')
    } else if (businessType.toLowerCase().includes('service')) {
      insights.recommendations.push('Showcase service portfolio, client testimonials, and easy booking system')
    }

    return insights
  }

  static generateFriendlyResponse(analysis, insights, businessType = '') {
    const title = analysis.basic.title
    const domain = new URL(analysis.basic.url).hostname.replace('www.', '')
    
    let response = `I've analyzed ${domain} and here's what I found:\n\n`

    // Quick overview in conversational tone
    response += `**Quick Overview:**\n`
    response += `Your website has a ${insights.strengths.length > insights.weaknesses.length ? 'solid' : 'decent'} foundation with some room for improvement. `
    
    if (analysis.seo.h1Count === 1 && analysis.seo.hasMetaDescription) {
      response += `The SEO basics are in place, which is great! `
    }
    
    if (analysis.contact.phones.length > 0 || analysis.contact.emails.length > 0) {
      response += `Visitors can easily find ways to contact you. `
    }
    
    response += `\n\n`

    // Strengths in a friendly way
    if (insights.strengths.length > 0) {
      response += `**What's Working Well:**\n`
      insights.strengths.forEach(strength => {
        response += `✅ ${strength}\n`
      })
      response += `\n`
    }

    // Issues presented as opportunities
    if (insights.weaknesses.length > 0) {
      response += `**Quick Wins to Boost Your Results:**\n`
      insights.weaknesses.forEach((weakness, index) => {
        const recommendation = insights.recommendations[index] || 'Consider improving this area'
        
        // Make it more conversational
        if (weakness.includes('meta description')) {
          response += `🎯 Add a compelling description under your title - this shows up in Google search results and can increase clicks by 30%!\n`
        } else if (weakness.includes('H1 heading')) {
          response += `📝 Your main headline needs work - a clear H1 helps both visitors and Google understand what you offer\n`
        } else if (weakness.includes('contact information')) {
          response += `📞 Make it super easy for customers to reach you - add your phone and email prominently\n`
        } else if (weakness.includes('mobile')) {
          response += `📱 Your site needs mobile optimization - 60% of visitors browse on phones!\n`
        } else if (weakness.includes('images missing alt')) {
          response += `🖼️ ${weakness.split(' ')[0]} images need descriptions - this helps with accessibility and SEO\n`
        } else if (weakness.includes('call-to-action')) {
          response += `🎯 Add clear action buttons like "Get Started", "Contact Us", or "Learn More" to guide visitors\n`
        } else {
          response += `⚠️ ${weakness}\n`
        }
      })
      response += `\n`
    }

    // Specific recommendations based on business type
    response += `**Smart Next Steps for Your ${businessType || 'Business'}:**\n`
    
    if (businessType.toLowerCase().includes('restaurant') || businessType.toLowerCase().includes('food')) {
      response += `🍽️ Add online ordering or reservation system\n`
      response += `📸 Showcase your best dishes with high-quality photos\n`
      response += `⭐ Display customer reviews prominently\n`
      response += `📍 Include hours, location, and parking info\n`
    } else if (businessType.toLowerCase().includes('retail')) {
      response += `🛒 Create an easy product browsing experience\n`
      response += `💳 Streamline your checkout process\n`
      response += `📦 Show shipping and return policies clearly\n`
      response += `💬 Add customer testimonials and reviews\n`
    } else if (businessType.toLowerCase().includes('service')) {
      response += `📋 Showcase your services with before/after examples\n`
      response += `👥 Feature client testimonials and case studies\n`
      response += `📅 Add online booking or consultation scheduling\n`
      response += `💰 Display pricing or offer free quotes\n`
    } else if (businessType.toLowerCase().includes('tech')) {
      response += `💻 Create a clear product demo or trial\n`
      response += `📚 Add helpful documentation or tutorials\n`
      response += `🎯 Highlight your unique value proposition\n`
      response += `👨‍💻 Show your team's expertise and credentials\n`
    } else {
      response += `🎯 Focus on your unique value proposition\n`
      response += `📞 Make contact information more prominent\n`
      response += `⭐ Add customer testimonials\n`
      response += `📱 Ensure mobile-friendly design\n`
    }

    response += `\n**Performance Summary:**\n`
    response += `📊 ${analysis.performance.imagesCount} images found${analysis.performance.hasLazyLoading ? ' (optimized loading)' : ''}\n`
    response += `📱 Mobile optimization: ${analysis.mobile.hasViewportMeta ? 'Good' : 'Needs work'}\n`
    response += `🔍 SEO score: ${analysis.seo.hasMetaDescription && analysis.seo.h1Count === 1 ? 'Solid' : 'Room for improvement'}\n`
    
    if (analysis.social.length > 0) {
      response += `🌐 Connected to ${analysis.social.length} social platform${analysis.social.length > 1 ? 's' : ''}\n`
    }

    response += `\nWant me to dive deeper into any of these areas? I can help you prioritize what to tackle first based on your goals! 🚀`

    return response
  }
}
