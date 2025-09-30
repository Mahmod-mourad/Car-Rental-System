'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'ما هي المستندات المطلوبة لتأجير سيارة؟',
    answer: 'يجب تقديم رخصة قيادة سارية المفعول، وبطاقة هوية سارية المفعول (الهوية الوطنية أو الإقامة أو الجواز)، وبطاقة ائتمان باسم المستأجر.',
  },
  {
    id: 2,
    question: 'ما هو الحد الأدنى لسن تأجير السيارة؟',
    answer: 'الحد الأدنى لسن التأجير هو 21 عاماً لمعظم السيارات، وقد يختلف حسب نوع السيارة المطلوبة.',
  },
  {
    id: 3,
    question: 'هل يمكنني إرجاع السيارة في فرع مختلف؟',
    answer: 'نعم، نوفر خدمة إرجاع السيارة في فروع مختلفة، وقد تنطبق رسوم إضافية حسب الموقع.',
  },
  {
    id: 4,
    question: 'ما هي سياسة إلغاء الحجز؟',
    answer: 'يمكنك إلغاء الحجز مجاناً قبل 24 ساعة من موعد الاستلام. للإلغاء بعد هذه المدة، قد يتم تطبيق رسوم إلغاء.',
  },
  {
    id: 5,
    question: 'هل تشمل الأسعار التأمين والضرائب؟',
    answer: 'نعم، تشمل الأسعار جميع الضرائب والتأمين الأساسي. يمكنك اختيار باقات تأمين إضافية عند الحجز.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">الأسئلة الشائعة</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            لديك استفسار؟ ربما تجد إجابته هنا
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-right flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </motion.span>
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 pt-2 bg-gray-50 dark:bg-gray-800">
                      <p className="text-gray-600 dark:text-gray-300 text-right">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            لم تجد إجابتك؟ نحن هنا لمساعدتك
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            اتصل بنا
          </a>
        </div>
      </div>
    </section>
  );
}
