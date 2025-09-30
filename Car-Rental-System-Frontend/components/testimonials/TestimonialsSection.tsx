'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'عميل دائم',
    content: 'تجربة رائعة مع شركة لوكس رايد، الخدمة ممتازة والسيارات في حالة ممتازة. أنصح الجميع بالتعامل معهم.',
    rating: 5,
    image: '/images/avatars/avatar1.jpg',
  },
  {
    id: 2,
    name: 'سارة أحمد',
    role: 'عميلة',
    content: 'أفضل خدمة تأجير سيارات واجهتها على الإطلاق. الموظفون محترفون جداً ويقدمون خدمة ممتازة.',
    rating: 5,
    image: '/images/avatars/avatar2.jpg',
  },
  {
    id: 3,
    name: 'خالد عبدالله',
    role: 'مدير شركة',
    content: 'نعتمد على لوكس رايد في توفير سيارات لموظفينا. الخدمة سريعة والتنظيم ممتاز.',
    rating: 4,
    image: '/images/avatars/avatar3.jpg',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">آراء عملائنا</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            اكتشف ما يقوله عملاؤنا عن تجربتهم مع لوكس رايد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute -top-4 right-6 text-yellow-400 bg-white dark:bg-gray-800 p-2 rounded-full">
                <Quote className="h-6 w-6" />
              </div>
              
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/avatars/default-avatar.jpg';
                    }}
                  />
                </div>
                <div className="mr-3 text-right">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-right">"{testimonial.content}"</p>
              
              <div className="flex items-center justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
