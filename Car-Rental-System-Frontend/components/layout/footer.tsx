'use client';

import Link from 'next/link';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const links = [
    {
      title: 'Quick Links',
      items: [
        { name: 'Home', href: '/' },
        { name: 'Cars', href: '/cars' },
        { name: 'About Us', href: '/about' },
        { name: 'Services', href: '/services' },
      ],
    },
    {
      title: 'Services',
      items: [
        { name: 'Luxury Car Rentals', href: '/services/luxury' },
        { name: 'Airport Transfers', href: '/services/airport' },
        { name: 'Corporate Services', href: '/services/corporate' },
        { name: 'Long Term Rentals', href: '/services/long-term' },
      ],
    },
    {
      title: 'Support',
      items: [
        { name: 'FAQs', href: '/faq' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ];

  const contactInfo = [
    { icon: Phone, text: '+1 (555) 123-4567' },
    { icon: Mail, text: 'info@luxuride.com' },
    { icon: MapPin, text: '123 Luxury Street, New York, NY 10001' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                LuxeRide
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the ultimate in luxury and performance with our premium car rental service.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {links.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-white font-semibold text-lg relative pb-2">
                {section.title}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400"></span>
              </h3>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.name} className="group">
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg pb-2">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start space-x-3 group">
                  <div className="mt-1 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                    {info.text}
                  </span>
                </li>
              ))}
            </ul>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 text-sm bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} LuxeRide. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
