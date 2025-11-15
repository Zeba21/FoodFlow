// Local storage management for FoodFlow app
export interface User {
  id: string
  email: string
  name: string
  role: 'restaurant' | 'ngo' | 'delivery' | 'admin'
  organizationName?: string
  location?: string
  phone?: string
  vehicleType?: string
}

export interface Donation {
  id: string
  restaurantId: string
  restaurantName: string
  foodType: string
  quantity: number
  expiryTime: string
  location: string
  status: 'available' | 'accepted' | 'in-transit' | 'delivered'
  ngoId?: string
  ngoName?: string
  deliveryAgentId?: string
  deliveryAgentName?: string
  createdAt: string
  acceptedAt?: string
  deliveredAt?: string
  image?: string
}

export interface Notification {
  id: string
  userId: string
  message: string
  timestamp: string
  read: boolean
  type: 'info' | 'success' | 'warning'
}

export const storage = {
  // User management
  saveUser: (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user))
    const users = storage.getUsers()
    const existingIndex = users.findIndex(u => u.id === user.id)
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    localStorage.setItem('users', JSON.stringify(users))
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  },

  getUsers: (): User[] => {
    const users = localStorage.getItem('users')
    return users ? JSON.parse(users) : []
  },

  logout: () => {
    localStorage.removeItem('currentUser')
  },

  // Donation management
  saveDonation: (donation: Donation) => {
    const donations = storage.getDonations()
    const existingIndex = donations.findIndex(d => d.id === donation.id)
    if (existingIndex >= 0) {
      donations[existingIndex] = donation
    } else {
      donations.push(donation)
    }
    localStorage.setItem('donations', JSON.stringify(donations))
  },

  getDonations: (): Donation[] => {
    const donations = localStorage.getItem('donations')
    return donations ? JSON.parse(donations) : []
  },

  getDonationById: (id: string): Donation | null => {
    const donations = storage.getDonations()
    return donations.find(d => d.id === id) || null
  },

  // Notification management
  saveNotification: (notification: Notification) => {
    const notifications = storage.getNotifications()
    notifications.unshift(notification)
    localStorage.setItem('notifications', JSON.stringify(notifications))
  },

  getNotifications: (): Notification[] => {
    const notifications = localStorage.getItem('notifications')
    return notifications ? JSON.parse(notifications) : []
  },

  markNotificationRead: (id: string) => {
    const notifications = storage.getNotifications()
    const notification = notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  },

  // Initialize with sample data
  initSampleData: () => {
    const users = storage.getUsers()
    if (users.length === 0) {
      // Create sample users
      const sampleUsers: User[] = [
        {
          id: 'admin-1',
          email: 'admin@foodflow.com',
          name: 'Admin User',
          role: 'admin',
          phone: '+1234567890'
        },
        {
          id: 'rest-1',
          email: 'restaurant1@example.com',
          name: 'John Doe',
          role: 'restaurant',
          organizationName: 'The Grand Hotel',
          location: 'Downtown, City Center',
          phone: '+1234567891'
        },
        {
          id: 'rest-2',
          email: 'restaurant2@example.com',
          name: 'Jane Smith',
          role: 'restaurant',
          organizationName: 'Sunset Restaurant',
          location: 'Beach Road, Seaside',
          phone: '+1234567892'
        },
        {
          id: 'ngo-1',
          email: 'ngo1@example.com',
          name: 'Sarah Johnson',
          role: 'ngo',
          organizationName: 'Hope Foundation',
          location: 'North District',
          phone: '+1234567893'
        },
        {
          id: 'delivery-1',
          email: 'delivery1@example.com',
          name: 'Mike Wilson',
          role: 'delivery',
          phone: '+1234567894',
          vehicleType: 'Bike'
        }
      ]
      localStorage.setItem('users', JSON.stringify(sampleUsers))

      // Create sample donations
      const sampleDonations: Donation[] = [
        {
          id: 'don-1',
          restaurantId: 'rest-1',
          restaurantName: 'The Grand Hotel',
          foodType: 'Fresh Salads & Sandwiches',
          quantity: 50,
          expiryTime: '2 hours',
          location: 'Downtown, City Center',
          status: 'delivered',
          ngoId: 'ngo-1',
          ngoName: 'Hope Foundation',
          deliveryAgentId: 'delivery-1',
          deliveryAgentName: 'Mike Wilson',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          acceptedAt: new Date(Date.now() - 2400000).toISOString(),
          deliveredAt: new Date(Date.now() - 1200000).toISOString()
        },
        {
          id: 'don-2',
          restaurantId: 'rest-2',
          restaurantName: 'Sunset Restaurant',
          foodType: 'Cooked Rice & Curry',
          quantity: 30,
          expiryTime: '3 hours',
          location: 'Beach Road, Seaside',
          status: 'in-transit',
          ngoId: 'ngo-1',
          ngoName: 'Hope Foundation',
          deliveryAgentId: 'delivery-1',
          deliveryAgentName: 'Mike Wilson',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          acceptedAt: new Date(Date.now() - 900000).toISOString()
        },
        {
          id: 'don-3',
          restaurantId: 'rest-1',
          restaurantName: 'The Grand Hotel',
          foodType: 'Bread & Pastries',
          quantity: 40,
          expiryTime: '4 hours',
          location: 'Downtown, City Center',
          status: 'available',
          createdAt: new Date(Date.now() - 600000).toISOString()
        }
      ]
      localStorage.setItem('donations', JSON.stringify(sampleDonations))
    }
  }
}
