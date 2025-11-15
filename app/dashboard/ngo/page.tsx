'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Heart, LogOut, Package, CheckCircle2, Clock, BarChart3, ArrowLeft, MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const GoogleMapComponent = dynamic(() => import('@/components/google-map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
})

type Donation = {
  id: string
  foodType: string
  quantity: string
  expiryTime: string
  status: 'available' | 'accepted' | 'delivered'
  createdAt: string
  restaurantId: string
  pickupLocation?: string
}

export default function NGODashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [donations, setDonations] = useState<Donation[]>([])

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(currentUser)
    if (userData.role !== 'ngo') {
      router.push('/')
      return
    }
    setUser(userData)
    loadDonations()
  }, [router])

  const loadDonations = () => {
    const savedDonations = JSON.parse(localStorage.getItem('donations') || '[]')
    setDonations(savedDonations)
  }

  const handleAccept = (donationId: string) => {
    const savedDonations = JSON.parse(localStorage.getItem('donations') || '[]')
    const updatedDonations = savedDonations.map((d: Donation) => 
      d.id === donationId ? { ...d, status: 'accepted' } : d
    )
    localStorage.setItem('donations', JSON.stringify(updatedDonations))
    setDonations(updatedDonations)
    
    toast({
      title: 'Donation accepted!',
      description: 'A delivery agent has been notified.'
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'accepted':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'delivered':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      default:
        return 'bg-muted'
    }
  }

  const availableDonations = donations.filter(d => d.status === 'available')
  const acceptedDonations = donations.filter(d => d.status === 'accepted')
  const completedDonations = donations.filter(d => d.status === 'delivered')

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayDonations = donations.filter(d => {
      const donationDate = new Date(d.createdAt)
      return donationDate.toDateString() === date.toDateString()
    })
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      received: dayDonations.filter(d => d.status === 'delivered').length,
      pending: dayDonations.filter(d => d.status === 'accepted').length
    }
  })

  const pieData = [
    { name: 'Available', value: availableDonations.length, color: '#ef4444' },
    { name: 'In Transit', value: acceptedDonations.length, color: '#eab308' },
    { name: 'Received', value: completedDonations.length, color: '#22c55e' }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/10">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{user.organizationName}</h1>
                <p className="text-xs text-muted-foreground">NGO Dashboard</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Available', value: availableDonations.length, icon: Package, color: 'text-red-500' },
                { label: 'In Transit', value: acceptedDonations.length, icon: Clock, color: 'text-yellow-600' },
                { label: 'Completed', value: completedDonations.length, icon: CheckCircle2, color: 'text-green-500' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Available Donations */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Available Donations</h2>
              <div className="space-y-4">
                {availableDonations.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No available donations at the moment.</p>
                  </Card>
                ) : (
                  availableDonations.map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Card className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold">{donation.foodType}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(donation.status)}`}>
                                Available
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Quantity: {donation.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {donation.expiryTime}
                            </p>
                          </div>
                          <Button onClick={() => handleAccept(donation.id)}>
                            Accept Donation
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Accepted Donations */}
            <div>
              <h2 className="text-2xl font-bold mb-6">In Transit</h2>
              <div className="space-y-4">
                {acceptedDonations.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No donations in transit.</p>
                  </Card>
                ) : (
                  acceptedDonations.map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{donation.foodType}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(donation.status)}`}>
                            In Transit
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Quantity: {donation.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires: {donation.expiryTime}
                        </p>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Live Delivery Tracking</h2>
                <p className="text-muted-foreground">Monitor active deliveries in real-time</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Navigation className="h-4 w-4 text-green-600 animate-pulse" />
                <span className="text-muted-foreground">Live Updates Active</span>
              </div>
            </div>

            {acceptedDonations.length === 0 ? (
              <Card className="p-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active deliveries to track at the moment.</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {acceptedDonations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-yellow-600" />
                            {donation.foodType} - {donation.quantity}
                          </CardTitle>
                          <Button size="sm" asChild>
                            <Link href={`/tracking/${donation.id}`}>
                              View Full Details
                            </Link>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          From: Restaurant • Expires: {donation.expiryTime}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                          <GoogleMapComponent
                            pickup={{ 
                              lat: 28.6139 + index * 0.01, 
                              lng: 77.2090 + index * 0.01, 
                              address: '123 Restaurant St, Delhi' 
                            }}
                            dropoff={{ 
                              lat: 28.6289 + index * 0.01, 
                              lng: 77.2195 + index * 0.01, 
                              address: user.address || '456 NGO St, Delhi' 
                            }}
                            currentLocation={{ 
                              lat: 28.6139 + index * 0.01 + (0.015 * ((Date.now() / 10000) % 1)), 
                              lng: 77.2090 + index * 0.01 + (0.0105 * ((Date.now() / 10000) % 1))
                            }}
                            agentName="Volunteer Delivery Agent"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={2} name="Received" />
                      <Line type="monotone" dataKey="pending" stroke="#eab308" strokeWidth={2} name="Pending" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">{donations.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">{completedDonations.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Received</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {donations.reduce((sum, d) => {
                        const match = d.quantity.match(/\d+/)
                        return sum + (match ? parseInt(match[0]) : 0)
                      }, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Total Servings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">{acceptedDonations.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
