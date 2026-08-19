"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { adminService, type AdminUser } from "@/lib/admin"
import { carsService, type Car as CarModel } from "@/lib/cars"
import type { Booking } from "@/lib/bookings"
import type { Payment } from "@/lib/payments"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Car,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

/** The API stores names on the profile, so build one for display. */
function displayName(user: { firstName?: string | null; lastName?: string | null; email: string }): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
  return full || user.email
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

interface AdminStats {
  totalUsers: number
  totalCars: number
  totalBookings: number
  totalRevenue: number
  activeBookings: number
  pendingBookings: number
  availableCars: number
  rentedCars: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
    availableCars: 0,
    rentedCars: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cars, setCars] = useState<CarModel[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true)
      setError("")

      try {
        const { users, bookings, payments, cars, stats } = await adminService.getDashboard()

        setCars(cars)
        setBookings(bookings)
        setUsers(users)
        setPayments(payments)
        setStats(stats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "تعذر تحميل بيانات لوحة التحكم")
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])


  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || (statusFilter === "available") === car.isAvailable
    return matchesSearch && matchesStatus
  })

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.car?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // CRUD Functions for Cars
  const deleteCar = async (carId: string) => {
    try {
      await carsService.deleteCar(carId)
      setCars((prev) => prev.filter((car) => car.id !== carId))

      toast({
        title: "تم حذف السيارة بنجاح",
        description: "تم حذف السيارة من النظام",
      })
    } catch (error) {
      toast({
        title: "خطأ في حذف السيارة",
        description: error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  const updateCarStatus = async (carId: string, isAvailable: boolean) => {
    try {
      await carsService.updateCar(carId, { isAvailable })
      setCars((prev) => prev.map((car) => (car.id === carId ? { ...car, isAvailable } : car)))

      toast({
        title: "تم تحديث حالة السيارة",
        description: "تم تحديث حالة السيارة بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في تحديث حالة السيارة",
        description: error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  // CRUD Functions for Bookings
  const updateBookingStatus = async (
    bookingId: string,
    newStatus: "pending" | "confirmed" | "active" | "completed" | "cancelled",
  ) => {
    try {
      await adminService.setBookingStatus(bookingId, newStatus)
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking,
        ),
      )

      toast({
        title: "تم تحديث حالة الحجز",
        description: "تم تحديث حالة الحجز بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في تحديث حالة الحجز",
        description: error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  // The API has no delete for bookings — a booking is cancelled, which keeps the
  // record and frees the dates. Dropping the row would lose history a rental
  // business needs.
  const cancelBooking = async (bookingId: string) => {
    try {
      await adminService.setBookingStatus(bookingId, "cancelled")
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
        ),
      )

      toast({
        title: "تم إلغاء الحجز",
        description: "تم إلغاء الحجز وإتاحة السيارة للحجز مرة أخرى",
      })
    } catch (error) {
      toast({
        title: "خطأ في إلغاء الحجز",
        description: error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }


  if (!user || user.role !== "admin") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>ليس لديك صلاحية للوصول إلى لوحة الإدارة</AlertDescription>
            </Alert>
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
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {initials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
                  <p className="text-muted-foreground">مرحباً، {user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
                ))}
              </div>
              <div className="animate-pulse bg-muted rounded-lg h-64"></div>
            </div>
          )}

          {/* Stats Cards */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي المستخدمين</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي السيارات</p>
                        <p className="text-2xl font-bold">{stats.totalCars}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
<Car className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي الحجوزات</p>
                        <p className="text-2xl font-bold">{stats.totalBookings}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
<Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</p>
                        <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ريال</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
<TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">الحجوزات النشطة</p>
                      <p className="text-xl font-bold text-blue-600">{stats.activeBookings}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">الحجوزات المعلقة</p>
                      <p className="text-xl font-bold text-blue-600">{stats.pendingBookings}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">السيارات المتاحة</p>
                      <p className="text-xl font-bold text-blue-600">{stats.availableCars}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">السيارات المؤجرة</p>
                      <p className="text-xl font-bold text-blue-600">{stats.rentedCars}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Tabs */}
              <Tabs defaultValue="cars" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="cars">إدارة السيارات</TabsTrigger>
                  <TabsTrigger value="bookings">إدارة الحجوزات</TabsTrigger>
                  <TabsTrigger value="users">إدارة المستخدمين</TabsTrigger>
                  <TabsTrigger value="payments">المدفوعات</TabsTrigger>
                </TabsList>

                {/* Cars Management */}
                <TabsContent value="cars" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>إدارة السيارات</CardTitle>
                        <Button asChild>
                          <Link href="/admin/cars/new">
                            <Plus className="h-4 w-4 ml-2" />
                            إضافة سيارة جديدة
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <Input
                            placeholder="البحث في السيارات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="حالة السيارة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الحالات</SelectItem>
                            <SelectItem value="available">متاح</SelectItem>
                            <SelectItem value="rented">مؤجر</SelectItem>
                            <SelectItem value="maintenance">صيانة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الصورة</TableHead>
                            <TableHead>الاسم</TableHead>
                            <TableHead>الماركة</TableHead>
                            <TableHead>السعر/يوم</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCars.map((car) => {
                            return (
                              <TableRow key={car.id}>
                                <TableCell>
                                  <img
                                    src={car.images[0] || "/placeholder.svg"}
                                    alt={car.name}
                                    className="w-16 h-12 object-cover rounded"
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{car.name}</TableCell>
                                <TableCell>{car.brand}</TableCell>
                                <TableCell>{car.pricePerDay} ريال</TableCell>
                                <TableCell>
                                  <Select
                                    value={car.isAvailable ? "available" : "unavailable"}
                                    onValueChange={(value) => updateCarStatus(car.id, value === "available")}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="available">متاح</SelectItem>
                                      <SelectItem value="rented">مؤجر</SelectItem>
                                      <SelectItem value="maintenance">صيانة</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/cars/${car.id}`}>
                                        <Eye className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/admin/cars/${car.id}/edit`}>
                                        <Edit className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        if (confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
                                          deleteCar(car.id)
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Bookings Management */}
                <TabsContent value="bookings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>إدارة الحجوزات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <Input
                            placeholder="البحث في الحجوزات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="حالة الحجز" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">جميع الحالات</SelectItem>
                            <SelectItem value="pending">في الانتظار</SelectItem>
                            <SelectItem value="confirmed">مؤكد</SelectItem>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="completed">مكتمل</SelectItem>
                            <SelectItem value="cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>رقم الحجز</TableHead>
                            <TableHead>السيارة</TableHead>
                            <TableHead>المستخدم</TableHead>
                            <TableHead>التواريخ</TableHead>
                            <TableHead>المبلغ</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.map((booking) => {
                            const customer = users.find((u) => u.id === booking.userId)
                            return (
                              <TableRow key={booking.id}>
                                <TableCell className="font-medium">#{booking.id}</TableCell>
                                <TableCell>{booking.car?.name}</TableCell>
                                <TableCell>{customer ? displayName(customer) : "—"}</TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>من: {new Date(booking.startDate).toLocaleDateString("ar-SA")}</div>
                                    <div>إلى: {new Date(booking.endDate).toLocaleDateString("ar-SA")}</div>
                                  </div>
                                </TableCell>
                                <TableCell>{booking.totalAmount} ريال</TableCell>
                                <TableCell>
                                  <Select value={booking.status} onValueChange={(value: "pending" | "confirmed" | "active" | "completed" | "cancelled") => updateBookingStatus(booking.id, value)}>
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">في الانتظار</SelectItem>
                                      <SelectItem value="confirmed">مؤكد</SelectItem>
                                      <SelectItem value="active">نشط</SelectItem>
                                      <SelectItem value="completed">مكتمل</SelectItem>
                                      <SelectItem value="cancelled">ملغي</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link href={`/bookings/${booking.id}`}>
                                        <Eye className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        if (confirm("هل أنت متأكد من حذف هذا الحجز؟")) {
                                          cancelBooking(booking.id)
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Users Management */}
                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>إدارة المستخدمين</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>المستخدم</TableHead>
                            <TableHead>البريد الإلكتروني</TableHead>
                            <TableHead>الهاتف</TableHead>
                            <TableHead>الدور</TableHead>
                            <TableHead>تاريخ التسجيل</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>
                                      {initials(displayName(user))}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{displayName(user)}</span>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.isActive ? "نشط" : "معطّل"}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                  {user.role === "admin" ? "مدير" : "مستخدم"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Payments Management */}
                <TabsContent value="payments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>إدارة المدفوعات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>رقم العملية</TableHead>
                            <TableHead>رقم الحجز</TableHead>
                            <TableHead>المبلغ</TableHead>
                            <TableHead>طريقة الدفع</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium">#{payment.transactionId || payment.id}</TableCell>
                              <TableCell>#{payment.bookingId}</TableCell>
                              <TableCell>{payment.amount} ريال</TableCell>
                              <TableCell>
                                {payment.method === "credit_card" ? "بطاقة ائتمان" : 
                                 payment.method === "debit_card" ? "بطاقة مدى" :
                                 payment.method === "paypal" ? "باي بال" :
                                 payment.method === "bank_transfer" ? "تحويل بنكي" : "أخرى"}
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  payment.status === "completed" ? "default" :
                                  payment.status === "pending" ? "secondary" :
                                  payment.status === "failed" ? "destructive" : "outline"
                                }>
                                  {payment.status === "completed" ? "مكتمل" :
                                   payment.status === "pending" ? "في الانتظار" :
                                   payment.status === "failed" ? "فشل" : "مسترد"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(payment.createdAt).toLocaleDateString("ar-SA")}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
