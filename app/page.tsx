'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Utensils, Users, TrendingUp, ArrowRight, Leaf, Heart, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Utensils className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">FoodFlow</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#impact" className="text-foreground/80 hover:text-foreground transition-colors">
                Impact
              </Link>
              <Link href="/leaderboard" className="text-foreground/80 hover:text-foreground transition-colors">
                Leaderboard
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/role-selection">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Leaf className="h-5 w-5" />
                <span className="font-medium text-sm">Reduce waste. Feed communities.</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance leading-tight">
                Turn Surplus <span className="text-primary">Into Sustenance</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6 text-pretty leading-relaxed">
                Connect restaurants with NGOs. Transform food surplus into meaningful meals. 
                Create real impact in your community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/role-selection">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Content - Food Flow Diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Food Image Background */}
                <img
                  src="/delicious-indian-food-thali-with-various-dishes.jpg"
                  alt="Food"
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Overlay with Flow Diagram */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30">
                  <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-4">
                    {/* Restaurant/Donor */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="flex items-center gap-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Utensils className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Restaurant</h3>
                        <p className="text-xs text-muted-foreground">Donates surplus food</p>
                      </div>
                    </motion.div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-6 w-6 text-white rotate-90" />
                      </motion.div>
                    </div>

                    {/* Volunteer/Delivery */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="flex items-center gap-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Volunteer</h3>
                        <p className="text-xs text-muted-foreground">Picks up & delivers</p>
                      </div>
                    </motion.div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      >
                        <ArrowRight className="h-6 w-6 text-white rotate-90" />
                      </motion.div>
                    </div>

                    {/* NGO */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="flex items-center gap-4 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">NGO</h3>
                        <p className="text-xs text-muted-foreground">Distributes to communities</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full px-8 py-3 shadow-xl"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-xs opacity-90">Meals Delivered</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: 'Meals Saved', value: '50,000+', icon: Utensils },
              { label: 'Active NGOs', value: '150+', icon: Users },
              { label: 'Food Waste Reduced', value: '85%', icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple three-step process to turn surplus food into community impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Restaurant Submits',
                description: 'Restaurants list surplus food with details like quantity, type, and expiry time.',
                icon: Utensils
              },
              {
                step: '2',
                title: 'NGO Accepts',
                description: 'NGOs browse available donations to distribute to communities.',
                icon: Heart
              },
              {
                step: '3',
                title: 'Delivery Completes',
                description: 'Volunteer delivery agents pick up and deliver food to NGOs in real-time.',
                icon: Truck
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <div className="bg-card border rounded-xl p-6 h-full hover:shadow-lg transition-all">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <item.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage food donations efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Real-Time Tracking', description: 'Track donation status from submission to delivery with color-coded updates' },
              { title: 'Role-Based Dashboards', description: 'Customized interfaces for restaurants, NGOs, and delivery agents' },
              { title: 'Instant Notifications', description: 'Get notified immediately when donations are accepted or delivered' },
              { title: 'Analytics Dashboard', description: 'View impact metrics including meals saved and waste reduced' },
              { title: 'Mobile Responsive', description: 'Access the platform seamlessly from any device' },
              { title: 'Secure & Reliable', description: 'Built with security and data privacy as top priorities' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="impact" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-primary text-primary-foreground rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-3">Ready to Make an Impact?</h2>
            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
              Join restaurants, NGOs, and volunteers already making a difference in their communities
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/role-selection">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Utensils className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">FoodFlow</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Transforming food surplus into community sustenance.
              </p>
            </div>
            
            {[
              { title: 'Platform', links: ['How It Works', 'Features', 'Impact'] },
              { title: 'Community', links: ['Restaurants', 'NGOs', 'Volunteers'] },
              { title: 'Company', links: ['About', 'Contact', 'Support'] }
            ].map((column) => (
              <div key={column.title}>
                <h3 className="font-bold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 FoodFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
