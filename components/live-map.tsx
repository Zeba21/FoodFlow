'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Package, MapPin, Truck } from 'lucide-react'

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (color: string, IconComponent: any) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border: 3px solid white;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          ${color === '#22c55e' ? '<path d="M20 6L9 17l-5-5"/>' : 
            color === '#ef4444' ? '<circle cx="12" cy="12" r="10"/>' : 
            '<path d="M5 17h14v-7l-7-4-7 4v7z"/>'}
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })
}

const pickupIcon = createCustomIcon('#22c55e', Package)
const dropoffIcon = createCustomIcon('#ef4444', MapPin)
const truckIcon = createCustomIcon('#f97316', Truck)

type LiveMapProps = {
  pickup: { lat: number; lng: number; address: string }
  dropoff: { lat: number; lng: number; address: string }
  currentLocation: { lat: number; lng: number }
  agentName: string
}

// Component to recenter map when current location changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true })
  }, [center, map])
  
  return null
}

export default function LiveMap({ pickup, dropoff, currentLocation, agentName }: LiveMapProps) {
  const routePath: [number, number][] = [
    [pickup.lat, pickup.lng],
    [currentLocation.lat, currentLocation.lng],
  ]
  
  const fullRoutePath: [number, number][] = [
    [pickup.lat, pickup.lng],
    [dropoff.lat, dropoff.lng],
  ]
  
  const center: [number, number] = [
    (pickup.lat + dropoff.lat) / 2,
    (pickup.lng + dropoff.lng) / 2,
  ]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Full route (dashed line) */}
      <Polyline
        positions={fullRoutePath}
        pathOptions={{
          color: '#cbd5e1',
          weight: 4,
          dashArray: '10, 10',
        }}
      />
      
      {/* Completed route (solid line) */}
      <Polyline
        positions={routePath}
        pathOptions={{
          color: '#f97316',
          weight: 4,
        }}
      />
      
      {/* Pickup Location */}
      <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
        <Popup>
          <div className="p-2">
            <p className="font-bold text-green-600">Pickup Location</p>
            <p className="text-sm text-gray-600">{pickup.address}</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Dropoff Location */}
      <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
        <Popup>
          <div className="p-2">
            <p className="font-bold text-red-600">Dropoff Location</p>
            <p className="text-sm text-gray-600">{dropoff.address}</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Current Location (Delivery Agent) */}
      <Marker position={[currentLocation.lat, currentLocation.lng]} icon={truckIcon}>
        <Popup>
          <div className="p-2">
            <p className="font-bold text-primary">Delivery Agent</p>
            <p className="text-sm text-gray-600">{agentName}</p>
            <p className="text-xs text-gray-500 mt-1">Live Location</p>
          </div>
        </Popup>
      </Marker>
      
      <MapUpdater center={[currentLocation.lat, currentLocation.lng]} />
    </MapContainer>
  )
}
