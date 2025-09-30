"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  Building,
  User,
  Calendar
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      title: "العنوان",
      value: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
      icon: MapPin,
      link: "https://maps.google.com",
    },
    {
      title: "الهاتف",
      value: "+966 50 123 4567",
      icon: Phone,
      link: "tel:+966501234567",
    },
    {
      title: "البريد الإلكتروني",
      value: "info@carrental.sa",
      icon: Mail,
      link: "mailto:info@carrental.sa",
    },
    {
      title: "ساعات العمل",
      value: "الأحد - الخميس: 8:00 ص - 8:00 م",
      icon: Clock,
    },
  ]

  const offices = [
    {
      city: "الرياض",
      address: "شارع الملك فهد، حي النخيل",
      phone: "+966 11 123 4567",
      email: "riyadh@carrental.sa",
    },
    {
      city: "جدة",
      address: "شارع التحلية، حي الشاطئ",
      phone: "+966 12 123 4567",
      email: "jeddah@carrental.sa",
    },
    {
      city: "الدمام",
      address: "شارع الملك خالد، حي الشاطئ",
      phone: "+966 13 123 4567",
      email: "dammam@carrental.sa",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "تم إرسال الرسالة بنجاح",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              اتصل بنا
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              نحن هنا لمساعدتك
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              فريق خدمة العملاء متاح على مدار الساعة للإجابة على استفساراتك 
              ومساعدتك في حجز سيارتك المثالية.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <info.icon className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{info.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  أرسل لنا رسالة
                </CardTitle>
                <CardDescription>
                  املأ النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="أدخل بريدك الإلكتروني"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="أدخل رقم هاتفك"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">الموضوع *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="أدخل موضوع الرسالة"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="اكتب رسالتك هنا..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 ml-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  موقعنا
                </CardTitle>
                <CardDescription>
                  يمكنك زيارتنا في أحد فروعنا المنتشرة في المملكة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">خريطة تفاعلية</p>
                    <p className="text-sm text-muted-foreground">سيتم إضافة الخريطة هنا</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">فروعنا</h2>
            <p className="text-muted-foreground text-lg">
              يمكنك زيارتنا في أحد فروعنا المنتشرة في المملكة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    {office.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-muted-foreground">{office.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${office.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${office.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {office.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">الأسئلة الشائعة</h2>
            <p className="text-muted-foreground text-lg">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">كيف يمكنني حجز سيارة؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  يمكنك حجز سيارة بسهولة من خلال موقعنا الإلكتروني أو تطبيقنا، 
                  أو الاتصال بنا مباشرة على الرقم المجاني.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ما هي المستندات المطلوبة؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  تحتاج إلى رخصة قيادة سارية المفعول وبطاقة هوية أو جواز سفر، 
                  وبطاقة ائتمان للدفع.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">هل يمكن إلغاء الحجز؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نعم، يمكنك إلغاء الحجز مجاناً قبل 24 ساعة من موعد الاستلام، 
                  مع مراعاة شروط الإلغاء.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">هل التأمين مشمول؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نعم، جميع سياراتنا مؤمنة تأميناً شاملاً، ويمكنك إضافة تأمين إضافي 
                  حسب احتياجاتك.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
