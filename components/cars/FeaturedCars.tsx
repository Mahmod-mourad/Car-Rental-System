'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Zap, Shield, Clock } from 'lucide-react';

type Car = {
  id: number;
  name: string;
  type: string;
  price: number;
  rating: number;
  image: string;
  features: string[];
  isPopular?: boolean;
};

const featuredCars: Car[] = [
  {
    id: 1,
    name: 'مرسيدس بنز الفئة S',
    type: 'سيارة سيدان فاخرة',
    price: 899,
    rating: 4.9,
    image: '/images/cars/mercedes-s-class.jpg',
    features: ['أوتوماتيك', '5 مقاعد', 'بنزين', '4 أبواب'],
    isPopular: true,
  },
  {
    id: 2,
    name: 'بي إم دبليو X7',
    type: 'دفع رباعي فاخر',
    price: 999,
    rating: 4.8,
    image: '/images/cars/bmw-x7.jpg',
    features: ['أوتوماتيك', '7 مقاعد', 'بنزين', '4 أبواب'],
  },
  {
    id: 3,
    name: 'أودي A8',
    type: 'سيارة سيدان فاخرة',
    price: 849,
    rating: 4.7,
    image: '/images/cars/audi-a8.jpg',
    features: ['أوتوماتيك', '5 مقاعد', 'بنزين', '4 أبواب'],
  },
];

export default function FeaturedCars() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">سياراتنا المميزة</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            اكتشف مجموعتنا الحصرية من السيارات الفاخرة والمريحة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car, index) => (
            <motion.div
              key={car.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {car.isPopular && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full z-10">
                  الأكثر طلباً
                </div>
              )}
              
              <div className="relative h-56 w-full">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/cars/car-placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 right-4 text-white text-right">
                  <h3 className="text-xl font-bold">{car.name}</h3>
                  <p className="text-sm text-gray-200">{car.type}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="mr-1 text-gray-700 dark:text-gray-300">{car.rating}</span>
                    <span className="text-gray-500 text-sm">(24 تقييم)</span>
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {car.price} ريال
                    </span>
                    <span className="block text-sm text-gray-500">ليوم الواحد</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {car.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="ml-2">•</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/cars/${car.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    احجز الآن
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/cars"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors duration-200"
          >
            عرض جميع السيارات
          </Link>
        </div>
      </div>
    </section>
  );
}
