import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Star, MessageCircle, Mail } from 'lucide-react'

const mentors = [
  {
    id: 1,
    name: "Sarah Chen",
    skill: "Digital Marketing",
    rating: 4.9,
    rate: "$45/hour",
    whatsapp: "+1234567890",
    email: "sarah@example.com",
    bio: "10+ years helping small businesses grow online presence"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    skill: "Financial Planning",
    rating: 4.8,
    rate: "$60/hour",
    whatsapp: "+1234567891",
    email: "mike@example.com",
    bio: "Former bank manager specializing in small business finance"
  },
  {
    id: 3,
    name: "Emma Thompson",
    skill: "Operations & HR",
    rating: 4.7,
    rate: "$50/hour",
    whatsapp: "+1234567892",
    email: "emma@example.com",
    bio: "Streamlining operations for growing businesses"
  },
  {
    id: 4,
    name: "David Kim",
    skill: "Tech & Innovation",
    rating: 4.9,
    rate: "$70/hour",
    whatsapp: "+1234567893",
    email: "david@example.com",
    bio: "Helping businesses leverage technology for growth"
  }
]

export const MentorModal = ({ open, onOpenChange }) => {
  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank')
  }

  const handleEmail = (email) => {
    window.open(`mailto:${email}`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary-600">
            💬 Connect with Expert Mentors
          </DialogTitle>
          <p className="text-gray-600 text-center">
            Get personalized guidance from experienced business professionals
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-gradient-to-br from-primary-50 to-mint-50 rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{mentor.name}</h3>
                  <p className="text-primary-600 font-medium">{mentor.skill}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sunny-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{mentor.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{mentor.rate}</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{mentor.bio}</p>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleWhatsApp(mentor.whatsapp)}
                  variant="default"
                  size="sm"
                  className="flex-1 bg-mint-500 hover:bg-mint-600"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => handleEmail(mentor.email)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button onClick={() => onOpenChange(false)} variant="ghost">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
