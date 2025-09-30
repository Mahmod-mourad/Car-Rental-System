import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Award,
  CheckCircle,
  Star
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const stats = [
    { label: "سيارة متاحة", value: "500+", icon: Car },
    { label: "عميل راضي", value: "10,000+", icon: Users },
    { label: "سنة خبرة", value: "15+", icon: Award },
    { label: "مدينة", value: "25+", icon: MapPin },
  ]

  const features = [
    {
      title: "سيارات عالية الجودة",
      description: "نوفر مجموعة متنوعة من السيارات الحديثة والمحافظة عليها بشكل ممتاز",
      icon: Car,
    },
    {
      title: "حجز سريع وسهل",
      description: "احجز سيارتك في دقائق معدودة من خلال موقعنا الإلكتروني أو تطبيقنا",
      icon: Clock,
    },
    {
      title: "أسعار تنافسية",
      description: "أفضل الأسعار في السوق مع عروض وخصومات حصرية",
      icon: Award,
    },
    {
      title: "خدمة عملاء 24/7",
      description: "فريق خدمة العملاء متاح على مدار الساعة لمساعدتك",
      icon: Phone,
    },
    {
      title: "تأمين شامل",
      description: "جميع سياراتنا مؤمنة تأميناً شاملاً لحماية عملائنا",
      icon: Shield,
    },
    {
      title: "توصيل مجاني",
      description: "نوصل السيارة إلى باب منزلك أو مكتبك مجاناً",
      icon: MapPin,
    },
  ]

  const team = [
    {
      name: "أحمد محمد",
      position: "المدير العام",
      description: "خبرة 20 عام في مجال تأجير السيارات",
      image: "/team/ahmed.jpg",
    },
    {
      name: "فاطمة علي",
      position: "مديرة خدمة العملاء",
      description: "متخصصة في تقديم أفضل تجربة للعملاء",
      image: "/team/fatima.jpg",
    },
    {
      name: "محمد حسن",
      position: "مدير الصيانة",
      description: "يضمن أن جميع السيارات في حالة ممتازة",
      image: "/team/mohammed.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              من نحن
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              شركة تأجير السيارات الرائدة
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              نقدم أفضل خدمات تأجير السيارات في المملكة العربية السعودية منذ أكثر من 15 عاماً. 
              نسعى لتوفير تجربة استثنائية لعملائنا مع ضمان الجودة والأمان والراحة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/cars">استكشف السيارات</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">اتصل بنا</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">لماذا تختارنا؟</h2>
            <p className="text-muted-foreground text-lg">
              نتميز بالجودة والموثوقية في كل ما نقدمه
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <feature.icon className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Star className="h-6 w-6 text-primary" />
                  رؤيتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  نسعى لأن نكون الشركة الرائدة في مجال تأجير السيارات في المملكة العربية السعودية، 
                  من خلال تقديم خدمات عالية الجودة وتجربة استثنائية لعملائنا، مع الالتزام بأعلى 
                  معايير الأمان والموثوقية.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  مهمتنا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  توفير حلول تنقل مريحة وآمنة لعملائنا من خلال أسطول متنوع من السيارات الحديثة، 
                  مع ضمان خدمة عملاء متميزة وأسعار تنافسية، مما يساهم في تسهيل تنقلاتهم 
                  وتحسين تجربتهم اليومية.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">فريق العمل</h2>
            <p className="text-muted-foreground text-lg">
              فريق متخصص من الخبراء لخدمتك
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.position}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك معنا اليوم</h2>
          <p className="text-lg mb-8 opacity-90">
            احجز سيارتك الآن واستمتع برحلة مريحة وآمنة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cars">احجز الآن</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">تواصل معنا</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
