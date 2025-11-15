'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Building2, Plus, LogOut, TrendingUp, Package, CheckCircle2, BarChart3, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import Link from 'next/link'

type Donation = {
  id: string
  foodType: string
  quantity: string
  expiryTime: string
  status: 'available' | 'accepted' | 'delivered'
  createdAt: string
  restaurantId: string
}

export default function RestaurantDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    expiryTime: '',
    pickupLocation: ''
  })

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(currentUser)
    if (userData.role !== 'restaurant') {
      router.push('/')
      return
    }
    setUser(userData)

    // Load donations
    const savedDonations = JSON.parse(localStorage.getItem('donations') || '[]')
    const userDonations = savedDonations.filter((d: Donation) => d.restaurantId === userData.id)
    setDonations(userDonations)
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newDonation: Donation = {
      id: Date.now().toString(),
      ...formData,
      status: 'available',
      createdAt: new Date().toISOString(),
      restaurantId: user.id
    }

    const savedDonations = JSON.parse(localStorage.getItem('donations') || '[]')
    savedDonations.push(newDonation)
    localStorage.setItem('donations', JSON.stringify(savedDonations))
    
    setDonations([newDonation, ...donations])
    setIsDialogOpen(false)
    setFormData({ foodType: '', quantity: '', expiryTime: '', pickupLocation: '' })
    
    toast({
      title: 'Donation submitted!',
      description: 'Your food donation has been listed successfully.'
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

  const stats = {
    total: donations.length,
    available: donations.filter(d => d.status === 'available').length,
    completed: donations.filter(d => d.status === 'delivered').length
  }

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayDonations = donations.filter(d => {
      const donationDate = new Date(d.createdAt)
      return donationDate.toDateString() === date.toDateString()
    })
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      donations: dayDonations.length,
      delivered: dayDonations.filter(d => d.status === 'delivered').length
    }
  })

  const statusData = [
    { name: 'Available', value: stats.available },
    { name: 'In Progress', value: donations.filter(d => d.status === 'accepted').length },
    { name: 'Delivered', value: stats.completed }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{user.restaurantName}</h1>
                <p className="text-xs text-muted-foreground">Restaurant Dashboard</p>
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
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Total Donations', value: stats.total, icon: Package, color: 'text-blue-500' },
                { label: 'Available', value: stats.available, icon: TrendingUp, color: 'text-red-500' },
                { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-green-500' }
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

            {/* Add Donation Button */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Donations</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Donation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Food Donation</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="foodType">Food Type</Label>
                      <Input
                        id="foodType"
                        required
                        placeholder="e.g., Cooked Rice, Bread, Vegetables"
                        value={formData.foodType}
                        onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        required
                        placeholder="e.g., 50 servings, 20 kg"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryTime">Expiry Time</Label>
                      <Input
                        id="expiryTime"
                        required
                        placeholder="e.g., 6 hours, Today 8 PM"
                        value={formData.expiryTime}
                        onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Textarea
                        id="pickupLocation"
                        required
                        placeholder="Enter full address"
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full">Submit Donation</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Donations List */}
            <div className="space-y-4">
              {donations.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No donations yet. Add your first donation!</p>
                </Card>
              ) : (
                donations.map((donation, index) => (
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
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Quantity: {donation.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires: {donation.expiryTime}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Donations Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Donations
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
                      <Line type="monotone" dataKey="donations" stroke="#3b82f6" strokeWidth={2} name="Submitted" />
                      <Line type="monotone" dataKey="delivered" stroke="#22c55e" strokeWidth={2} name="Delivered" />
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
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">{stats.total}</p>
                    <p className="text-sm text-muted-foreground mt-1">Total Donations</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                    <p className="text-sm text-muted-foreground mt-1">Successfully Delivered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600">
                      {donations.reduce((sum, d) => {
                        const match = d.quantity.match(/\d+/)
                        return sum + (match ? parseInt(match[0]) : 0)
                      }, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Total Servings</p>
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
