'use client'

import React, { useState } from 'react'
import {
  Car,
  Twitter,
  Github,
  MessageCircle,
  Mail,
  Globe,
  Shield,
  Book,
  Users,
  Zap,
  ArrowRight,
  ExternalLink,
  MapPin,
  Smartphone,
  Send,
} from 'lucide-react'
import Image from 'next/image'

const AppFooter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: any) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const footerLinks = {
    Product: [
      { name: 'How it Works', href: '#', icon: <Book className="w-4 h-4" /> },
      { name: 'Features', href: '#', icon: <Zap className="w-4 h-4" /> },
      { name: 'Mobile App', href: '#', icon: <Smartphone className="w-4 h-4" /> },
      { name: 'Pricing', href: '#', icon: <Shield className="w-4 h-4" /> },
    ],
    Community: [
      { name: 'Discord', href: '#', icon: <MessageCircle className="w-4 h-4" /> },
      { name: 'Twitter', href: '#', icon: <Twitter className="w-4 h-4" /> },
      { name: 'GitHub', href: '#', icon: <Github className="w-4 h-4" /> },
      { name: 'Governance', href: '#', icon: <Users className="w-4 h-4" /> },
    ],
    Resources: [
      { name: 'Documentation', href: '#', icon: <Book className="w-4 h-4" /> },
      { name: 'API Reference', href: '#', icon: <Globe className="w-4 h-4" /> },
      { name: 'Whitepaper', href: '#', icon: <ExternalLink className="w-4 h-4" /> },
      { name: 'Security', href: '#', icon: <Shield className="w-4 h-4" /> },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: '#', color: 'hover:text-blue-400' },
    { name: 'Discord', icon: <MessageCircle className="w-5 h-5" />, href: '#', color: 'hover:text-indigo-400' },
    { name: 'GitHub', icon: <Github className="w-5 h-5" />, href: '#', color: 'hover:text-gray-300' },
    { name: 'Email', icon: <Mail className="w-5 h-5" />, href: '#', color: 'hover:text-green-400' },
  ]

  const stats = [
    { label: 'Total Parkings', value: '1.2M+' },
    { label: 'Active Users', value: '50K+' },
    { label: 'Cities', value: '25+' },
    { label: 'Revenue Generated', value: '$2.5M+' },
  ]

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-6">
              <Image src="/icons/web-app-manifest-192x192.png" alt="Dparker" width={40} height={40} />
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dparker
              </span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              The world's first decentralized parking marketplace. Connecting drivers with unused parking spaces through
              blockchain technology.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-2 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                {isSubscribed && (
                  <p className="text-green-400 text-sm flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Successfully subscribed!</span>
                  </p>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/10`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-white font-semibold mb-6 text-lg">{category}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {'icon' in link && link.icon && (
                          <span className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                            {link.icon}
                          </span>
                        )}
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-b border-white/10"> */}
        {/* {stats.map((stat, index) => ( */}
        {/*   <div key={index} className="text-center group"> */}
        {/*     <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300"> */}
        {/*       {stat.value} */}
        {/*     </div> */}
        {/*     <div className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300"> */}
        {/*       {stat.label} */}
        {/*     </div> */}
        {/*   </div> */}
        {/* ))} */}
        {/* </div> */}

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 space-y-6 md:space-y-0">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-400">
            <p>© 2024 Dparker. All rights reserved.</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Powered by</span>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-purple-300">Solana</span>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors duration-300 flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Status Page</span>
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300 flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>Blog</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
    </footer>
  )
}

export default AppFooter
