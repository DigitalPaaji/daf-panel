"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaSun ,FaMoon  } from "react-icons/fa";


export default function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-md border
      border-gray-300 dark:border-gray-700
      hover:bg-gray-100 dark:hover:bg-gray-800
      transition"
    >
      {theme === "dark" ? (
        <FaSun className="h-5 w-5" />
      ) : (
        <FaMoon className="h-5 w-5" />
      )}
    </button>
  )
}
