
import * as React from "react"

// Define the Capacitor interface to avoid TypeScript errors
interface CapacitorGlobal {
  isNativePlatform?: boolean;
}

// Extend the Window interface to include Capacitor
declare global {
  interface Window {
    Capacitor?: CapacitorGlobal;
  }
}

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsNativeApp() {
  const [isNativeApp, setIsNativeApp] = React.useState(false)
  
  React.useEffect(() => {
    // Check if running in Capacitor native container
    const isCapacitor = window.location.href.includes('capacitor://') || 
                       (window.Capacitor && window.Capacitor.isNativePlatform) ||
                       document.URL.includes('capacitor://');
                       
    setIsNativeApp(!!isCapacitor)
  }, [])
  
  return isNativeApp
}
