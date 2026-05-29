// Lightweight i18n for the app's UI chrome (nav, footer, account, menus).
//
// Scope note: this translates the static interface — menus, buttons, labels,
// section headings. Place/guide content comes from the database and stays in
// its original language. Adding a language is just adding a dictionary below;
// the framework is language-agnostic.

export type Lang = 'en' | 'th'

export const LANGS: { id: Lang; label: string; native: string }[] = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'th', label: 'Thai', native: 'ไทย' },
]

export const DEFAULT_LANG: Lang = 'en'

export function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'th'
}

type Dict = Record<string, string>

const en: Dict = {
  // Header / primary nav
  'nav.map': 'Map',
  'nav.explore': 'Explore',
  'nav.guides': 'Guides',
  'nav.tools': 'Tools',
  'nav.search': 'Search "boat market", "rooftop bar"…',
  'nav.signin': 'Sign in',
  'nav.getEdge': 'Get the local edge',
  'nav.admin': 'Admin',

  // Profile menu
  'menu.adminPanel': 'Admin panel',
  'menu.saved': 'Saved places',
  'menu.recent': 'Recently viewed',
  'menu.submit': 'Submit a place',
  'menu.account': 'Account & settings',
  'menu.signout': 'Sign out',

  // Common
  'common.member': 'Member',
  'common.admin': 'Admin',
  'common.city': 'City',
  'common.signin': 'Sign in',
  'common.signout': 'Sign out',
  'common.language': 'Language',

  // Mobile bottom nav
  'bottom.explore': 'Explore',
  'bottom.map': 'Map',
  'bottom.guides': 'Guides',
  'bottom.tools': 'Tools',
  'bottom.saved': 'Saved',

  // Mobile drawer
  'drawer.exploreBangkok': 'Explore Bangkok',
  'drawer.phuket': 'Phuket guide',
  'drawer.guides': 'Practical guides',
  'drawer.transport': 'Transport (BTS / MRT)',
  'drawer.tools': 'Tourist tools',
  'drawer.scams': 'Scam detector',
  'drawer.prices': 'Price checker',

  // Footer
  'footer.tagline': 'A discovery hub for Thailand, built by people who actually live here.',
  'footer.explore': 'Explore',
  'footer.practical': 'Practical',
  'footer.contribute': 'Contribute',
  'footer.about': 'About',
  'footer.bangkok': 'Bangkok',
  'footer.phuket': 'Phuket',
  'footer.streetFood': 'Street food',
  'footer.temples': 'Temples',
  'footer.allGuides': 'All guides',
  'footer.transport': 'Transport',
  'footer.emergency': 'Emergency numbers',
  'footer.submitPlace': 'Submit a place',
  'footer.myContributions': 'My contributions',
  'footer.savedPlaces': 'Saved places',
  'footer.aboutUs': 'About us',
  'footer.editorial': 'Editorial standards',
  'footer.contact': 'Contact',
  'footer.press': 'Press',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',
  'footer.madeIn': '© 2026 Inside Thailand Explorer · Made in Bangkok',

  // Account page
  'account.signInTitle': 'Sign in to view your account',
  'account.quickLinks': 'Quick links',
  'account.settings': 'Settings',
  'account.email': 'Email',
  'account.defaultCity': 'Default city',
  'account.showCannabis': 'Show cannabis shops',
  'account.cannabisHint': 'Verify local laws before visiting',
  'account.mySubmissions': 'My submissions',
  'account.submittedCount': '{n} submitted',
  'account.recentlyViewed': 'Recently viewed',
  'account.loading': 'Loading…',
  'account.emptyHint': 'Know a spot that deserves to be on the map?',
  'account.submitIt': 'Submit it',
  'account.reviewWindow': '— editors review within 48 hours.',
}

