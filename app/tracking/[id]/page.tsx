'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Utensils, ArrowLeft, MapPin, Clock, Package, CheckCircle, Truck, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const GoogleMapComponent = dynamic(() => import('@/components/google-map'), { ssr: false })

type DeliveryLocation = {
  lat: number
  lng: number
  address: string
}

type DeliveryData = {
  id: string
  donor: string
  foodType: string
  quantity: string
  ngo: string
  agent: string
  status: string
  pickup: DeliveryLocation
  dropoff: DeliveryLocation
  currentLocation: { lat: number; lng: number }
}

export default function TrackingPage() {
  const params = useParams()
  const [progress, setProgress] = useState(45)
  const [currentStep, setCurrentStep] = useState(2)
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    id: '1',
    donor: 'The Grand Hotel',
    foodType: 'Biryani',
    quantity: '50 servings',
    ngo: 'Community Food Bank',
    agent: 'John Doe',
    status: 'In Transit',
    pickup: { lat: 28.6139, lng: 77.2090, address: '123 Main St, Delhi' },
    dropoff: { lat: 28.6289, lng: 77.2195, address: '456 NGO St, Delhi' },
    currentLocation: { lat: 28.6139, lng: 77.2090 }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryData(prev => {
        const newProgress = Math.min(progress + 2, 100)
        
        // Calculate new position along the route
        const latDiff = prev.dropoff.lat - prev.pickup.lat
        const lngDiff = prev.dropoff.lng - prev.pickup.lng
        const progressRatio = newProgress / 100
        
        return {
          ...prev,
          currentLocation: {
            lat: prev.pickup.lat + (latDiff * progressRatio),
            lng: prev.pickup.lng + (lngDiff * progressRatio)
          }
        }
      })
      
      setProgress(prev => {
        const newProgress = Math.min(prev + 2, 100)
        if (newProgress >= 100) {
          setCurrentStep(3)
        } else if (newProgress >= 50) {
          setCurrentStep(2)
        }
        return newProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [progress])

  const steps = [
    { label: 'Order Placed', icon: Package, time: '7:30 PM', completed: true },
    { label: 'Picked Up', icon: CheckCircle, time: '7:45 PM', completed: true },
    { label: 'In Transit', icon: Truck, time: '8:00 PM', completed: progress > 0, current: progress < 100 },
    { label: 'Delivered', icon: MapPin, time: 'Estimated 8:15 PM', completed: progress >= 100 }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/delivery">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <Utensils className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Live Tracking</h1>
                  <p className="text-sm text-muted-foreground">Order #{deliveryData.id}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Navigation className="h-4 w-4 text-green-600 animate-pulse" />
              <span className="text-muted-foreground">Live Updates Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative w-full h-[500px]">
                    <GoogleMapComponent
                      pickup={deliveryData.pickup}
                      dropoff={deliveryData.dropoff}
                      currentLocation={deliveryData.currentLocation}
                      agentName={deliveryData.agent}
                    />
                    
                    {/* Progress Indicator Overlay */}
                    <div className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Delivery Progress</span>
                        <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          className="bg-primary h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Est. arrival: {progress >= 100 ? 'Delivered!' : '15 mins'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Restaurant</p>
                    <p className="font-medium">{deliveryData.donor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Food Type</p>
                    <p className="font-medium">{deliveryData.foodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{deliveryData.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NGO</p>
                    <p className="font-medium">{deliveryData.ngo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Agent</p>
                    <p className="font-medium">{deliveryData.agent}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {steps.map((step, index) => {
                      const Icon = step.icon
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex gap-3"
                        >
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.completed ? 'bg-green-100' : 'bg-muted'
                            } ${step.current ? 'ring-4 ring-primary/20' : ''}`}>
                              <Icon className={`h-5 w-5 ${
                                step.completed ? 'text-green-600' : 'text-muted-foreground'
                              }`} />
                            </div>
                            {index < steps.length - 1 && (
                              <div className={`absolute left-1/2 top-10 w-0.5 h-8 -ml-px ${
                                step.completed ? 'bg-green-300' : 'bg-border'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-medium ${step.current ? 'text-primary' : ''}`}>
                              {step.label}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.time}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Addresses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Addresses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-muted-foreground">{deliveryData.pickup.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dropoff</p>
                      <p className="text-sm text-muted-foreground">{deliveryData.dropoff.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
