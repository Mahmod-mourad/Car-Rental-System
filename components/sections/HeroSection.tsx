'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { GradientButton } from '../ui/GradientButton';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="block">Premium Car</span>
              <span className="relative inline-block">
                <span className="relative z-10">Rental Service</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 dark:bg-blue-900/50 -z-0 opacity-70"></span>
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Experience luxury and comfort with our premium car rental service. Choose from a wide range of vehicles for any occasion.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/cars" className="w-full sm:w-auto">
                <GradientButton 
                  size="lg" 
                  className="w-full sm:w-auto"
                  hoverEffect="grow"
                >
                  Explore Cars
                </GradientButton>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <GradientButton 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                  hoverEffect="shrink"
                >
                  Learn More
                </GradientButton>
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Luxury Cars</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5★</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</div>
              </div>
            </motion.div>
          </div>
          
          {/* Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-1">
              <Image
                src="/hero-car.jpg"
                alt="Luxury Car"
                width={600}
                height={400}
                className="w-full h-auto"
                priority
              />
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold">BMW M5 Competition</h3>
                <p className="text-blue-200">Starts from $199/day</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg z-20"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold">-20%</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-20"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <div className="flex items-center space-x-2 px-3 py-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Available Now</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="w-8 h-12 border-2 border-blue-500 dark:border-blue-400 rounded-full flex justify-center p-1">
          <motion.div 
            className="w-1 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          ></motion.div>
        </div>
        <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">Scroll Down</p>
      </motion.div>
    </section>
  );
}
