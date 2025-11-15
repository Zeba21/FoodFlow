'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RestaurantRanking = {
  id: string
  name: string
  totalDonations: number
  totalServings: number
  completedDonations: number
  rank: number
}

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<RestaurantRanking[]>([])

  useEffect(() => {
    // Load donations and calculate rankings
    const donations = JSON.parse(localStorage.getItem('donations') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    const restaurantStats = new Map<string, { name: string; totalDonations: number; totalServings: number; completedDonations: number }>()
    
    donations.forEach((donation: any) => {
      if (!restaurantStats.has(donation.restaurantId)) {
        const restaurant = users.find((u: any) => u.id === donation.restaurantId)
        restaurantStats.set(donation.restaurantId, {
          name: donation.restaurantName || restaurant?.organizationName || 'Unknown Restaurant',
          totalDonations: 0,
          totalServings: 0,
          completedDonations: 0
        })
      }
      
      const stats = restaurantStats.get(donation.restaurantId)!
      stats.totalDonations++
      
      // Extract number from quantity string (e.g., "50 servings" -> 50)
      const quantityMatch = donation.quantity?.toString().match(/\d+/)
      if (quantityMatch) {
        stats.totalServings += parseInt(quantityMatch[0])
      }
      
      if (donation.status === 'delivered') {
        stats.completedDonations++
      }
    })
    
    // Convert to array and sort by total servings
    const rankingsArray: RestaurantRanking[] = Array.from(restaurantStats.entries())
      .map(([id, stats], index) => ({
        id,
        ...stats,
        rank: index + 1
      }))
      .sort((a, b) => b.totalServings - a.totalServings)
      .map((item, index) => ({ ...item, rank: index + 1 }))
    
    setRankings(rankingsArray)
  }, [])

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
      default:
        return 'bg-card border-border'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Restaurant Leaderboard</h1>
                  <p className="text-sm text-muted-foreground">Top donors making a difference</p>
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Restaurants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">{rankings.length}</p>
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Servings Donated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">
                    {rankings.reduce((sum, r) => sum + r.totalServings, 0).toLocaleString()}
                  </p>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">
                    {rankings.reduce((sum, r) => sum + r.completedDonations, 0)}
                  </p>
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Top Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            {rankings.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No donations yet. Be the first to make a difference!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rankings.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className={`${getRankColor(restaurant.rank)} border-2 hover:shadow-lg transition-all`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          {/* Rank/Medal */}
                          <div className="flex-shrink-0 w-16 flex items-center justify-center">
                            {getMedalIcon(restaurant.rank)}
                          </div>

                          {/* Restaurant Info */}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>
                                <strong className="text-foreground">{restaurant.totalDonations}</strong> donations
                              </span>
                              <span>
                                <strong className="text-foreground">{restaurant.totalServings.toLocaleString()}</strong> servings
                              </span>
                              <span>
                                <strong className="text-foreground">{restaurant.completedDonations}</strong> completed
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="flex-shrink-0 w-32 hidden md:block">
                            <div className="text-sm text-muted-foreground mb-1">Impact Score</div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${Math.min((restaurant.totalServings / Math.max(...rankings.map(r => r.totalServings))) * 100, 100)}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Want to Join the Leaderboard?</h3>
              <p className="text-primary-foreground/90 mb-4">
                Start donating surplus food and make a real impact in your community
              </p>
              <Button variant="secondary" asChild>
                <Link href="/signup/restaurant">Register as Restaurant</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
