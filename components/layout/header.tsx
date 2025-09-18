"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Menu,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  LogOut,
  Settings,
  BookOpen,
  Bell,
  LayoutDashboard,
} from "lucide-react"
import { notificationsService } from "@/lib/notifications"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, logout, isAuthenticated } = useAuth()

  const navigation = [
    { name: "الرئيسية", href: "/" },
    { name: "السيارات", href: "/cars" },
    { name: "حجوزاتي", href: "/bookings" },
    { name: "من نحن", href: "/about" },
    { name: "اتصل بنا", href: "/contact" },
  ]

  useEffect(() => {
    const loadNotificationCount = async () => {
      if (isAuthenticated) {
        try {
          const notifications = await notificationsService.getNotifications()
          setUnreadCount(notifications.filter((n) => !n.isRead).length)
        } catch (error) {
          console.error("Failed to load notifications:", error)
        }
      }
    }

    loadNotificationCount()
  }, [isAuthenticated])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      // Log the error but don't show it to user since logout should always work
      console.log("Logout completed:", error)
    }
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>info@carrental.sa</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>الرياض، المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Car className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary">تأجير السيارات</span>
              <span className="text-xs text-muted-foreground">Car Rental</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Added notifications button */}
                <Button variant="ghost" size="sm" asChild className="relative">
                  <Link href="/notifications">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {/* Added dashboard menu item */}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        لوحة التحكم
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        الملف الشخصي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        حجوزاتي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/demo-login">
                    <User className="h-4 w-4 ml-2" />
                    تجريبي
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <User className="h-4 w-4 ml-2" />
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">التسجيل</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      لوحة التحكم
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      الملف الشخصي
                    </Link>
                    <Link
                      href="/bookings"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BookOpen className="h-4 w-4" />
                      حجوزاتي
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors font-medium py-2"
                    >
                      <LogOut className="h-4 w-4" />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/demo-login"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      تسجيل دخول تجريبي
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      التسجيل
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
