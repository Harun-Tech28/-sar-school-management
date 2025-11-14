/**
 * School branding and logo utilities
 */

export interface SchoolBranding {
  name: string
  address: string
  phone: string
  email: string
  website?: string
  logo?: string // Base64 encoded image or URL
  logoTransparent?: string // Transparent version for PDFs
}

export const DEFAULT_SCHOOL_BRANDING: SchoolBranding = {
  name: 'SAR Educational Complex',
  address: 'Box 130, Sepe Sote, Hospital Junction, Kumasi',
  phone: '+233 24 000 0000',
  email: 'info@sar.edu',
  website: 'www.sar.edu',
  // Default transparent logo (Base64 encoded PNG)
  // This is a placeholder - replace with actual school logo
  logoTransparent: '/logo-transparent.png',
}

/**
 * Get school branding information
 * In production, this would fetch from database/settings
 */
export async function getSchoolBranding(): Promise<SchoolBranding> {
  // TODO: Fetch from database settings
  return DEFAULT_SCHOOL_BRANDING
}

/**
 * Convert image URL to Base64 for PDF embedding
 */
export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error converting image to Base64:', error)
    throw error
  }
}

/**
 * Get logo for PDF documents (Base64 encoded)
 */
export async function getLogoForPDF(): Promise<string | undefined> {
  const branding = await getSchoolBranding()
  
  if (!branding.logoTransparent) {
    return undefined
  }
  
  // If it's already Base64, return it
  if (branding.logoTransparent.startsWith('data:')) {
    return branding.logoTransparent
  }
  
  // If it's a URL, convert to Base64
  try {
    return await imageUrlToBase64(branding.logoTransparent)
  } catch (error) {
    console.error('Failed to load logo for PDF:', error)
    return undefined
  }
}

/**
 * Create a simple SVG logo as fallback
 * This creates a circular logo with school initials
 */
export function createFallbackLogo(initials: string = 'SAR'): string {
  const svg = `
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="#E31E24" opacity="0.9"/>
      <text x="60" y="75" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            fill="white" text-anchor="middle">${initials}</text>
    </svg>
  `
  
  // Convert SVG to Base64
  const base64 = btoa(svg)
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Format school header for documents
 */
export function formatSchoolHeader(branding: SchoolBranding): string {
  return `
${branding.name}
${branding.address}
Tel: ${branding.phone} | Email: ${branding.email}
${branding.website ? `Website: ${branding.website}` : ''}
  `.trim()
}
