"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowRight,
  Car,
  Save,
  X,
  Plus,
  Trash2
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { staticCars, type StaticCar } from "@/lib/static-data"
import { getCarsFromStorage, updateCarInStorage } from "@/lib/local-storage"

export default function EditCarPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [car, setCar] = useState<StaticCar | null>(null)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    category: "",
    transmission: "",
    fuelType: "",
    seats: "",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    mileage: "",
    color: "",
    description: "",
    features: [] as string[],
    images: [] as string[],
    isAvailable: true,
    location: "",
    status: "available" as "available" | "rented" | "maintenance",
  })

  const [newFeature, setNewFeature] = useState("")
  const [newImage, setNewImage] = useState("")

  const categories = [
    "اقتصادية",
    "عائلية", 
    "رياضية",
    "فاخرة",
    "SUV",
    "فان",
    "شاحنة"
  ]

  const transmissions = [
    "أوتوماتيك",
    "يدوي"
  ]

  const fuelTypes = [
    "بنزين",
    "ديزل", 
    "كهربائي",
    "هجين"
  ]

  const colors = [
    "أبيض",
    "أسود",
    "رمادي",
    "أحمر",
    "أزرق",
    "أخضر",
    "فضي",
    "ذهبي"
  ]

  useEffect(() => {
    // Find the car by ID from localStorage
    const cars = getCarsFromStorage()
    const foundCar = cars.find(c => c.id === carId)
    if (foundCar) {
      setCar(foundCar)
      setFormData({
        brand: foundCar.brand,
        model: foundCar.model,
        year: foundCar.year.toString(),
        category: foundCar.category,
        transmission: foundCar.transmission || "",
        fuelType: foundCar.fuelType || "",
        seats: foundCar.seats?.toString() || "",
        pricePerDay: foundCar.pricePerDay.toString(),
        pricePerWeek: foundCar.pricePerWeek?.toString() || "",
        pricePerMonth: foundCar.pricePerMonth?.toString() || "",
        mileage: foundCar.mileage?.toString() || "",
        color: foundCar.color || "",
        description: foundCar.description || "",
        features: foundCar.features || [],
        images: foundCar.images || [],
        isAvailable: foundCar.isAvailable,
        location: foundCar.location || "",
        status: foundCar.status,
      })
    } else {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على السيارة",
        variant: "destructive",
      })
      router.push("/admin")
    }
  }, [carId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }))
  }

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      const requiredFields = ['brand', 'model', 'year', 'category', 'pricePerDay']
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
      
      if (missingFields.length > 0) {
        toast({
          title: "حقول مطلوبة",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        })
        return
      }

      // Create updated car object
      const updatedCar: Partial<StaticCar> = {
        name: `${formData.brand} ${formData.model} ${formData.year}`,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        category: formData.category,
        categoryId: formData.category.toLowerCase().replace(/\s+/g, '_'),
        pricePerDay: parseInt(formData.pricePerDay),
        pricePerWeek: formData.pricePerWeek ? parseInt(formData.pricePerWeek) : undefined,
        pricePerMonth: formData.pricePerMonth ? parseInt(formData.pricePerMonth) : undefined,
        description: formData.description,
        features: formData.features,
        images: formData.images,
        isAvailable: formData.isAvailable,
        status: formData.status,
        transmission: formData.transmission || undefined,
        fuelType: formData.fuelType || undefined,
        seats: formData.seats ? parseInt(formData.seats) : undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        color: formData.color || undefined,
        location: formData.location || undefined,
        updatedAt: new Date().toISOString(),
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update in localStorage
      updateCarInStorage(carId, updatedCar)
      
      toast({
        title: "تم تحديث السيارة بنجاح",
        description: "تم حفظ التغييرات في النظام",
      })

      // Redirect to admin cars page
      router.push("/admin")
    } catch (error) {
      toast({
        title: "خطأ في تحديث السيارة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              لوحة الإدارة
            </Link>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              السيارات
            </Link>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-primary font-medium">تعديل السيارة</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">تعديل السيارة</h1>
              <p className="text-muted-foreground">{car.name}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  المعلومات الأساسية
                </CardTitle>
                <CardDescription>
                  عدل المعلومات الأساسية للسيارة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">الماركة *</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="مثال: تويوتا"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">الموديل *</Label>
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="مثال: كامري"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">سنة الصنع *</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="2024"
                      min="1900"
                      max="2030"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">الفئة *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">ناقل الحركة</Label>
                    <Select value={formData.transmission} onValueChange={(value) => handleSelectChange("transmission", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر ناقل الحركة" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((transmission) => (
                          <SelectItem key={transmission} value={transmission}>
                            {transmission}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">نوع الوقود</Label>
                    <Select value={formData.fuelType} onValueChange={(value) => handleSelectChange("fuelType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع الوقود" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((fuelType) => (
                          <SelectItem key={fuelType} value={fuelType}>
                            {fuelType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seats">عدد المقاعد</Label>
                    <Input
                      id="seats"
                      name="seats"
                      type="number"
                      value={formData.seats}
                      onChange={handleInputChange}
                      placeholder="5"
                      min="1"
                      max="15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">اللون</Label>
                    <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اللون" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">المسافة المقطوعة (كم)</Label>
                    <Input
                      id="mileage"
                      name="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="الرياض"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">حالة السيارة</Label>
                  <Select value={formData.status} onValueChange={(value: "available" | "rented" | "maintenance") => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">متاح</SelectItem>
                      <SelectItem value="rented">مؤجر</SelectItem>
                      <SelectItem value="maintenance">صيانة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>الأسعار</CardTitle>
                <CardDescription>
                  عدل أسعار تأجير السيارة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay">السعر اليومي *</Label>
                    <Input
                      id="pricePerDay"
                      name="pricePerDay"
                      type="number"
                      value={formData.pricePerDay}
                      onChange={handleInputChange}
                      placeholder="200"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerWeek">السعر الأسبوعي</Label>
                    <Input
                      id="pricePerWeek"
                      name="pricePerWeek"
                      type="number"
                      value={formData.pricePerWeek}
                      onChange={handleInputChange}
                      placeholder="1200"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerMonth">السعر الشهري</Label>
                    <Input
                      id="pricePerMonth"
                      name="pricePerMonth"
                      type="number"
                      value={formData.pricePerMonth}
                      onChange={handleInputChange}
                      placeholder="4000"
                      min="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>الوصف</CardTitle>
                <CardDescription>
                  عدل وصف السيارة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف السيارة</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اكتب وصفاً مفصلاً للسيارة..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>المميزات</CardTitle>
                <CardDescription>
                  عدل مميزات السيارة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="أضف ميزة جديدة"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>الصور</CardTitle>
                <CardDescription>
                  عدل صور السيارة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="رابط الصورة"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" onClick={addImage} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x200?text=صورة+غير+متوفرة"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
