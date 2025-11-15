# FoodFlow - Food Donation Management System

A comprehensive web application connecting restaurants with NGOs to reduce food waste and feed communities in need. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

### Authentication System
- **Role-based signup**: Restaurant, NGO, and Delivery Agent
- **Secure login** with localStorage-based session management
- **Role-specific redirects** to appropriate dashboards

### Dashboard Features

#### Restaurant Dashboard
- Submit food donations with details (type, quantity, expiry, location)
- Track donation status (Available → Accepted → Delivered)
- View analytics with weekly donation charts
- Monitor impact metrics (total donations, servings, success rate)
- Color-coded status system for easy tracking

#### NGO Dashboard
- Browse available food donations
- Accept donations for distribution
- Track in-transit and completed donations
- Analytics with weekly activity charts and pie charts
- Community impact summary

#### Delivery Agent Dashboard
- View assigned pickup tasks
- Live map tracking for deliveries
- Mark deliveries as complete
- Performance analytics with completion rates
- Achievement tracking for deliveries completed

#### Admin Dashboard
- System-wide monitoring and management
- Key metrics: Donors, NGOs, Delivery Agents, Total Donations, Success Rate
- Status distribution pie chart
- Weekly activity line chart (Donations vs Deliveries)
- Recent donations table with filtering by status
- Real-time overview of entire system

### Additional Features

#### Restaurant Leaderboard
- Ranking system based on total servings donated
- Top 3 restaurants highlighted with medals (Gold, Silver, Bronze)
- Impact metrics: Total servings, completed donations
- Visual progress bars showing relative contribution
- Call-to-action for new restaurant registrations

#### Live Order Tracking
- Real-time delivery tracking with animated map
- Delivery progress indicator (0-100%)
- Timeline showing order stages:
  - Order Placed
  - Picked Up
  - In Transit
  - Delivered
- Visual map with pickup and dropoff locations
- Animated delivery agent icon moving along route
- Order details and addresses

### Design & UX

