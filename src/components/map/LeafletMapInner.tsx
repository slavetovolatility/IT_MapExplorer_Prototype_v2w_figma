'use client'
import { useEffect, useRef, useState } from 'react'
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import type { Place } from '@/types'
import { CATEGORIES } from '@/data'
import I from '@/components/ui/icons'

const CITY_VIEW: Record<string, { lat: number; lng: number; zoom: number }> = {
  bangkok: { lat: 13.7563, lng: 100.5018, zoom: 13 },
  phuket:  { lat: 7.8804,  lng: 98.3523,  zoom: 11 },
}

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID'

function PinMarker({ accent, selected }: { accent: string; selected: boolean }) {
  const s = selected ? 40 : 32
  return (
    <div style={{
      width: s, height: s,
      borderRadius: '50% 50% 50% 0',
      transform: 'rotate(-45deg)',
      background: accent,
      border: '2.5px solid #fff',
      boxShadow: selected ? '0 4px 12px rgba(0,0,0,.42)' : '0 2px 6px rgba(0,0,0,.28)',
      transition: 'all .15s',
    }} />
  )
}

function UserDot() {
  return (
    <div style={{
      width: 16, height: 16, borderRadius: '50%',
      background: '#1A73E8', border: '2.5px solid #fff',
      boxShadow: '0 0 0 4px rgba(26,115,232,.22)',
    }}/>
  )
}

function CityFollower({ city }: { city: string }) {
  const map = useMap()
  const prev = useRef(city)
  useEffect(() => {
    if (!map || prev.current === city) return
    prev.current = city
    const v = CITY_VIEW[city] ?? CITY_VIEW.bangkok
    map.panTo({ lat: v.lat, lng: v.lng })
    map.setZoom(v.zoom)
  }, [city, map])
  return null
}

function SelectedFollower({ selectedId, pins }: { selectedId?: string | null; pins: Place[] }) {
  const map = useMap()
  const prev = useRef(selectedId)
  useEffect(() => {
    if (!map || !selectedId || prev.current === selectedId) return
    prev.current = selectedId
    const p = pins.find(pl => pl.id === selectedId)
    if (!p) return
    map.panTo({ lat: p.coords[0], lng: p.coords[1] })
    map.setZoom(16)
  }, [selectedId, pins, map])
  return null
}

function MapControls() {
  const map = useMap()
  const [locating, setLocating] = useState(false)
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)

  const handleLocate = () => {
    if (!map || !navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude }
        setUserPos(pos)
        map.panTo(pos)
        map.setZoom(15)
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleOpenInMaps = () => {
    const center = map?.getCenter()
    if (!center) return
    const zoom = map?.getZoom() ?? 13
    window.open(
      `https://www.google.com/maps/@${center.lat()},${center.lng()},${zoom}z`,
      '_blank', 'noopener'
    )
  }

  return (
    <>
      {userPos && (
        <AdvancedMarker position={userPos} zIndex={200}>
          <UserDot/>
        </AdvancedMarker>
      )}
      <div className="map-fab-col">
        <button
          className="fab"
          aria-label="Locate me"
          onClick={handleLocate}
          style={{ color: locating ? '#1A73E8' : undefined }}
        >
          <I.locate size={18}/>
        </button>
        <button className="fab" aria-label="Open in Google Maps" onClick={handleOpenInMaps}>
          <I.ext size={18}/>
        </button>
        <button className="fab" aria-label="Zoom in" onClick={() => map?.setZoom((map.getZoom() ?? 13) + 1)}>
          <I.plus size={16}/>
        </button>
        <button className="fab" aria-label="Zoom out" onClick={() => map?.setZoom((map.getZoom() ?? 13) - 1)}>
          <I.minus size={16}/>
        </button>
      </div>
    </>
  )
}

interface Props {
  pins?: Place[]
  selectedId?: string | null
  onSelect?: (place: Place) => void
  city?: string
}

export default function GoogleMapInner({ pins = [], selectedId, onSelect, city = 'bangkok' }: Props) {
  const cityView = CITY_VIEW[city] ?? CITY_VIEW.bangkok
  const selPin = selectedId ? pins.find(p => p.id === selectedId) : null
  const initialCenter = selPin
    ? { lat: selPin.coords[0], lng: selPin.coords[1] }
    : { lat: cityView.lat, lng: cityView.lng }
  const initialZoom = selPin ? 16 : cityView.zoom
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        mapId={MAP_ID}
        gestureHandling="greedy"
        disableDefaultUI
        style={{ width: '100%', height: '100%' }}
      >
        <CityFollower city={city} />
        <SelectedFollower selectedId={selectedId} pins={pins} />
        <MapControls/>
        {pins.map(p => {
          const cat = CATEGORIES.find(c => c.id === p.category)
          const accent = cat?.accent ?? '#C13D2F'
          const sel = selectedId === p.id
          return (
            <AdvancedMarker
              key={p.id}
              position={{ lat: p.coords[0], lng: p.coords[1] }}
              zIndex={sel ? 100 : undefined}
              onClick={() => onSelect?.(p)}
            >
              <PinMarker accent={accent} selected={sel} />
            </AdvancedMarker>
          )
        })}
      </Map>
    </APIProvider>
  )
}
