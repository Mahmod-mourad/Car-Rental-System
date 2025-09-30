"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Phone, Calendar, Shield, Edit, Save, X } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // In a real app, you would have an update profile endpoint
      // For now, we'll simulate the update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("تم تحديث الملف الشخصي بنجاح")
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحديث الملف الشخصي")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setError("")
    setSuccess("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("كلمات المرور الجديدة غير متطابقة")
      setChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل")
      setChangingPassword(false)
      return
    }

    try {
      // In a real app, you would have a change password endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("تم تغيير كلمة المرور بنجاح")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تغيير كلمة المرور")
    } finally {
      setChangingPassword(false)
    }
  }

  const cancelEdit = () => {
    setEditing(false)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    })
    setError("")
    setSuccess("")
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="bg-muted rounded-lg h-32"></div>
              <div className="bg-muted rounded-lg h-64"></div>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">الملف الشخصي</h1>
              <p className="text-muted-foreground">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <Alert className="mb-6 border-blue-200 bg-blue-50">
<AlertDescription className="text-blue-800">{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarFallback className="text-2xl">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h2 className="text-xl font-semibold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>عضو منذ {new Date(user.createdAt).toLocaleDateString("ar-SA")}</span>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {user.role === "admin" ? "مدير" : user.role === "staff" ? "موظف" : "عضو"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    {!editing ? (
                      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={cancelEdit}>
                          <X className="h-4 w-4 ml-2" />
                          إلغاء
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">الاسم الكامل</Label>
                          <div className="relative">
                            <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="pr-10"
                              disabled={!editing}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pr-10"
                              disabled={!editing}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pr-10"
                            disabled={!editing}
                          />
                        </div>
                      </div>

                      {editing && (
                        <Button type="submit" disabled={loading}>
                          <Save className="h-4 w-4 ml-2" />
                          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>

                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle>تغيير كلمة المرور</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={changingPassword}>
                        {changingPassword ? "جاري التغيير..." : "تغيير كلمة المرور"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>إعدادات الحساب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-destructive">تسجيل الخروج</h3>
                        <p className="text-sm text-muted-foreground">تسجيل الخروج من جميع الأجهزة</p>
                      </div>
                      <Button variant="destructive" onClick={logout}>
                        تسجيل الخروج
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
