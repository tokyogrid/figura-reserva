// Animation variants for Framer Motion-like animations using pure CSS
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
}

export const fadeInUp = {
  animation: "slideUp 0.4s ease-out forwards",
  opacity: 0,
}

export const fadeInDown = {
  animation: "slideDown 0.4s ease-out forwards",
  opacity: 0,
}

export const slideInLeft = {
  animation: "slideUp 0.4s ease-out forwards",
  opacity: 0,
  transform: "translateX(-30px)",
}

export const slideInRight = {
  animation: "slideUp 0.4s ease-out forwards",
  opacity: 0,
  transform: "translateX(30px)",
}

export const scaleIn = {
  animation: "scaleIn 0.3s ease-out forwards",
  opacity: 0,
  transform: "scale(0.95)",
}

export const staggerContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "1.5rem",
}

export const staggerItem = {
  animation: "slideUp 0.4s ease-out both",
}

// CSS keyframes for custom animations
export const keyframes = {
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  slideDown: `
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `,
}

// CSS class names for animations
export const animationClasses = {
  // Page transitions
  pageEnter: "animate-[slideUp_0.4s_ease-out]",
  pageExit: "animate-[slideDown_0.3s_ease-in]",
  
  // Card animations
  cardHover: "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
  cardHoverScale: "transition-all duration-300 hover:scale-102 hover:shadow-xl",
  
  // Button animations
  btnHover: "transition-all duration-200 hover:scale-105 active:scale-95",
  btnLoading: "animate-pulse relative overflow-hidden",
  
  // List animations
  staggerChildren: "animate-[slideUp_0.4s_ease-out]",
  staggerDelay: (index: number) => `animation-delay: ${index * 100}ms`,
  
  // Skeleton loading
  skeleton: "animate-pulse bg-gray-200 dark:bg-gray-700",
  
  // Fade in/out
  fadeIn: "animate-[fadeIn_0.3s_ease-out]",
  fadeOut: "animate-[fadeOut_0.3s_ease-in]",
  
  // Shimmer effect for loading states
  shimmer: "relative overflow-hidden bg-gray-200 dark:bg-gray-700 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-[shimmer_2s_infinite]",
  
  // Floating animation
  float: "animate-[float_3s_ease-in-out_infinite]",
  
  // Bounce
  bounce: "animate-[bounce_1s_ease-in-out_infinite]",
  
  // Spin
  spin: "animate-[spin_1s_linear_infinite]",
}

// Stagger delay utility
export const getStaggerDelay = (index: number, baseDelay = 100) => {
  return {
    style: { animationDelay: `${index * baseDelay}ms` } as React.CSSProperties,
  }
}

// Page transition wrapper component styles
export const pageTransitionStyles = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
}

// Card entrance animation
export const cardEntrance = {
  animation: "slideUp 0.5s ease-out forwards",
  opacity: 0,
}

