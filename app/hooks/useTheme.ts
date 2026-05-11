import { useState, useEffect } from "react"

export function useTheme() {
  const [isDark, setIsDark] = useState(true)

  const updateTheme = (newIsDark: boolean) => {
    const newTheme = newIsDark ? "dark" : "light"
    setIsDark(newIsDark)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    window.dispatchEvent(new Event("themechange"))
  }

  const toggleTheme = () => {
    updateTheme(!isDark)
  }

  useEffect(() => {
    // Sync with localStorage on mount
    const saved = (localStorage.getItem("theme") || "dark") === "dark"
    setIsDark(saved)

    const handler = () => {
      setIsDark((localStorage.getItem("theme") || "dark") === "dark")
    }
    window.addEventListener("themechange", handler)
    return () => window.removeEventListener("themechange", handler)
  }, [])

  return { isDark, toggleTheme }
}
