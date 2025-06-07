'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Wallet, Shield, Zap, Globe, Car, Building2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const AppHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: any) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    { icon: <MapPin className="w-5 h-5" />, text: 'Find Spots Instantly' },
    { icon: <Wallet className="w-5 h-5" />, text: 'Crypto Payments' },
    { icon: <Shield className="w-5 h-5" />, text: 'Secure & Trustless' },
    { icon: <Zap className="w-5 h-5" />, text: 'Lightning Fast' },
  ]

  const stats = [
    { number: '50K+', label: 'Parking Spots' },
    { number: '15K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '< 1s', label: 'Booking Time' },
  ]

  return (
    <div className="relative min-h-screen bg-black overflow-hidden w-full">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Main gradient */}
        {/* <div */}
        {/*   className="absolute inset-0 opacity-70" */}
        {/*   style={{ */}
        {/*     background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(220, 38, 127, 0.3) 0%, rgba(147, 51, 234, 0.2) 25%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)`, */}
        {/*   }} */}
        {/* /> */}


        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        {/* Solana purple gradient */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-blue-900/20" /> */}

        {/* Grid pattern */}
        {/* <div className="absolute inset-0 opacity-20"> */}
        {/*   <div */}
        {/*     className="absolute inset-0" */}
        {/*     style={{ */}
        {/*       backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`, */}
        {/*       backgroundSize: '60px 60px', */}
        {/*     }} */}
        {/*   /> */}
        {/* </div> */}

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-32 w-28 h-28 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6">
        <div className="flex items-center space-x-2">
          {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"> */}
          <Image
            src="/icons/web-app-manifest-192x192.png"
            alt="Dparker"
            width={35}
            height={35}
          />
          {/* </div> */}
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dparker
          </span>
        </div>

        <div className="md:flex items-center space-x-8">
          {/* <a href="#" className="text-gray-300 hover:text-white transition-colors"> */}
          {/*   Features */}
          {/* </a> */}
          {/* <a href="#" className="text-gray-300 hover:text-white transition-colors"> */}
          {/*   How it Works */}
          {/* </a> */}
          {/* <a href="#" className="text-gray-300 hover:text-white transition-colors"> */}
          {/*   Community */}
          {/* </a> */}
          <button
            className="bg-gradient-to-br from-white/30 via-gray-300/10 to-white/5
             hover:from-white/30 hover:via-gray-400/20 hover:to-white/10
             px-6 py-2 rounded-full text-white font-medium
             border border-white/30
             backdrop-blur-xl shadow-[0_4px_30px_rgba(255,255,255,0.1)]
             transition-all duration-300 transform hover:scale-105"
            onClick={() => router.push('/signin')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8">
        <div
          className={`text-center max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-8">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Powered by Solana DePIN</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Decentralized
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Parking
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Revolution</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform idle parking spaces into income streams. Find guaranteed spots instantly.
            <span className="text-purple-400"> Powered by blockchain technology.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button
              onClick={() => router.push('/signin')}
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Start Parking</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/signin')}
              className="relative bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              List Your Space
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 transition-all duration-500 hover:bg-white/10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-purple-400">{feature.icon}</div>
                <span className="text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pb-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 hover:scale-105 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150 + 500}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" /> */}

      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 animate-bounce delay-1000">
        <Building2 className="w-8 h-8 text-purple-400/30" />
      </div>
      <div className="absolute top-1/3 right-20 animate-bounce delay-2000">
        <MapPin className="w-6 h-6 text-pink-400/30" />
      </div>
      <div className="absolute bottom-1/4 right-10 animate-bounce delay-3000">
        <Zap className="w-7 h-7 text-cyan-400/30" />
      </div>
    </div>
  )
}

export default AppHero
