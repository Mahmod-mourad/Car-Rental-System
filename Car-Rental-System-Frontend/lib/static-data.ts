// Static data for development and demo purposes
export interface StaticCar {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: string
  categoryId: string
  pricePerDay: number
  description: string
  features: string[]
  images: string[]
  transmission: "manual" | "automatic"
  fuelType: "petrol" | "diesel" | "electric" | "hybrid"
  seats: number
  doors: number
  airConditioning: boolean
  status: "available" | "rented" | "maintenance"
  rating: number
  reviewsCount: number
  location: string
  mileage: number
  createdAt: string
  updatedAt: string
}

export interface StaticBooking {
  id: string
  userId: string
  carId: string
  car?: StaticCar
  startDate: string
  endDate: string
  totalDays: number
  totalAmount: number
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  pickupLocation: string
  returnLocation: string
  createdAt: string
  updatedAt: string
}

export interface StaticPayment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  method: "credit_card" | "debit_card" | "cash" | "bank_transfer"
  transactionId?: string
  createdAt: string
}

export interface StaticNotification {
  id: string
  userId: string
  title: string
  message: string
  type: "booking" | "payment" | "maintenance" | "general"
  isRead: boolean
  createdAt: string
}

export interface StaticUser {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  avatar?: string
  createdAt: string
}

// Static Cars Data
export const staticCars: StaticCar[] = [
  {
    id: "1",
    name: "تويوتا كامري 2024",
    brand: "تويوتا",
    model: "كامري",
    year: 2024,
    category: "سيدان",
    categoryId: "sedan",
    pricePerDay: 150,
    description: "سيارة سيدان فاخرة مع تقنيات حديثة وراحة عالية",
    features: ["أوتوماتيك", "5 مقاعد", "بنزين", "مكيف", "GPS", "Bluetooth"],
    images: ["/toyota-camry-2024-silver.png"],
    transmission: "automatic",
    fuelType: "petrol",
    seats: 5,
    doors: 4,
    airConditioning: true,
    status: "available",
    rating: 4.8,
    reviewsCount: 45,
    location: "الرياض",
    mileage: 15000,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "هيونداي إلنترا 2024",
    brand: "هيونداي",
    model: "إلنترا",
    year: 2024,
    category: "سيدان",
    categoryId: "sedan",
    pricePerDay: 120,
    description: "سيارة اقتصادية مع تصميم عصري وأداء ممتاز",
    features: ["أوتوماتيك", "5 مقاعد", "بنزين", "مكيف", "USB"],
    images: ["/hyundai-elantra-2024-white.png"],
    transmission: "automatic",
    fuelType: "petrol",
    seats: 5,
    doors: 4,
    airConditioning: true,
    status: "available",
    rating: 4.6,
    reviewsCount: 32,
    location: "جدة",
    mileage: 12000,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    name: "نيسان التيما 2024",
    brand: "نيسان",
    model: "التيما",
    year: 2024,
    category: "سيدان",
    categoryId: "sedan",
    pricePerDay: 140,
    description: "سيارة عائلية مريحة مع مساحة داخلية واسعة",
    features: ["أوتوماتيك", "5 مقاعد", "بنزين", "مكيف", "كاميرا خلفية"],
    images: ["/nissan-altima-2024-black.png"],
    transmission: "automatic",
    fuelType: "petrol",
    seats: 5,
    doors: 4,
    airConditioning: true,
    status: "available",
    rating: 4.7,
    reviewsCount: 28,
    location: "الدمام",
    mileage: 18000,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "4",
    name: "هوندا سيفيك 2024",
    brand: "هوندا",
    model: "سيفيك",
    year: 2024,
    category: "سيدان",
    categoryId: "sedan",
    pricePerDay: 130,
    description: "سيارة رياضية مع أداء عالي وتصميم جذاب",
    features: ["أوتوماتيك", "5 مقاعد", "بنزين", "مكيف", "نظام صوتي"],
    images: ["/placeholder.svg"],
    transmission: "automatic",
    fuelType: "petrol",
    seats: 5,
    doors: 4,
    airConditioning: true,
    status: "rented",
    rating: 4.5,
    reviewsCount: 22,
    location: "الرياض",
    mileage: 22000,
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "5",
    name: "فورد إكسبلورر 2024",
    brand: "فورد",
    model: "إكسبلورر",
    year: 2024,
    category: "SUV",
    categoryId: "suv",
    pricePerDay: 200,
    description: "سيارة SUV فاخرة مناسبة للعائلة والرحلات",
    features: ["أوتوماتيك", "7 مقاعد", "بنزين", "مكيف", "دفع رباعي"],
    images: ["/placeholder.svg"],
    transmission: "automatic",
    fuelType: "petrol",
    seats: 7,
    doors: 5,
    airConditioning: true,
    status: "available",
    rating: 4.9,
    reviewsCount: 18,
    location: "جدة",
    mileage: 8000,
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "6",
    name: "شيفروليه كمارو 2024",
    brand: "شيفروليه",
    model: "كامارو",
    year: 2024,
    category: "رياضية",
    categoryId: "sports",
    pricePerDay: 300,
    description: "سيارة رياضية قوية مع محرك V8 وأداء استثنائي",
    features: ["أوتوماتيك", "4 مقاعد", "بنزين", "مكيف", "نظام صوتي فاخر"],
    images: ["/placeholder.svg"],
    transmission: "automatic",
    fuelType: "petrol",
    seats: 4,
    doors: 2,
    airConditioning: true,
    status: "maintenance",
    rating: 4.7,
    reviewsCount: 15,
    location: "الرياض",
    mileage: 5000,
    createdAt: "2024-01-30T10:00:00Z",
    updatedAt: "2024-01-30T10:00:00Z",
  },
]

