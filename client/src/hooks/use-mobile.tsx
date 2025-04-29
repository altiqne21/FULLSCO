import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize state directly based on current window width
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false; // Default for SSR or non-browser environments
    }
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Don't run effect in non-browser environments
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", handleResize);
    // Call handler once initially in case the state needs update after initial render
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile; // Return the boolean state directly
}