#### Light Mode Theme
- Clean, professional interface
- Orange primary color (#f97316) representing warmth and food
- Consistent color-coded status system:
  - 🔴 Red: Available
  - 🟡 Yellow: Accepted/In Transit
  - 🟢 Green: Delivered

#### Animations
- Smooth page transitions with Framer Motion
- Fade-in and slide-up effects for cards
- Hover effects on interactive elements
- Animated charts and progress indicators
- Pulsing icons for real-time updates
- Animated arrows in the homepage flow diagram

#### Responsive Design
- Mobile-first approach
- Adapts seamlessly to all screen sizes
- Touch-friendly interface elements
- Optimized layouts for tablets and desktops

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI + shadcn/ui
- **Charts**: Recharts 2.15
- **Animations**: Framer Motion 12.23
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## Project Structure

\`\`\`
app/
├── page.tsx                      # Landing page with hero, features, how it works
├── login/page.tsx                # Login page
├── role-selection/page.tsx       # Choose role (Restaurant/NGO/Delivery)
├── signup/
│   ├── restaurant/page.tsx       # Restaurant signup form
│   ├── ngo/page.tsx             # NGO signup form
│   └── delivery/page.tsx        # Delivery agent signup form
├── dashboard/
│   ├── restaurant/page.tsx      # Restaurant dashboard with analytics
│   ├── ngo/page.tsx            # NGO dashboard with analytics
│   └── delivery/page.tsx       # Delivery dashboard with analytics
├── admin/page.tsx               # Admin dashboard with system overview
├── leaderboard/page.tsx         # Restaurant rankings
├── tracking/[id]/page.tsx       # Live delivery tracking
└── globals.css                  # Global styles with theme variables

components/ui/                    # Reusable UI components (shadcn)
lib/
└── storage.ts                   # LocalStorage management utilities

public/
└── delicious-indian-food-thali-with-various-dishes.jpg  # Hero image
\`\`\`

## Data Models

### User
\`\`\`typescript
{
  id: string
  email: string
  password: string
  name: string
  role: 'restaurant' | 'ngo' | 'delivery' | 'admin'
  organizationName?: string
  location?: string
  phone?: string
  vehicleType?: string
}
\`\`\`

### Donation
\`\`\`typescript
{
  id: string
  restaurantId: string
  restaurantName: string
  foodType: string
  quantity: string
  expiryTime: string
  pickupLocation: string
  status: 'available' | 'accepted' | 'delivered'
  createdAt: string
  ngoId?: string
  ngoName?: string
  deliveryAgentId?: string
  deliveryAgentName?: string
}
\`\`\`

## User Flows

### Restaurant Flow
1. Sign up as Restaurant
2. Log in → Restaurant Dashboard
3. Add food donation with details
4. Track donation status updates
5. View analytics and impact metrics

### NGO Flow
1. Sign up as NGO
2. Log in → NGO Dashboard
3. Browse available donations
4. Accept donations for distribution
5. Track in-transit deliveries
6. View received donations and analytics

### Delivery Agent Flow
1. Sign up as Delivery Agent
2. Log in → Delivery Dashboard
3. View assigned pickup tasks
4. Access live tracking for active deliveries
5. Mark deliveries as complete
6. View performance analytics

### Admin Flow
1. Admin login credentials
2. Access Admin Dashboard
3. Monitor system-wide activity
4. View all donations and their statuses
5. Filter and analyze data
6. Track success rates and performance

## Key Features Implementation

### Color-Coded Status System
- **Available** (Red): Food waiting to be accepted by NGO
- **Accepted** (Yellow): NGO accepted, delivery in progress
- **Delivered** (Green): Successfully delivered to NGO

### Analytics Dashboard
Each role has dedicated analytics:
- **Charts**: Line charts for trends, bar charts for comparisons, pie charts for distribution
- **Metrics**: Total donations, completion rates, servings delivered
- **Time-based data**: Weekly activity tracking
- **Performance indicators**: Success rates, impact summaries

### Live Map Tracking
- Simulated GPS tracking with animated delivery agent
- Real-time progress bar (0-100%)
- Visual route path from pickup to dropoff
- Pulsing location markers
- Order timeline with status checkpoints

### Restaurant Leaderboard
- Automatic ranking based on total servings donated
- Medal system for top 3 performers
- Visual impact scores with progress bars
- Encourages healthy competition among restaurants

## Local Storage Keys

- `currentUser`: Currently logged-in user object
- `users`: Array of all registered users
- `donations`: Array of all food donations
- `notifications`: Array of system notifications (future feature)

## Getting Started

1. **Install dependencies**:
\`\`\`bash
npm install
\`\`\`

2. **Run development server**:
\`\`\`bash
npm run dev
\`\`\`

3. **Open browser**: Navigate to `http://localhost:3000`

4. **Test the app**:
   - Create accounts for different roles
   - Submit donations as a restaurant
   - Accept donations as an NGO
   - Deliver as a delivery agent
   - Monitor everything in admin dashboard

## Demo Credentials

You can create your own accounts, or use the test flow:

1. **Restaurant**: Sign up → Add donations
2. **NGO**: Sign up → Accept available donations
3. **Delivery Agent**: Sign up → Mark deliveries complete
4. **Admin**: Access `/admin` after logging in with admin role

## Deployment

This project is optimized for Vercel deployment:

\`\`\`bash
npm run build
\`\`\`

Deploy to Vercel with one click or via CLI:
\`\`\`bash
vercel --prod
\`\`\`

## Future Enhancements

- Real database integration (Supabase/Neon)
- Real-time notifications with WebSockets
- SMS/Email alerts for status updates
- Actual Google Maps integration
- Mobile app (React Native)
- AI-based donation matching
- Impact reports generation (PDF)
- Multi-language support
- Payment integration for donations

## Contributing

This is a demonstration project showcasing a complete food donation management system with modern web technologies.

## License

MIT License - Feel free to use this project for learning and development purposes.

---

**Built with ❤️ to reduce food waste and feed communities in need.**
