'use client'

import { useEffect, useState, useCallback } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api'

type Location = {
  lat: number
  lng: number
  address: string
}

type GoogleMapTrackingProps = {
  pickup: Location
  dropoff: Location
  currentLocation: { lat: number; lng: number }
  agentName: string
}

const mapContainerStyle = {
  width: '100%',
  height: '500px'
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
}

export default function GoogleMapTracking({ 
  pickup, 
  dropoff, 
  currentLocation, 
  agentName 
}: GoogleMapTrackingProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  
  const center = {
    lat: (pickup.lat + dropoff.lat) / 2,
    lng: (pickup.lng + dropoff.lng) / 2
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (map && currentLocation) {
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(pickup)
      bounds.extend(dropoff)
      bounds.extend(currentLocation)
      map.fitBounds(bounds)
    }
  }, [currentLocation, map, pickup, dropoff])

  // Route path (completed)
  const completedPath = [
    { lat: pickup.lat, lng: pickup.lng },
    { lat: currentLocation.lat, lng: currentLocation.lng }
  ]

  // Remaining route (dashed)
  const remainingPath = [
    { lat: currentLocation.lat, lng: currentLocation.lng },
    { lat: dropoff.lat, lng: dropoff.lng }
  ]

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Completed route line (solid orange) */}
        <Polyline
          path={completedPath}
          options={{
            strokeColor: '#f97316',
            strokeOpacity: 1,
            strokeWeight: 5,
            geodesic: true
          }}
        />

        {/* Remaining route line (dashed gray) */}
        <Polyline
          path={remainingPath}
          options={{
            strokeColor: '#94a3b8',
            strokeOpacity: 0.7,
            strokeWeight: 4,
            geodesic: true,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3
              },
              offset: '0',
              repeat: '20px'
            }]
          }}
        />

        {/* Pickup Marker (Green) */}
        <Marker
          position={pickup}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          }}
          onClick={() => setSelectedMarker('pickup')}
        />
        {selectedMarker === 'pickup' && (
          <InfoWindow
            position={pickup}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <p className="font-bold text-green-600">Pickup Location</p>
              <p className="text-sm text-gray-600">{pickup.address}</p>
            </div>
          </InfoWindow>
        )}

        {/* Dropoff Marker (Red) */}
        <Marker
          position={dropoff}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40)
          }}
          onClick={() => setSelectedMarker('dropoff')}
        />
        {selectedMarker === 'dropoff' && (
          <InfoWindow
            position={dropoff}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <p className="font-bold text-red-600">Dropoff Location</p>
              <p className="text-sm text-gray-600">{dropoff.address}</p>
            </div>
          </InfoWindow>
        )}

        {/* Current Location Marker (Orange Truck - Animated) */}
        <Marker
          position={currentLocation}
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="22" fill="#f97316" opacity="0.2"/>
                <circle cx="24" cy="24" r="18" fill="#f97316"/>
                <path d="M16 20 L16 28 L20 28 M28 28 L32 28 L32 20 L24 20 L24 16 L16 16 L16 20" 
                      fill="white" stroke="white" strokeWidth="1.5"/>
                <circle cx="22" cy="28" r="2" fill="white"/>
                <circle cx="30" cy="28" r="2" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(48, 48),
            anchor: new google.maps.Point(24, 24)
          }}
          onClick={() => setSelectedMarker('current')}
          animation={google.maps.Animation.BOUNCE}
        />
        {selectedMarker === 'current' && (
          <InfoWindow
            position={currentLocation}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2">
              <p className="font-bold text-orange-600">Delivery Agent</p>
              <p className="text-sm text-gray-600">{agentName}</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Location
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}
