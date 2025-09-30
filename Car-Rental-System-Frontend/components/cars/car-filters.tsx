"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X } from "lucide-react"
import { carsService, type CarFilters, type Category } from "@/lib/cars"

interface CarFiltersProps {
  filters: CarFilters
  onFiltersChange: (filters: CarFilters) => void
  onSearch: () => void
  loading?: boolean
}

export function CarFiltersComponent({ filters, onFiltersChange, onSearch, loading }: CarFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [categoriesData, brandsData, priceRangeData] = await Promise.all([
          carsService.getCategories(),
          carsService.getPopularBrands(),
          carsService.getPriceRange(),
        ])
        setCategories(categoriesData)
        setBrands(brandsData)
        setPriceRange(priceRangeData)
      } catch (error) {
        console.error("Failed to load filter data:", error)
      }
    }

    loadFilterData()
  }, [])

  const handleFilterChange = (key: keyof CarFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search, // Keep search term
      page: 1,
    })
  }

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== "search" && key !== "page" && key !== "limit" && filters[key as keyof CarFilters],
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن السيارة المناسبة..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pr-10"
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
            <Button onClick={onSearch} disabled={loading}>
              {loading ? "جاري البحث..." : "بحث"}
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 ml-2" />
              فلترة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">فلترة النتائج</CardTitle>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 ml-1" />
                    مسح الفلاتر
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <Label>الماركة</Label>
                <Select value={filters.brand || "all"} onValueChange={(value) => handleFilterChange("brand", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الماركة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الماركات</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission Filter */}
              <div className="space-y-2">
                <Label>ناقل الحركة</Label>
                <Select
                  value={filters.transmission || "all"}
                  onValueChange={(value) => handleFilterChange("transmission", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="نوع ناقل الحركة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="automatic">أوتوماتيك</SelectItem>
                    <SelectItem value="manual">يدوي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type Filter */}
              <div className="space-y-2">
                <Label>نوع الوقود</Label>
                <Select
                  value={filters.fuelType || "all"}
                  onValueChange={(value) => handleFilterChange("fuelType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="نوع الوقود" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="petrol">بنزين</SelectItem>
                    <SelectItem value="diesel">ديزل</SelectItem>
                    <SelectItem value="electric">كهربائي</SelectItem>
                    <SelectItem value="hybrid">هجين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <Label>نطاق السعر (ريال/يوم)</Label>
              <div className="px-2">
                <Slider
                  value={[filters.minPrice || priceRange.min, filters.maxPrice || priceRange.max]}
                  onValueChange={([min, max]) => {
                    handleFilterChange("minPrice", min)
                    handleFilterChange("maxPrice", max)
                  }}
                  max={priceRange.max}
                  min={priceRange.min}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{filters.minPrice || priceRange.min} ريال</span>
                  <span>{filters.maxPrice || priceRange.max} ريال</span>
                </div>
              </div>
            </div>

            {/* Seats Filter */}
            <div className="space-y-2">
              <Label>عدد المقاعد</Label>
              <Select
                value={filters.seats?.toString() || "all"}
                onValueChange={(value) => handleFilterChange("seats", value ? Number.parseInt(value) : undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="عدد المقاعد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="2">2 مقاعد</SelectItem>
                  <SelectItem value="4">4 مقاعد</SelectItem>
                  <SelectItem value="5">5 مقاعد</SelectItem>
                  <SelectItem value="7">7 مقاعد</SelectItem>
                  <SelectItem value="8">8+ مقاعد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ترتيب حسب</Label>
                <Select
                  value={filters.sortBy || "default"}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ترتيب النتائج" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">الافتراضي</SelectItem>
                    <SelectItem value="price">السعر</SelectItem>
                    <SelectItem value="rating">التقييم</SelectItem>
                    <SelectItem value="year">سنة الصنع</SelectItem>
                    <SelectItem value="name">الاسم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>اتجاه الترتيب</Label>
                <Select
                  value={filters.sortOrder || "asc"}
                  onValueChange={(value) => handleFilterChange("sortOrder", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اتجاه الترتيب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">تصاعدي</SelectItem>
                    <SelectItem value="desc">تنازلي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
