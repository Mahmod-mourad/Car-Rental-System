"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, ArrowRight, Home } from "lucide-react"

export default function DemoLoginPage() {
  const { demoLogin } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleDemoLogin = async (role: "user" | "admin") => {
    setLoading(role)
    setError("")

    try {
      await demoLogin(role)
      // Redirect based on role
      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">تسجيل الدخول التجريبي</h1>
            <p className="text-muted-foreground">
              اختر نوع الحساب الذي تريد تسجيل الدخول به للاختبار
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Demo Login Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* User Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>حساب المستخدم</CardTitle>
                <p className="text-sm text-muted-foreground">
                  تسجيل الدخول كعميل عادي
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span>أحمد محمد</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">البريد الإلكتروني:</span>
                    <span>ahmed@example.com</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الدور:</span>
                    <Badge variant="secondary">مستخدم</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">الميزات المتاحة:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• تصفح السيارات المتاحة</li>
                    <li>• حجز السيارات</li>
                    <li>• إدارة الحجوزات الشخصية</li>
                    <li>• عرض المدفوعات</li>
                    <li>• استقبال الإشعارات</li>
                  </ul>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("user")}
                  disabled={loading !== null}
                >
                  {loading === "user" ? "جاري تسجيل الدخول..." : "تسجيل الدخول كمستخدم"}
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Admin Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
<Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>حساب المدير</CardTitle>
                <p className="text-sm text-muted-foreground">
                  تسجيل الدخول كمدير النظام
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span>مدير النظام</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">البريد الإلكتروني:</span>
                    <span>admin@example.com</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الدور:</span>
                    <Badge variant="default">مدير</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">الميزات المتاحة:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• إدارة جميع السيارات</li>
                    <li>• مراقبة الحجوزات</li>
                    <li>• إدارة المستخدمين</li>
                    <li>• تتبع المدفوعات</li>
                    <li>• عرض الإحصائيات</li>
                  </ul>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleDemoLogin("admin")}
                  disabled={loading !== null}
                >
                  {loading === "admin" ? "جاري تسجيل الدخول..." : "تسجيل الدخول كمدير"}
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات مهمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">حول هذا الموقع:</h4>
                  <p className="text-sm text-muted-foreground">
                    هذا موقع تجريبي لتأجير السيارات مبني باستخدام Next.js و Tailwind CSS. 
                    جميع البيانات معدة مسبقاً للعرض والاختبار.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">الميزات المتوفرة:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• واجهة مستخدم عربية كاملة</li>
                    <li>• لوحة تحكم للمستخدمين</li>
                    <li>• لوحة إدارة شاملة</li>
                    <li>• نظام حجز متكامل</li>
                    <li>• إدارة المدفوعات</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">
                    <Home className="h-4 w-4 ml-2" />
                    العودة للصفحة الرئيسية
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/cars">
                    <ArrowRight className="h-4 w-4 ml-2" />
                    تصفح السيارات
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
