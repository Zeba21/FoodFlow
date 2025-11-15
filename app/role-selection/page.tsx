'use client'

import { motion } from 'framer-motion'
import { Building2, Heart, Truck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const roles = [
  {
    id: 'restaurant',
    title: 'Restaurant / Hotel',
    description: 'Submit surplus food and track donations to reduce waste',
    icon: Building2,
    color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    href: '/signup/restaurant'
  },
  {
    id: 'ngo',
    title: 'NGO',
    description: 'Accept food donations and distribute to communities in need',
    icon: Heart,
    color: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20',
    href: '/signup/ngo'
  },
  {
    id: 'delivery',
    title: 'Delivery Agent',
    description: 'Volunteer to pick up and deliver food donations',
    icon: Truck,
    color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    href: '/signup/delivery'
  }
]

export default function RoleSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
            <p className="text-xl text-muted-foreground">
              Select how you'd like to contribute to reducing food waste
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={role.href}>
                  <Card className="p-6 h-full hover:shadow-lg transition-all cursor-pointer group">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${role.color} mb-4 transition-colors`}>
                      <role.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
