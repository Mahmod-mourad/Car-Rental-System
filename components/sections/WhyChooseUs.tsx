'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Tag, Headphones, Car, MapPin, Award } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
    title: 'تأمين شامل',
    description: 'جميع سياراتنا مؤمنة تأميناً شاملاً لتوفر لك راحة البال خلال رحلتك.'
  },
  {
    icon: <Clock className="h-8 w-8 text-blue-600" />,
    title: 'متاح على مدار الساعة',
    description: 'خدمة عملاء متوفرة على مدار الساعة طوال أيام الأسبوع لمساعدتك في أي استفسار.'
  },
  {
    icon: <Tag className="h-8 w-8 text-blue-600" />,
    title: 'أسعار تنافسية',
    description: 'نقدم أفضل الأسعار مع خصومات حصرية للعملاء الدائمين والعروض الموسمية.'
  },
  {
    icon: <Headphones className="h-8 w-8 text-blue-600" />,
    title: 'دعم فني متكامل',
    description: 'فريق دعم فني متاح لمساعدتك في أي مشكلة تواجهك خلال فترة التأجير.'
  },
  {
    icon: <Car className="h-8 w-8 text-blue-600" />,
    title: 'أسطول حديث',
    description: 'جميع سياراتنا حديثة ومجهزة بأحدث التقنيات لضمان رحلتك مريحة وآمنة.'
  },
  {
    icon: <MapPin className="h-8 w-8 text-blue-600" />,
    title: 'توصيل مجاني',
    description: 'نوفر خدمة التوصيل المجاني إلى المطار والفنادق في جميع أنحاء المدينة.'
  },
  {
    icon: <Award className="h-8 w-8 text-blue-600" />,
    title: 'جائزة التميز',
    description: 'حاصلون على جائزة أفضل شركة تأجير سيارات للعامين الماضيين.'
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
    title: 'صيانة دورية',
    description: 'جميع سياراتنا تخضع لصيانة دورية لضمان أدائها المثالي.'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">لماذا تختار لوكس رايد؟</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            نقدم لك تجربة تأجير سيارات استثنائية مع أفضل الخدمات وأحدث السيارات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4">هل أنت مستعد لتجربة لا تُنسى؟</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              احجز سيارتك الآن واستمتع بأفضل العروض والخصومات الحصرية لعملائنا الكرام
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/cars"
                className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                تصفح السيارات
              </a>
              <a
                href="/contact"
                className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                تواصل معنا
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