// Static Bookings Data
export const staticBookings: StaticBooking[] = [
  {
    id: "1",
    userId: "user1",
    carId: "1",
    car: staticCars[0],
    startDate: "2024-02-15",
    endDate: "2024-02-18",
    totalDays: 3,
    totalAmount: 450,
    status: "completed",
    paymentStatus: "paid",
    pickupLocation: "مطار الملك خالد الدولي",
    returnLocation: "مطار الملك خالد الدولي",
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-18T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    carId: "2",
    car: staticCars[1],
    startDate: "2024-02-25",
    endDate: "2024-02-28",
    totalDays: 3,
    totalAmount: 360,
    status: "confirmed",
    paymentStatus: "paid",
    pickupLocation: "مطار الملك عبدالعزيز الدولي",
    returnLocation: "مطار الملك عبدالعزيز الدولي",
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "3",
    userId: "user1",
    carId: "5",
    car: staticCars[4],
    startDate: "2024-03-05",
    endDate: "2024-03-10",
    totalDays: 5,
    totalAmount: 1000,
    status: "pending",
    paymentStatus: "pending",
    pickupLocation: "مطار الملك فهد الدولي",
    returnLocation: "مطار الملك فهد الدولي",
    createdAt: "2024-02-28T10:00:00Z",
    updatedAt: "2024-02-28T10:00:00Z",
  },
]

// Static Payments Data
export const staticPayments: StaticPayment[] = [
  {
    id: "1",
    bookingId: "1",
    amount: 450,
    currency: "SAR",
    status: "completed",
    method: "credit_card",
    transactionId: "TXN123456",
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "2",
    bookingId: "2",
    amount: 360,
    currency: "SAR",
    status: "completed",
    method: "credit_card",
    transactionId: "TXN123457",
    createdAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "3",
    bookingId: "3",
    amount: 1000,
    currency: "SAR",
    status: "pending",
    method: "credit_card",
    createdAt: "2024-02-28T10:00:00Z",
  },
]

// Static Notifications Data
export const staticNotifications: StaticNotification[] = [
  {
    id: "1",
    userId: "user1",
    title: "تم تأكيد حجزك",
    message: "تم تأكيد حجز سيارة تويوتا كامري 2024 للفترة من 15-18 فبراير",
    type: "booking",
    isRead: false,
    createdAt: "2024-02-10T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    title: "تم إتمام الدفع",
    message: "تم إتمام عملية الدفع بنجاح بمبلغ 450 ريال",
    type: "payment",
    isRead: false,
    createdAt: "2024-02-10T10:30:00Z",
  },
  {
    id: "3",
    userId: "user1",
    title: "تذكير بالحجز",
    message: "تذكير: حجزك لسيارة هيونداي إلنترا غداً في الساعة 10:00 صباحاً",
    type: "booking",
    isRead: true,
    createdAt: "2024-02-24T10:00:00Z",
  },
  {
    id: "4",
    userId: "user1",
    title: "عرض خاص",
    message: "احصل على خصم 20% على حجوزات نهاية الأسبوع",
    type: "general",
    isRead: true,
    createdAt: "2024-02-25T10:00:00Z",
  },
  {
    id: "5",
    userId: "user1",
    title: "تقييم الحجز",
    message: "يرجى تقييم تجربتك مع سيارة تويوتا كامري",
    type: "general",
    isRead: true,
    createdAt: "2024-02-19T10:00:00Z",
  },
]

// Static User Data
export const staticUsers: StaticUser[] = [
  {
    id: "user1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    role: "user",
    avatar: "/placeholder-user.jpg",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "admin1",
    name: "مدير النظام",
    email: "admin@example.com",
    phone: "+966501234568",
    role: "admin",
    avatar: "/placeholder-user.jpg",
    createdAt: "2024-01-01T10:00:00Z",
  },
]

// Helper functions for filtering and searching
export const filterCars = (cars: StaticCar[], filters: any) => {
  return cars.filter((car) => {
    if (filters.category && car.category !== filters.category) return false
    if (filters.brand && car.brand !== filters.brand) return false
    if (filters.minPrice && car.pricePerDay < filters.minPrice) return false
    if (filters.maxPrice && car.pricePerDay > filters.maxPrice) return false
    if (filters.transmission && car.transmission !== filters.transmission) return false
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false
    if (filters.seats && car.seats < filters.seats) return false
    if (filters.location && car.location !== filters.location) return false
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      if (!car.name.toLowerCase().includes(searchTerm) && 
          !car.brand.toLowerCase().includes(searchTerm) &&
          !car.model.toLowerCase().includes(searchTerm)) {
        return false
      }
    }
    return true
  })
}

export const getCarById = (id: string) => {
  return staticCars.find(car => car.id === id)
}

export const getBookingsByUserId = (userId: string) => {
  return staticBookings.filter(booking => booking.userId === userId)
}

export const getPaymentsByUserId = (userId: string) => {
  const userBookings = getBookingsByUserId(userId)
  const bookingIds = userBookings.map(booking => booking.id)
  return staticPayments.filter(payment => bookingIds.includes(payment.bookingId))
}

export const getNotificationsByUserId = (userId: string) => {
  return staticNotifications.filter(notification => notification.userId === userId)
}
