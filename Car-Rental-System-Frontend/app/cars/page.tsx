"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CarCard } from "@/components/cars/car-card"
import { CarFiltersComponent } from "@/components/cars/car-filters"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { carsService, type Car, type CarFilters, type CarsResponse } from "@/lib/cars"

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  })

  const [filters, setFilters] = useState<CarFilters>({
    page: 1,
    limit: 12,
  })

  const loadCars = async (newFilters: CarFilters = filters) => {
    setLoading(true)
    setError("")

    try {
      const response: CarsResponse = await carsService.getCars(newFilters)
      setCars(response.cars)
      setPagination({
        page: response.page,
        totalPages: response.totalPages,
        total: response.total,
        hasNext: response.hasNext,
        hasPrev: response.hasPrev,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب السيارات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCars()
  }, [])

  const handleFiltersChange = (newFilters: CarFilters) => {
    setFilters({ ...newFilters, page: 1 }) // Reset to first page when filters change
  }

  const handleSearch = () => {
    loadCars({ ...filters, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage }
    setFilters(newFilters)
    loadCars(newFilters)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">جميع السيارات</h1>
          <p className="text-muted-foreground">اختر من مجموعة واسعة من السيارات المتاحة للإيجار</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CarFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              عرض {cars.length} من أصل {pagination.total} سيارة
            </p>
            {pagination.totalPages > 1 && (
              <p className="text-muted-foreground">
                صفحة {pagination.page} من {pagination.totalPages}
              </p>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                  <div className="bg-muted rounded h-4 w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cars Grid */}
        {!loading && cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && cars.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚗</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">لا توجد سيارات متاحة</h3>
            <p className="text-muted-foreground mb-4">جرب تغيير معايير البحث أو الفلاتر</p>
            <Button onClick={() => handleFiltersChange({ page: 1, limit: 12 })}>مسح جميع الفلاتر</Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
