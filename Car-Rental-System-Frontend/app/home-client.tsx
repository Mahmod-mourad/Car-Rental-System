'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Shield, Clock, Star, Search, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

// Dynamic imports with no SSR to avoid hydration issues
const WhyChooseUs = dynamic(() => import('@/components/sections/WhyChooseUs'), { ssr: false });
const FeaturedCars = dynamic(() => import('@/components/cars/FeaturedCars'), { ssr: false });
const TestimonialsSection = dynamic(() => import('@/components/testimonials/TestimonialsSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/faq/FAQSection'), { ssr: false });

export default function HomeClient() {
  const featuredCars = [
    {
      id: 1,
      name: "تويوتا كامري 2024",
      image: "/toyota-camry-2024-silver.png",
      price: "150",
      rating: 4.8,
      features: ["أوتوماتيك", "5 مقاعد", "بنزين", "مكيف"],
    },
    {
      id: 2,
      name: "هيونداي إلنترا 2024",
      image: "/hyundai-elantra-2024-white.png",
      price: "120",
      rating: 4.6,
      features: ["أوتوماتيك", "5 مقاعد", "بنزين", "مكيف"],
    },
    {
      id: 3,
      name: "نيسان التيما 2024",
      image: "/nissan-altima-2024-black.png",
      price: "140",
      rating: 4.7,
      features: ["أوتوماتيك", "5 مقاعد", "بنزين", "مكيف"],
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "أمان وموثوقية",
      description: "جميع سياراتنا مؤمنة بالكامل ومفحوصة دورياً",
    },
    {
      icon: Clock,
      title: "خدمة 24/7",
      description: "نحن متاحون على مدار الساعة لخدمتكم",
    },
    {
      icon: Car,
      title: "أسطول حديث",
      description: "سيارات حديثة ومتنوعة تناسب جميع الاحتياجات",
    },
    {
      icon: Star,
      title: "خدمة مميزة",
      description: "تقييم عالي من عملائنا الكرام",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-l from-primary/10 to-secondary/10 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                احجز سيارتك
                <span className="text-primary block bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  بسهولة وأمان
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                اكتشف أفضل خدمات تأجير السيارات في المملكة العربية السعودية. أسطول حديث، أسعار تنافسية، وخدمة عملاء متميزة على مدار الساعة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" asChild className="group relative overflow-hidden">
                  <Link href="/cars" className="relative z-10">
                    <Car className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    تصفح السيارات
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="group relative overflow-hidden">
                  <Link href="/about" className="relative z-10">
                    تعرف علينا أكثر
                    <span className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">+500</div>
                  <div className="text-sm text-muted-foreground">سيارة</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">+10,000</div>
                  <div className="text-sm text-muted-foreground">عميل راضٍ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">خدمة عملاء</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">تأمين شامل</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800">
                <img
                  src="/luxury-car-rental-hero.png"
                  alt="Car rental hero"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-car.png';
                  }}
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 -right-12 w-24 h-24 bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white dark:fill-gray-900"></path>
          </svg>
        </div>
      </section>

      {/* Rest of your home page content */}
      {/* Search Section */}
      <section className="py-12 bg-card relative -mt-1">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-4 bg-gradient-to-br from-primary to-blue-600 p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">ابحث عن سيارتك المثالية</h2>
                    <p className="text-blue-100 mb-6">اختر من بين مجموعة واسعة من السيارات الفاخرة</p>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                          <Car className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-sm text-blue-100">متاح الآن</div>
                          <div className="font-semibold">+500 سيارة</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-8 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium block mb-1 text-right">مكان الاستلام</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <select className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">اختر المدينة</option>
                            <option value="riyadh">الرياض</option>
                            <option value="jeddah">جدة</option>
                            <option value="dammam">الدمام</option>
                            <option value="makkah">مكة المكرمة</option>
                            <option value="madina">المدينة المنورة</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium block mb-1 text-right">تاريخ الاستلام</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <input 
                            type="date" 
                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium block mb-1 text-right">تاريخ التسليم</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <input 
                            type="date" 
                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium block mb-1 text-right">نوع السيارة</label>
                        <div className="relative">
                          <select className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">جميع الأنواع</option>
                            <option value="sedan">سيدان</option>
                            <option value="suv">دفع رباعي</option>
                            <option value="luxury">فاخرة</option>
                            <option value="sports">رياضية</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium block mb-1 text-right">الميزانية</label>
                        <div className="relative">
                          <select className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">أي ميزانية</option>
                            <option value="economy">اقتصادية (100-300 ريال/اليوم)</option>
                            <option value="mid">متوسطة (300-600 ريال/اليوم)</option>
                            <option value="luxury">فاخرة (600+ ريال/اليوم)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-end">
                        <Button className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:-translate-y-1">
                          <Search className="h-5 w-5 ml-2" />
                          بحث متقدم
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                      <span className="text-sm text-muted-foreground">الأكثر بحثاً:</span>
                      <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        الرياض
                      </button>
                      <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        جدة
                      </button>
                      <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        دفع رباعي
                      </button>
                      <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        اقتصادية
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-0">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Featured Cars Section */}
      <FeaturedCars />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-blue-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 dark:opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
              <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              هل أنت مستعد لبدء رحلتك؟
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف العملاء الراضين عن خدماتنا واستمتع بتجربة تأجير سيارات استثنائية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/cars" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                احجز سيارتك الآن
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                تواصل معنا
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden">
                        <img 
                          src={`/images/avatars/avatar${i}.jpg`} 
                          alt={`User ${i}`} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/avatars/default-avatar.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">+10,000 عميل</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">يثقون بنا</div>
                  </div>
                </div>
                
                <div className="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">4.9/5</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">تقييم العملاء</div>
                  </div>
                </div>
                
                <div className="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">100%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">تأمين شامل</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white dark:fill-gray-900"></path>
          </svg>
        </div>
      </section>
    </div>
  );
}
