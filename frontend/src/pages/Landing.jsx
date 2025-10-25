import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MessageCircle, Target, Users, TrendingUp, ChevronRight } from 'lucide-react'

export const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-mint-50 to-sunny-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-primary-500 to-mint-500 p-2 rounded-xl">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">BizBuddy</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-mint-600 bg-clip-text text-transparent">
              Real help.
            </span>
            <br />
            <span className="bg-gradient-to-r from-mint-600 to-sunny-600 bg-clip-text text-transparent">
              Simple ideas.
            </span>
            <br />
            <span className="bg-gradient-to-r from-sunny-600 to-primary-600 bg-clip-text text-transparent">
              Smarter growth.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            BizBuddy is your friendly AI + mentor platform that helps small businesses 
            diagnose challenges and discover simple, local, affordable solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary-500 to-mint-500 hover:from-primary-600 hover:to-mint-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg"
              onClick={() => navigate('/chat')}
            >
              Start Diagnosing
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg rounded-xl"
              onClick={() => navigate('/mentors')}
            >
              Meet Our Mentors
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-primary-100 rounded-xl p-3 w-fit mb-4">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Diagnosis</h3>
            <p className="text-gray-600">
              Our AI asks the right questions to understand your unique business challenges and goals.
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-mint-100 rounded-xl p-3 w-fit mb-4">
              <Users className="h-8 w-8 text-mint-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Expert Mentors</h3>
            <p className="text-gray-600">
              Connect instantly with experienced business professionals who understand your industry.
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-sunny-100 rounded-xl p-3 w-fit mb-4">
              <TrendingUp className="h-8 w-8 text-sunny-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Actionable Solutions</h3>
            <p className="text-gray-600">
              Get practical, affordable recommendations you can implement right away to grow your business.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-mint-500 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to unlock your business potential?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of small business owners who trust BizBuddy for growth guidance.
          </p>
          <Button 
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg"
            onClick={() => navigate('/chat')}
          >
            Start Your Free Diagnosis
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-primary-500 to-mint-500 p-2 rounded-xl">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">BizBuddy</span>
          </div>
          <p className="text-gray-600">
            © 2024 BizBuddy. Empowering small businesses with AI-powered guidance.
          </p>
        </div>
      </footer>
    </div>
  )
}
