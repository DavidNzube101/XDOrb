"use client"

import { type ReactNode, useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Footer } from "./footer"
import { Badge } from "./ui/badge"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [bookmarkCount, setBookmarkCount] = useState(0)

  useEffect(() => {
    const updateBookmarkCount = () => {
      const saved = localStorage.getItem('bookmarked-pnodes')
      if (saved) {
        const bookmarks = JSON.parse(saved)
        setBookmarkCount(bookmarks.length)
      } else {
        setBookmarkCount(0)
      }
    }

    updateBookmarkCount()
    // Listen for storage changes
    window.addEventListener('storage', updateBookmarkCount)
    return () => window.removeEventListener('storage', updateBookmarkCount)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
         <div className="p-6 border-b border-border">
           <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
             XDOrb
           </h1>
         </div>

        <nav className="flex-1 p-4 space-y-2">
           {[
             { label: "Dashboard", href: "/", icon: "📊" },
             { label: "pNodes", href: "/pnodes", icon: "⚙️" },
             { label: "Bookmarks", href: "/bookmarks", icon: "🔖", badge: bookmarkCount },
             { label: "Leaderboard", href: "/leaderboard", icon: "🏆" },
             { label: "Network", href: "/network", icon: "🌐" },
             { label: "Analytics", href: "/analytics", icon: "📈" },
             { label: "About", href: "/about", icon: "ℹ️" },
           ].map((item) => (
             <a
               key={item.href}
               href={item.href}
               className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground hover:text-primary ${
                 sidebarOpen ? "" : "justify-center"
               }`}
               title={!sidebarOpen ? item.label : undefined}
               aria-label={item.label}
             >
              <span>{item.icon}</span>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </a>
          ))}
        </nav>


      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
           <button
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="p-2 hover:bg-muted rounded-lg transition-colors"
             aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
           >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
