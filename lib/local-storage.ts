// Local Storage utilities for data persistence
import { type StaticCar, type StaticBooking, type StaticPayment, type StaticUser, type StaticNotification } from "./static-data"

const STORAGE_KEYS = {
  CARS: "car_rental_cars",
  BOOKINGS: "car_rental_bookings", 
  USERS: "car_rental_users",
  PAYMENTS: "car_rental_payments",
  NOTIFICATIONS: "car_rental_notifications"
}

// Initialize localStorage with static data if empty
export const initializeLocalStorage = () => {
  if (typeof window === "undefined") return

  // Initialize cars
  if (!localStorage.getItem(STORAGE_KEYS.CARS)) {
    const { staticCars } = require("./static-data")
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(staticCars))
  }

  // Initialize bookings
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    const { staticBookings } = require("./static-data")
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(staticBookings))
  }

  // Initialize users
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const { staticUsers } = require("./static-data")
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(staticUsers))
  }

  // Initialize payments
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    const { staticPayments } = require("./static-data")
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(staticPayments))
  }

  // Initialize notifications
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    const { staticNotifications } = require("./static-data")
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(staticNotifications))
  }
}

// Cars operations
export const getCarsFromStorage = (): StaticCar[] => {
  if (typeof window === "undefined") return []
  try {
    const cars = localStorage.getItem(STORAGE_KEYS.CARS)
    return cars ? JSON.parse(cars) : []
  } catch (error) {
    console.error("Error reading cars from localStorage:", error)
    return []
  }
}

export const saveCarsToStorage = (cars: StaticCar[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars))
  } catch (error) {
    console.error("Error saving cars to localStorage:", error)
  }
}

export const addCarToStorage = (car: StaticCar) => {
  const cars = getCarsFromStorage()
  cars.push(car)
  saveCarsToStorage(cars)
}

export const updateCarInStorage = (carId: string, updatedCar: Partial<StaticCar>) => {
  const cars = getCarsFromStorage()
  const index = cars.findIndex(car => car.id === carId)
  if (index !== -1) {
    cars[index] = { ...cars[index], ...updatedCar }
    saveCarsToStorage(cars)
  }
}

export const deleteCarFromStorage = (carId: string) => {
  const cars = getCarsFromStorage()
  const filteredCars = cars.filter(car => car.id !== carId)
  saveCarsToStorage(filteredCars)
}

// Bookings operations
export const getBookingsFromStorage = (): StaticBooking[] => {
  if (typeof window === "undefined") return []
  try {
    const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    return bookings ? JSON.parse(bookings) : []
  } catch (error) {
    console.error("Error reading bookings from localStorage:", error)
    return []
  }
}

export const saveBookingsToStorage = (bookings: StaticBooking[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  } catch (error) {
    console.error("Error saving bookings to localStorage:", error)
  }
}

export const addBookingToStorage = (booking: StaticBooking) => {
  const bookings = getBookingsFromStorage()
  bookings.push(booking)
  saveBookingsToStorage(bookings)
}

export const updateBookingInStorage = (bookingId: string, updatedBooking: Partial<StaticBooking>) => {
  const bookings = getBookingsFromStorage()
  const index = bookings.findIndex(booking => booking.id === bookingId)
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updatedBooking }
    saveBookingsToStorage(bookings)
  }
}

export const deleteBookingFromStorage = (bookingId: string) => {
  const bookings = getBookingsFromStorage()
  const filteredBookings = bookings.filter(booking => booking.id !== bookingId)
  saveBookingsToStorage(filteredBookings)
}

// Users operations
export const getUsersFromStorage = (): StaticUser[] => {
  if (typeof window === "undefined") return []
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS)
    return users ? JSON.parse(users) : []
  } catch (error) {
    console.error("Error reading users from localStorage:", error)
    return []
  }
}

export const saveUsersToStorage = (users: StaticUser[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  } catch (error) {
    console.error("Error saving users to localStorage:", error)
  }
}

// Payments operations
export const getPaymentsFromStorage = (): StaticPayment[] => {
  if (typeof window === "undefined") return []
  try {
    const payments = localStorage.getItem(STORAGE_KEYS.PAYMENTS)
    return payments ? JSON.parse(payments) : []
  } catch (error) {
    console.error("Error reading payments from localStorage:", error)
    return []
  }
}

export const savePaymentsToStorage = (payments: StaticPayment[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments))
  } catch (error) {
    console.error("Error saving payments to localStorage:", error)
  }
}

// Notifications operations
export const getNotificationsFromStorage = (): StaticNotification[] => {
  if (typeof window === "undefined") return []
  try {
    const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
    return notifications ? JSON.parse(notifications) : []
  } catch (error) {
    console.error("Error reading notifications from localStorage:", error)
    return []
  }
}

export const saveNotificationsToStorage = (notifications: StaticNotification[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
  } catch (error) {
    console.error("Error saving notifications to localStorage:", error)
  }
}

// Utility functions
export const clearAllData = () => {
  if (typeof window === "undefined") return
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

export const exportData = () => {
  if (typeof window === "undefined") return null
  try {
    const data = {
      cars: getCarsFromStorage(),
      bookings: getBookingsFromStorage(),
      users: getUsersFromStorage(),
      payments: getPaymentsFromStorage(),
      notifications: getNotificationsFromStorage()
    }
    return data
  } catch (error) {
    console.error("Error exporting data:", error)
    return null
  }
}

export const importData = (data: any) => {
  if (typeof window === "undefined") return false
  try {
    if (data.cars) saveCarsToStorage(data.cars)
    if (data.bookings) saveBookingsToStorage(data.bookings)
    if (data.users) saveUsersToStorage(data.users)
    if (data.payments) savePaymentsToStorage(data.payments)
    if (data.notifications) saveNotificationsToStorage(data.notifications)
    return true
  } catch (error) {
    console.error("Error importing data:", error)
    return false
  }
}
