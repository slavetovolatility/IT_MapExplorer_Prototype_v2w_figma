import type { CSSProperties } from 'react'

interface IconProps {
  size?: number
  stroke?: number
  fill?: string
  style?: CSSProperties
}

const wrap = (children: React.ReactNode, { size = 22, stroke = 1.6, fill = 'none', style }: IconProps = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
)

const I: Record<string, (p?: IconProps) => React.ReactElement> = {}

I.search    = (p={}) => wrap(<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>, p)
I.x         = (p={}) => wrap(<><path d="M6 6 18 18M18 6 6 18"/></>, p)
I.chevR     = (p={}) => wrap(<><path d="m9 6 6 6-6 6"/></>, p)
I.chevL     = (p={}) => wrap(<><path d="m15 6-6 6 6 6"/></>, p)
I.chevD     = (p={}) => wrap(<><path d="m6 9 6 6 6-6"/></>, p)
I.arrowL    = (p={}) => wrap(<><path d="M19 12H5M11 6l-6 6 6 6"/></>, p)
I.heart     = (p={}) => wrap(<><path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z"/></>, p)
I.heartFill = (p={}) => wrap(<><path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z" fill="currentColor"/></>, p)
I.share     = (p={}) => wrap(<><circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="m8 11 8-4M8 13l8 4"/></>, p)
I.pin       = (p={}) => wrap(<><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></>, p)
I.pinFill   = (p={}) => wrap(<><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" fill="currentColor"/><circle cx="12" cy="9" r="2.2" fill="#fff" stroke="none"/></>, p)
I.compass   = (p={}) => wrap(<><circle cx="12" cy="12" r="9"/><path d="m15 9-4 2-2 4 4-2z"/></>, p)
I.book      = (p={}) => wrap(<><path d="M4 4h8a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M16 8a4 4 0 0 1 4-4v12a4 4 0 0 0-4-4"/></>, p)
I.map       = (p={}) => wrap(<><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></>, p)
I.user      = (p={}) => wrap(<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>, p)
I.menu      = (p={}) => wrap(<><path d="M3 7h18M3 12h18M3 17h18"/></>, p)
I.grid      = (p={}) => wrap(<><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></>, p)
I.bookmark  = (p={}) => wrap(<><path d="M6 4h12v17l-6-4-6 4z"/></>, p)
I.bookmarkFill = (p={}) => wrap(<><path d="M6 4h12v17l-6-4-6 4z" fill="currentColor"/></>, p)
I.clock     = (p={}) => wrap(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, p)
I.filter    = (p={}) => wrap(<><path d="M3 5h18M6 12h12M10 19h4"/></>, p)
I.sliders   = (p={}) => wrap(<><path d="M4 6h12M20 6h0M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="18" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></>, p)
I.locate    = (p={}) => wrap(<><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>, p)
I.warning   = (p={}) => wrap(<><path d="M12 3 2 21h20z"/><path d="M12 10v4"/><circle cx="12" cy="17.5" r=".7" fill="currentColor" stroke="none"/></>, p)
I.shield    = (p={}) => wrap(<><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/></>, p)
I.star      = (p={}) => wrap(<><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-2.9-5.6 2.9 1-6.2L3 9.6l6.3-.9z" fill="currentColor"/></>, p)
I.starOutline = (p={}) => wrap(<><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-2.9-5.6 2.9 1-6.2L3 9.6l6.3-.9z"/></>, p)
I.dot       = (p={}) => wrap(<><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></>, p)
I.plus      = (p={}) => wrap(<><path d="M12 5v14M5 12h14"/></>, p)
I.minus     = (p={}) => wrap(<><path d="M5 12h14"/></>, p)
I.mic       = (p={}) => wrap(<><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></>, p)
I.ext       = (p={}) => wrap(<><path d="M14 4h6v6M20 4l-9 9M9 5H4v15h15v-5"/></>, p)
I.flag      = (p={}) => wrap(<><path d="M5 21V4h14l-3 4 3 4H5"/></>, p)
I.phone     = (p={}) => wrap(<><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z"/></>, p)
I.walk      = (p={}) => wrap(<><circle cx="13" cy="4" r="2"/><path d="m10 22 2-7-3-3 2-5 4 2 2 4M9 12l-2 4"/></>, p)
I.noodles   = (p={}) => wrap(<><path d="M4 12c0-4 4-6 8-6s8 2 8 6"/><path d="M3 13h18l-1 3a4 4 0 0 1-4 3H8a4 4 0 0 1-4-3z"/><path d="M9 6V3M13 6V3"/></>, p)
I.plate     = (p={}) => wrap(<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/></>, p)
I.lantern   = (p={}) => wrap(<><path d="M12 3v2M12 19v2"/><path d="M7 6h10v3a5 5 0 0 1-10 0z"/><path d="M7 9h10v3a5 5 0 0 1-10 0z"/><path d="M7 12h10v3a5 5 0 0 1-10 0z"/></>, p)
I.cup       = (p={}) => wrap(<><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M7 4v2M11 4v2"/></>, p)
I.glass     = (p={}) => wrap(<><path d="M6 4h12l-2 8a4 4 0 0 1-8 0z"/><path d="M12 12v8M9 21h6"/></>, p)
I.temple    = (p={}) => wrap(<><path d="M12 3 4 9h16z"/><path d="M5 9v10h14V9"/><path d="M10 19v-5a2 2 0 0 1 4 0v5"/></>, p)
I.bag       = (p={}) => wrap(<><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>, p)
I.glove     = (p={}) => wrap(<><path d="M7 4h7a3 3 0 0 1 3 3v3l3 1v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V7a3 3 0 0 1 2-3z"/><path d="M7 11h10"/></>, p)
I.lotus     = (p={}) => wrap(<><path d="M12 12v8"/><path d="M12 12c-3-3-7-2-7-2s0 5 4 7M12 12c3-3 7-2 7-2s0 5-4 7M12 12c0-4 2-7 2-7s2 3 2 7M12 12c0-4-2-7-2-7s-2 3-2 7"/></>, p)
I.train     = (p={}) => wrap(<><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 7h6"/><circle cx="9" cy="14" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r=".8" fill="currentColor" stroke="none"/><path d="M8 21l1-3M16 21l-1-3"/></>, p)
I.metro     = (p={}) => wrap(<><path d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v9H4z"/><path d="M4 12h16"/><circle cx="8" cy="15" r=".8" fill="currentColor" stroke="none"/><circle cx="16" cy="15" r=".8" fill="currentColor" stroke="none"/><path d="M6 21l2-3M18 21l-2-3"/></>, p)
I.bus       = (p={}) => wrap(<><rect x="4" y="5" width="16" height="12" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="14" r=".8" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r=".8" fill="currentColor" stroke="none"/><path d="M5 21v-3M19 21v-3"/></>, p)
I.moto      = (p={}) => wrap(<><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6l-3-6h4l-3-5h-2"/><path d="M8 11h4"/></>, p)
I.planeTrain = (p={}) => wrap(<><path d="M2 13 22 6l-2 5-12 5-2 4-2-1 1-3-3-2z"/></>, p)
I.leaf      = (p={}) => wrap(<><path d="M20 4c-9 0-15 5-15 12 0 0 6-3 9-6M5 19l8-8"/></>, p)
I.wave      = (p={}) => wrap(<><path d="M2 9c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></>, p)
I.film      = (p={}) => wrap(<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 12h18M3 8h4M3 16h4M17 8h4M17 16h4"/></>, p)
I.cross     = (p={}) => wrap(<><path d="M10 3h4v6h6v4h-6v6h-4v-6H4V9h6z" fill="currentColor"/></>, p)
I.tag       = (p={}) => wrap(<><path d="M3 12V4h8l10 10-8 8z"/><circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none"/></>, p)
I.speech    = (p={}) => wrap(<><path d="M21 12a8 8 0 0 1-8 8H8l-4 3v-4A8 8 0 1 1 21 12z"/><path d="M8 11h8M8 14h5"/></>, p)
I.wifi      = (p={}) => wrap(<><path d="M2 9a14 14 0 0 1 20 0M5 13a9 9 0 0 1 14 0M9 17a4 4 0 0 1 6 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></>, p)
I.coffee    = (p={}) => wrap(<><path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M7 4v2M11 4v2"/></>, p)
I.beach     = (p={}) => wrap(<><circle cx="6" cy="6" r="3"/><path d="M6 9v13M2 17c2-2 8-2 10 0M14 20c2-2 8-2 10 0"/><path d="M6 9c6 1 14 2 16-3"/></>, p)
I.send      = (p={}) => wrap(<><path d="M3 12 21 3l-7 18-3-7z"/><path d="m10 14 4-4"/></>, p)
I.refresh   = (p={}) => wrap(<><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>, p)
I.mail      = (p={}) => wrap(<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="m3 6 9 7 9-7"/></>, p)
I.check     = (p={}) => wrap(<><path d="M5 12l5 5L19 7"/></>, p)
I.users     = (p={}) => wrap(<><circle cx="9" cy="7" r="4"/><path d="M3 21a6 6 0 0 1 12 0"/><path d="M16 3.13a4 4 0 0 1 0 7.75M21 21a6 6 0 0 0-9-5.18"/></>, p)
I.edit      = (p={}) => wrap(<><path d="M4 20h4l11-11-4-4L4 16z"/><path d="m15 5 4 4"/></>, p)
I.trash     = (p={}) => wrap(<><path d="M4 7h16M10 11v6M14 11v6M5 7l1 12h12l1-12"/><path d="M9 7V4h6v3"/></>, p)
I.camera    = (p={}) => wrap(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>, p)
I.image     = (p={}) => wrap(<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>, p)
I.eye       = (p={}) => wrap(<><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></>, p)
I.eyeOff    = (p={}) => wrap(<><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a18.6 18.6 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="m1 1 22 22"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></>, p)

export default I
