'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Car,
  Building2,
  DollarSign,
  MapPin,
  Shield,
  Zap,
  Clock,
  Smartphone,
  TrendingUp,
  Lock,
  Globe,
  Users,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const AppFeatures = () => {
  const [activeTab, setActiveTab] = useState('drivers')
  const [visibleCards, setVisibleCards] = useState(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, (entry.target as HTMLElement).dataset.index]))
          }
        })
      },
      { threshold: 0.1 },
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const driverFeatures = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Find Spots Instantly',
      description: 'Discover available parking spaces near your destination in real-time using our interactive map.',
      highlight: 'No more circling blocks',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Save Money',
      description: 'Pay up to 60% less than traditional parking with competitive P2P pricing and no hidden fees.',
      highlight: 'Save $73B annually wasted',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Booking',
      description: "Reserve your spot in under 1 second with Solana's high-speed blockchain technology.",
      highlight: '< 1 second booking',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Guaranteed & Secure',
      description:
        'Smart contracts ensure your booking is protected. No payment kiosks, no tickets, just seamless access.',
      highlight: '100% guaranteed spots',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Contactless Experience',
      description: 'Unlock parking spaces with your phone. Automatic payments and digital receipts on-chain.',
      highlight: 'Fully contactless',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Flexible Duration',
      description: 'Book for minutes, hours, or days. Extend your stay seamlessly through the app.',
      highlight: 'Extend anytime',
      color: 'from-teal-500 to-blue-500',
    },
  ]

  const ownerFeatures = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Passive Income Stream',
      description: 'Monetize your unused parking space and earn up to $200+ per month with minimal effort.',
      highlight: 'Earn $200+ monthly',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Higher Profits',
      description: 'Keep 95-99% of earnings with ultra-low blockchain fees vs 70-85% on traditional platforms.',
      highlight: 'Keep up to 99% profits',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Smart Access Control',
      description: 'IoT-enabled smart locks grant access only to verified bookings. Full control over your space.',
      highlight: 'Automated access control',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Verified Renters',
      description: 'All drivers are KYC verified with background checks. Insurance protection for peace of mind.',
      highlight: 'Background checked users',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Marketplace',
      description: 'List your space on a decentralized network accessible worldwide. No geographic restrictions.',
      highlight: 'Worldwide accessibility',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Governance',
      description: 'Participate in platform decisions through DAO governance. Your voice matters in the ecosystem.',
      highlight: 'Community-owned platform',
      color: 'from-cyan-500 to-teal-500',
    },
  ]

  const currentFeatures = activeTab === 'drivers' ? driverFeatures : ownerFeatures

  return (
    <div className="relative bg-black py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by Web3</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Built for</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Everyone</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're looking for parking or have space to share, Dparker provides the tools you need to succeed.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16 px-4">
          <div
            className="
        bg-white/5 
        backdrop-blur-sm 
        border 
        border-white/10 
        rounded-full 
        p-2 
        flex 

        sm:flex-row 
        space-y-2 
        sm:space-y-0 
        sm:space-x-2
        max-w-md
        w-full
      "
          >
            <button
              onClick={() => setActiveTab('drivers')}
              className={`
            flex-1 
            flex 
            items-center 
            justify-center 
            space-x-2 
            rounded-full 
            font-semibold 
            transition-colors 
            duration-300 
            w-full 
            px-4 
            py-2 
            sm:px-8 
            sm:py-4 
            ${
              activeTab === 'drivers'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }
          `}
            >
              <Car className="w-5 h-5" />
              <span>For Drivers</span>
            </button>

            <button
              onClick={() => setActiveTab('owners')}
              className={`
            flex-1 
            flex 
            items-center 
            justify-center 
            space-x-2 
            rounded-full 
            font-semibold 
            transition-colors 
            duration-300 
            w-full 
            px-4 
            py-2 
            sm:px-8 
            sm:py-4 
            ${
              activeTab === 'owners'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }
          `}
            >
              <Building2 className="w-5 h-5" />
              <span>For Space Owners</span>
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentFeatures.map((feature, index) => (
            <div
              key={`${activeTab}-${index}`}
              ref={(el) => { cardRefs.current[index] = el }}
              data-index={index}
              className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 ${
                visibleCards.has(index.toString()) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Card gradient border effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl blur transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                {feature.title}
              </h3>

              <p className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>

              {/* Highlight Badge */}
              <div
                className={`inline-flex items-center space-x-2 bg-gradient-to-r ${feature.color} bg-opacity-20 border border-current rounded-full px-4 py-2`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.highlight}</span>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-12 backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users already earning and saving with decentralized parking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={()=> router.push('/signin')}
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Find Parking</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={()=> router.push('/signin')}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>List Your Space</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppFeatures
