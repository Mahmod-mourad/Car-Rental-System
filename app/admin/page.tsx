"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
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
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { 
  staticCars, 
  staticBookings, 
  staticPayments, 
  staticNotifications, 
  staticUsers,
  type StaticCar,
  type StaticBooking,
  type StaticPayment,
  type StaticNotification,
  type StaticUser
} from "@/lib/static-data"
import {
  getCarsFromStorage,
  getBookingsFromStorage,
  getUsersFromStorage,
  getPaymentsFromStorage,
  saveCarsToStorage,
  saveBookingsToStorage,
  updateCarInStorage,
  updateBookingInStorage,
  deleteCarFromStorage,
  deleteBookingFromStorage,
  initializeLocalStorage,
  clearAllData
} from "@/lib/local-storage"

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
  const [cars, setCars] = useState<StaticCar[]>([])
  const [bookings, setBookings] = useState<StaticBooking[]>([])
  const [users, setUsers] = useState<StaticUser[]>([])
  const [payments, setPayments] = useState<StaticPayment[]>([])

  useEffect(() => {
    const loadAdminData = () => {
      setLoading(true)
      setError("")

      try {
        // Initialize localStorage if needed
        initializeLocalStorage()
        
        // Load data from localStorage
        const carsData = getCarsFromStorage()
        const bookingsData = getBookingsFromStorage()
        const usersData = getUsersFromStorage()
        const paymentsData = getPaymentsFromStorage()
        
        setCars(carsData)
        setBookings(bookingsData)
        setUsers(usersData)
        setPayments(paymentsData)

        // Calculate stats
        const totalUsers = usersData.length
        const totalCars = carsData.length
        const totalBookings = bookingsData.length
        const totalRevenue = paymentsData
          .filter(p => p.status === "completed")
          .reduce((sum, p) => sum + p.amount, 0)
        const activeBookings = bookingsData.filter(b => b.status === "confirmed" || b.status === "active").length
        const pendingBookings = bookingsData.filter(b => b.status === "pending").length
        const availableCars = carsData.filter(c => c.status === "available").length
        const rentedCars = carsData.filter(c => c.status === "rented").length

        setStats({
          totalUsers,
          totalCars,
          totalBookings,
          totalRevenue,
          activeBookings,
          pendingBookings,
          availableCars,
          rentedCars,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب البيانات")
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: "في الانتظار", variant: "secondary" as const },
      confirmed: { text: "مؤكد", variant: "default" as const },
      active: { text: "نشط", variant: "default" as const },
      completed: { text: "مكتمل", variant: "outline" as const },
      cancelled: { text: "ملغي", variant: "destructive" as const },
      available: { text: "متاح", variant: "default" as const },
      rented: { text: "مؤجر", variant: "secondary" as const },
      maintenance: { text: "صيانة", variant: "destructive" as const },
    }
    return statusConfig[status as keyof typeof statusConfig] || { text: status, variant: "secondary" as const }
  }

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || car.status === statusFilter
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update localStorage
      deleteCarFromStorage(carId)
      
      // Update state
      setCars(prev => prev.filter(car => car.id !== carId))
      
      toast({
        title: "تم حذف السيارة بنجاح",
        description: "تم حذف السيارة من النظام",
      })
    } catch (error) {
      toast({
        title: "خطأ في حذف السيارة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  const updateCarStatus = async (carId: string, newStatus: "available" | "rented" | "maintenance") => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update localStorage
      updateCarInStorage(carId, { status: newStatus })
      
      // Update state
      setCars(prev => prev.map(car => 
        car.id === carId ? { ...car, status: newStatus } : car
      ))
      
      toast({
        title: "تم تحديث حالة السيارة",
        description: "تم تحديث حالة السيارة بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في تحديث حالة السيارة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  // CRUD Functions for Bookings
  const updateBookingStatus = async (bookingId: string, newStatus: "pending" | "confirmed" | "active" | "completed" | "cancelled") => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update localStorage
      updateBookingInStorage(bookingId, { status: newStatus })
      
      // Update state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ))
      
      toast({
        title: "تم تحديث حالة الحجز",
        description: "تم تحديث حالة الحجز بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في تحديث حالة الحجز",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  const deleteBooking = async (bookingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update localStorage
      deleteBookingFromStorage(bookingId)
      
      // Update state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId))
      
      toast({
        title: "تم حذف الحجز بنجاح",
        description: "تم حذف الحجز من النظام",
      })
    } catch (error) {
      toast({
        title: "خطأ في حذف الحجز",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    }
  }

  const resetData = () => {
    if (confirm("هل أنت متأكد من إعادة تعيين جميع البيانات؟ سيتم حذف جميع التغييرات.")) {
      clearAllData()
      window.location.reload()
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
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
                  <p className="text-muted-foreground">مرحباً، {user.name}</p>
                </div>
              </div>
              <Button variant="outline" onClick={resetData}>
                إعادة تعيين البيانات
              </Button>
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
                            const statusBadge = getStatusBadge(car.status)
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
                                  <Select value={car.status} onValueChange={(value: "available" | "rented" | "maintenance") => updateCarStatus(car.id, value)}>
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
                            const statusBadge = getStatusBadge(booking.status)
                            return (
                              <TableRow key={booking.id}>
                                <TableCell className="font-medium">#{booking.id}</TableCell>
                                <TableCell>{booking.car?.name}</TableCell>
                                <TableCell>أحمد محمد</TableCell>
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
                                          deleteBooking(booking.id)
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
                                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{user.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.phone}</TableCell>
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
                                 payment.method === "cash" ? "نقداً" : "تحويل بنكي"}
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
