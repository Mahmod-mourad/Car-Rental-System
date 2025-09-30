"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { authService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Car, ArrowRight } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await authService.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء إرسال رابط إعادة التعيين")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
<Mail className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">تم إرسال الرابط</CardTitle>
              <CardDescription>تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور
              </p>
              <Button asChild className="w-full">
                <Link href="/login">
                  <ArrowRight className="h-4 w-4 ml-2" />
                  العودة لتسجيل الدخول
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl">
              <Car className="h-8 w-8" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-primary">تأجير السيارات</span>
              <span className="text-sm text-muted-foreground">Car Rental</span>
            </div>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">نسيت كلمة المرور؟</CardTitle>
            <CardDescription>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
              >
                <ArrowRight className="h-4 w-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
