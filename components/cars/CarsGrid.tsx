'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedCard, CardBody, CardFooter, CardImage } from '../ui/AnimatedCard';
import { GradientButton } from '../ui/GradientButton';

const cars = [
  {
    id: 1,
    name: 'BMW M5 Competition',
    type: 'Luxury Sedan',
    price: 299,
    image: '/cars/bmw-m5.jpg',
    features: ['Automatic', '4 Seats', 'Petrol', '4 Doors'],
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Mercedes-Benz S-Class',
    type: 'Luxury Sedan',
    price: 349,
    image: '/cars/mercedes-s-class.jpg',
    features: ['Automatic', '5 Seats', 'Hybrid', '4 Doors'],
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Porsche 911 Carrera',
    type: 'Sports Car',
    price: 399,
    image: '/cars/porsche-911.jpg',
    features: ['Automatic', '2 Seats', 'Petrol', '2 Doors'],
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Range Rover Sport',
    type: 'Luxury SUV',
    price: 279,
    image: '/cars/range-rover.jpg',
    features: ['Automatic', '5 Seats', 'Diesel', '5 Doors'],
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Tesla Model S',
    type: 'Electric',
    price: 329,
    image: '/cars/tesla-model-s.jpg',
    features: ['Automatic', '5 Seats', 'Electric', '4 Doors'],
    rating: 4.9,
  },
  {
    id: 6,
    name: 'Audi Q7',
    type: 'Luxury SUV',
    price: 259,
    image: '/cars/audi-q7.jpg',
    features: ['Automatic', '7 Seats', 'Diesel', '5 Doors'],
    rating: 4.6,
  },
];

export default function CarsGrid() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Premium Fleet
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from our exclusive collection of luxury and performance vehicles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -100px 0px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AnimatedCard 
                hoverEffect="lift" 
                className="h-full flex flex-col"
              >
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <CardImage 
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{car.rating}</span>
                  </div>
                </div>
                
                <CardBody className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{car.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{car.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${car.price}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">per day</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {car.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardBody>
                
                <CardFooter className="mt-auto">
                  <Link href={`/cars/${car.id}`} className="w-full">
                    <GradientButton 
                      className="w-full"
                      hoverEffect="grow"
                    >
                      Rent Now
                    </GradientButton>
                  </Link>
                </CardFooter>
              </AnimatedCard>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/cars">
            <GradientButton 
              variant="secondary" 
              size="lg"
              className="px-8"
              hoverEffect="grow"
            >
              View All Cars
            </GradientButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
