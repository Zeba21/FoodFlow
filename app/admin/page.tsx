'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Utensils, Users, TrendingUp, FileText, CheckCircle, LogOut, Activity, Truck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// Mock data for admin dashboard
const weeklyData = [
  { day: 'Mon', donations: 7, deliveries: 5 },
  { day: 'Tue', donations: 12, deliveries: 9 },
  { day: 'Wed', donations: 15, deliveries: 10 },
  { day: 'Thu', donations: 8, deliveries: 7 },
  { day: 'Fri', donations: 18, deliveries: 14 },
  { day: 'Sat', donations: 25, deliveries: 21 },
  { day: 'Sun', donations: 20, deliveries: 17 }
]

const statusData = [
  { name: 'Available', value: 3, color: '#ef4444' },
  { name: 'Accepted', value: 1, color: '#f59e0b' },
  { name: 'Picked Up', value: 1, color: '#3b82f6' },
  { name: 'Delivered', value: 3, color: '#22c55e' }
]

const recentDonations = [
  { id: 1, donor: 'The Grand Hotel', foodType: 'Biryani', quantity: '50 servings', ngo: '-', status: 'Available', time: '7:52:00 pm' },
  { id: 2, donor: 'City Restaurant', foodType: 'Samosas', quantity: '100 pieces', ngo: '-', status: 'Available', time: '8:07:00 pm' },
  { id: 3, donor: 'Sunset Cafe', foodType: 'Pizza', quantity: '30 slices', ngo: '-', status: 'Available', time: '8:12:00 pm' },
  { id: 4, donor: 'The Grand Hotel', foodType: 'Naan Bread', quantity: '200 pieces', ngo: 'Community Food Bank', status: 'Accepted', time: '7:37:00 pm' },
  { id: 5, donor: 'Royal Palace Restaurant', foodType: 'Paneer Tikka', quantity: '75 servings', ngo: 'Hope Foundation', status: 'Picked Up', time: '7:22:00 pm' },
  { id: 6, donor: 'City Restaurant', foodType: 'Chicken Curry', quantity: '120 servings', ngo: 'Community Food Bank', status: 'Delivered', time: '6:22:00 pm' },
  { id: 7, donor: 'Green Valley Restaurant', foodType: 'Vegetable Pulao', quantity: '160 servings', ngo: 'Bright Future NGO', status: 'Delivered', time: '5:22:00 pm' },
  { id: 8, donor: 'The Grand Hotel', foodType: 'Tandoori Chicken', quantity: '85 servings', ngo: 'Hope Foundation', status: 'Delivered', time: '4:22:00 pm' }
]

export default function AdminDashboard() {
  const [filter, setFilter] = useState('All')

  const filteredDonations = filter === 'All' 
    ? recentDonations 
    : recentDonations.filter(d => d.status === filter)

  const totalDonations = 8
  const successRate = Math.round((recentDonations.filter(d => d.status === 'Delivered').length / totalDonations) * 100)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <Utensils className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">System monitoring and management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">efg</span>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <LogOut className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Users className="h-12 w-12 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Donors</p>
                  <p className="text-4xl font-bold text-primary">5</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Activity className="h-12 w-12 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">NGOs</p>
                  <p className="text-4xl font-bold text-primary">3</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="h-12 w-12 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Delivery Agents</p>
                  <p className="text-4xl font-bold text-primary">3</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <FileText className="h-12 w-12 text-destructive mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Total Donations</p>
                  <p className="text-4xl font-bold text-destructive">{totalDonations}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-4xl font-bold text-green-600">{successRate}%</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Current donation statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Donations and deliveries over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="donations" stroke="#f97316" strokeWidth={2} name="Donations" />
                    <Line type="monotone" dataKey="deliveries" stroke="#22c55e" strokeWidth={2} name="Deliveries" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Donations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Donations</CardTitle>
                  <CardDescription>Latest donation activity</CardDescription>
                </div>
                <div className="flex gap-2">
                  {['All', 'Available', 'Accepted', 'Delivered'].map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(status)}
                      className="min-w-[100px]"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold">Donor</th>
                      <th className="text-left py-4 px-4 font-semibold">Food Type</th>
                      <th className="text-left py-4 px-4 font-semibold">Quantity</th>
                      <th className="text-left py-4 px-4 font-semibold">NGO</th>
                      <th className="text-left py-4 px-4 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((donation, index) => (
                      <motion.tr
                        key={donation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">{donation.donor}</td>
                        <td className="py-4 px-4 text-muted-foreground">{donation.foodType}</td>
                        <td className="py-4 px-4 text-muted-foreground">{donation.quantity}</td>
                        <td className="py-4 px-4 text-muted-foreground">{donation.ngo}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            donation.status === 'Available' ? 'bg-red-100 text-red-700' :
                            donation.status === 'Accepted' ? 'bg-yellow-100 text-yellow-700' :
                            donation.status === 'Picked Up' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{donation.time}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
