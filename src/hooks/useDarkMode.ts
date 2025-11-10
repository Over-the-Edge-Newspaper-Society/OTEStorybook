import { useState, useEffect } from 'react'

/**
 * Hook to detect if the calendar component is in dark mode
 * Useful for components rendered in Portals that don't inherit the parent's .dark class
 */
export function useDarkMode() {
  const getInitialDarkMode = () => {
    const calendarEl = document.getElementById('unbc-calendar-react-component')
    return calendarEl?.classList.contains('dark') ?? false
  }

  const [isDark, setIsDark] = useState(getInitialDarkMode)

  useEffect(() => {
    const checkDarkMode = () => {
      const calendarEl = document.getElementById('unbc-calendar-react-component')
      setIsDark(calendarEl?.classList.contains('dark') ?? false)
    }

    const observer = new MutationObserver(checkDarkMode)
    const calendarEl = document.getElementById('unbc-calendar-react-component')
    if (calendarEl) {
      observer.observe(calendarEl, { attributes: true, attributeFilter: ['class'] })
    }

    return () => observer.disconnect()
  }, [])

  return isDark
}
