'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Truck, LogOut, Package, CheckCircle2, Map, BarChart3, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

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

export default function DeliveryDashboard() {
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
    if (userData.role !== 'delivery') {
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

  const handleMarkDelivered = (donationId: string) => {
    const savedDonations = JSON.parse(localStorage.getItem('donations') || '[]')
    const updatedDonations = savedDonations.map((d: Donation) => 
      d.id === donationId ? { ...d, status: 'delivered' } : d
    )
    localStorage.setItem('donations', JSON.stringify(updatedDonations))
    setDonations(updatedDonations)
    
    toast({
      title: 'Delivery completed!',
      description: 'Thank you for your service.'
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

  const assignedDonations = donations.filter(d => d.status === 'accepted')
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
      assigned: dayDonations.filter(d => d.status === 'accepted').length,
      completed: dayDonations.filter(d => d.status === 'delivered').length
    }
  })

  const performanceData = [
    { metric: 'Assigned', value: assignedDonations.length },
    { metric: 'Completed', value: completedDonations.length },
    { metric: 'Total', value: donations.filter(d => d.status !== 'available').length }
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
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
                <Truck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-xs text-muted-foreground">Delivery Agent Dashboard</p>
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
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">Delivery Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Assigned Tasks', value: assignedDonations.length, icon: Package, color: 'text-yellow-600' },
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

            {/* Assigned Tasks */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Assigned Pickups</h2>
              <div className="space-y-4">
                {assignedDonations.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No assigned pickups at the moment.</p>
                  </Card>
                ) : (
                  assignedDonations.map((donation, index) => (
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
                                In Transit
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Quantity: {donation.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {donation.expiryTime}
                            </p>
                            {donation.pickupLocation && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Pickup: {donation.pickupLocation}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" asChild>
                              <Link href={`/tracking/${donation.id}`}>
                                <Map className="mr-2 h-4 w-4" />
                                Track
                              </Link>
                            </Button>
                            <Button onClick={() => handleMarkDelivered(donation.id)}>
                              Mark as Delivered
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Deliveries */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Completed Deliveries</h2>
              <div className="space-y-4">
                {completedDonations.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No completed deliveries yet.</p>
                  </Card>
                ) : (
                  completedDonations.map((donation, index) => (
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
                            Delivered
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Quantity: {donation.quantity}
                        </p>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Performance
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
                      <Line type="monotone" dataKey="assigned" stroke="#eab308" strokeWidth={2} name="Assigned" />
                      <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} name="Completed" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Delivery Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">
                      {donations.filter(d => d.status !== 'available').length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Total Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">{completedDonations.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {donations.filter(d => d.status !== 'available').length > 0 
                        ? Math.round((completedDonations.length / donations.filter(d => d.status !== 'available').length) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">{assignedDonations.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Card */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-8 text-center">
                <Truck className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Great Work!</h3>
                <p className="text-muted-foreground mb-4">
                  You've completed {completedDonations.length} deliveries, helping feed communities in need.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <p className="font-bold text-green-600">{completedDonations.length}</p>
                    <p className="text-muted-foreground">Deliveries</p>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                    <p className="font-bold text-green-600">
                      {donations.filter(d => d.status === 'delivered').reduce((sum, d) => {
                        const match = d.quantity.match(/\d+/)
                        return sum + (match ? parseInt(match[0]) : 0)
                      }, 0)}
                    </p>
                    <p className="text-muted-foreground">Servings Delivered</p>
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
