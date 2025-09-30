'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, ClockIcon, ShieldCheckIcon, TruckIcon, UserGroupIcon, WifiIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Wide Selection',
    description: 'Choose from our extensive fleet of luxury and performance vehicles for every occasion.',
    icon: TruckIcon,
  },
  {
    name: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to assist you with any queries.',
    icon: ClockIcon,
  },
  {
    name: 'Best Prices',
    description: 'Competitive pricing with no hidden fees. We guarantee the best rates for premium vehicles.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Flexible Rentals',
    description: 'Customize your rental period with flexible daily, weekly, or monthly options.',
    icon: ClockIcon,
  },
  {
    name: 'Premium Service',
    description: 'Experience exceptional service with our professional and knowledgeable staff.',
    icon: UserGroupIcon,
  },
  {
    name: 'Full Insurance',
    description: 'Comprehensive insurance coverage for complete peace of mind during your rental period.',
    icon: ShieldCheckIcon,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Us
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -50px 0px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience the difference with our premium car rental service
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                variants={item}
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="absolute -top-6 left-6 bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg shadow-lg">
                  <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Stats */}
      <div className="mt-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -50px 0px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Customers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -50px 0px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Luxury Vehicles</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -50px 0px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer Support</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -50px 0px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