const th: Dict = {
  // Header / primary nav
  'nav.map': 'แผนที่',
  'nav.explore': 'สำรวจ',
  'nav.guides': 'คู่มือ',
  'nav.tools': 'เครื่องมือ',
  'nav.search': 'ค้นหา "ตลาดน้ำ", "บาร์ดาดฟ้า"…',
  'nav.signin': 'เข้าสู่ระบบ',
  'nav.getEdge': 'รู้ลึกแบบคนท้องถิ่น',
  'nav.admin': 'ผู้ดูแล',

  // Profile menu
  'menu.adminPanel': 'แผงผู้ดูแล',
  'menu.saved': 'สถานที่ที่บันทึก',
  'menu.recent': 'ดูล่าสุด',
  'menu.submit': 'เพิ่มสถานที่',
  'menu.account': 'บัญชีและการตั้งค่า',
  'menu.signout': 'ออกจากระบบ',

  // Common
  'common.member': 'สมาชิก',
  'common.admin': 'ผู้ดูแล',
  'common.city': 'เมือง',
  'common.signin': 'เข้าสู่ระบบ',
  'common.signout': 'ออกจากระบบ',
  'common.language': 'ภาษา',

  // Mobile bottom nav
  'bottom.explore': 'สำรวจ',
  'bottom.map': 'แผนที่',
  'bottom.guides': 'คู่มือ',
  'bottom.tools': 'เครื่องมือ',
  'bottom.saved': 'บันทึก',

  // Mobile drawer
  'drawer.exploreBangkok': 'สำรวจกรุงเทพฯ',
  'drawer.phuket': 'คู่มือภูเก็ต',
  'drawer.guides': 'คู่มือเที่ยว',
  'drawer.transport': 'การเดินทาง (BTS / MRT)',
  'drawer.tools': 'เครื่องมือนักท่องเที่ยว',
  'drawer.scams': 'ตัวตรวจกลโกง',
  'drawer.prices': 'ตรวจสอบราคา',

  // Footer
  'footer.tagline': 'ศูนย์รวมการค้นพบเมืองไทย สร้างโดยคนที่อาศัยอยู่ที่นี่จริง ๆ',
  'footer.explore': 'สำรวจ',
  'footer.practical': 'เรื่องน่ารู้',
  'footer.contribute': 'ร่วมแบ่งปัน',
  'footer.about': 'เกี่ยวกับ',
  'footer.bangkok': 'กรุงเทพฯ',
  'footer.phuket': 'ภูเก็ต',
  'footer.streetFood': 'อาหารริมทาง',
  'footer.temples': 'วัด',
  'footer.allGuides': 'คู่มือทั้งหมด',
  'footer.transport': 'การเดินทาง',
  'footer.emergency': 'เบอร์ฉุกเฉิน',
  'footer.submitPlace': 'เพิ่มสถานที่',
  'footer.myContributions': 'รายการของฉัน',
  'footer.savedPlaces': 'สถานที่ที่บันทึก',
  'footer.aboutUs': 'เกี่ยวกับเรา',
  'footer.editorial': 'มาตรฐานบทความ',
  'footer.contact': 'ติดต่อ',
  'footer.press': 'สื่อมวลชน',
  'footer.privacy': 'ความเป็นส่วนตัว',
  'footer.terms': 'ข้อกำหนด',
  'footer.madeIn': '© 2026 Inside Thailand Explorer · สร้างในกรุงเทพฯ',

  // Account page
  'account.signInTitle': 'เข้าสู่ระบบเพื่อดูบัญชีของคุณ',
  'account.quickLinks': 'ลิงก์ด่วน',
  'account.settings': 'การตั้งค่า',
  'account.email': 'อีเมล',
  'account.defaultCity': 'เมืองเริ่มต้น',
  'account.showCannabis': 'แสดงร้านกัญชา',
  'account.cannabisHint': 'ตรวจสอบกฎหมายท้องถิ่นก่อนไป',
  'account.mySubmissions': 'รายการที่ฉันส่ง',
  'account.submittedCount': 'ส่งแล้ว {n} รายการ',
  'account.recentlyViewed': 'ดูล่าสุด',
  'account.loading': 'กำลังโหลด…',
  'account.emptyHint': 'รู้จักสถานที่เด็ด ๆ ที่ควรอยู่บนแผนที่ไหม?',
  'account.submitIt': 'ส่งเลย',
  'account.reviewWindow': '— ทีมงานตรวจสอบภายใน 48 ชั่วโมง',
}

export const DICT: Record<Lang, Dict> = { en, th }

export function translate(lang: Lang, key: string, params?: Record<string, string | number>): string {
  let s = DICT[lang]?.[key] ?? DICT.en[key] ?? key
  if (params) for (const k in params) s = s.replace(`{${k}}`, String(params[k]))
  return s
}
