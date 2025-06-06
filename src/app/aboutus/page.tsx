'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function AboutUs() {
  const [whatRef, whatInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [missionRef, missionInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [foundersRef, foundersInView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <main className="min-h-screen" role="main" aria-labelledby="about-title">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Background image with overlay */}
        <Image
          src="/images/campus-background.jpg"
          alt="Harvard campus during daytime with students walking around"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        {/* Overlay gradient with reduced opacity */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-blue-800/70" 
          aria-hidden="true"
        />
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.h1 
            id="about-title"
            className="text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Monventa
          </motion.h1>
          <motion.p 
            className="text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Revolutionizing campus lost and found with innovative technology and a commitment to community service.
          </motion.p>
        </div>
      </section>

      {/* What is Monventa Section */}
      <section 
        ref={whatRef}
        className="py-20 bg-white"
        aria-labelledby="what-title"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={whatInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 
              id="what-title" 
              className="text-4xl font-bold text-gray-900 mb-6"
            >
              What is Monventa?
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed">
              Monventa is a digital lost and found platform built specifically for universities. With a focus on simplicity and efficiency, Monventa helps students and staff report, track, and recover lost items through one centralized, intuitive system. Instead of relying on outdated bulletin boards, spreadsheets, or uncoordinated inboxes, Monventa brings everything into one streamlined platform — fast, easy to use, and highly effective.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section 
        ref={missionRef}
        className="py-20 bg-gray-50"
        aria-labelledby="mission-title"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 
                id="mission-title"
                className="text-4xl font-bold text-gray-900 mb-6"
              >
                Our Mission
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed mb-6">
                At Monventa, our mission is to improve the campus experience by offering reliable support during one of the most stressful moments in student life: losing something important. Whether it's a laptop, ID card, or set of keys, we aim to make the recovery process as smooth and stress-free as possible.
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                But the problem extends beyond students. Faculty, campus security, and administrative staff often shoulder the burden of managing manual lost and found systems — typically unstructured, time-consuming, and difficult to scale. Monventa is built to alleviate that burden by digitizing and centralizing the entire process. Our platform simplifies operations for universities while improving results for students — making lost and found smarter, faster, and far more effective.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/campusimage2.jpg"
                alt="Harvard campus during daytime with students walking around"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section 
        ref={foundersRef}
        className="py-20 bg-white"
        aria-labelledby="founders-title"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={foundersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 
              id="founders-title"
              className="text-4xl font-bold text-gray-900 mb-12 text-center"
            >
              Meet the Founders
            </h2>
            <div 
              className="grid md:grid-cols-2 gap-12"
              role="list"
            >
              <div 
                className="text-center"
                role="listitem"
              >
                <div 
                  className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                  role="img"
                  aria-label="Placeholder for Leo's profile photo"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Leo</h3>
                <p className="text-gray-800 mb-4">Applied Mathematics and Economics at Harvard</p>
              </div>
              <div 
                className="text-center"
                role="listitem"
              >
                <div 
                  className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                  role="img"
                  aria-label="Placeholder for CG's profile photo"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">CG</h3>
                <p className="text-gray-800 mb-4">Mathematics at Royal Institute of Technology (KTH)</p>
              </div>
            </div>
            <div className="mt-12 text-lg text-gray-800 leading-relaxed text-center">
              <p className="mb-6">
                As students ourselves, we understand how frustrating and disruptive it can be to lose something important on campus. That's why we set out to create a tool that makes the process of finding and returning lost items easier for everyone. We've designed and coded every part of Monventa ourselves — with a focus on simplicity, reliability, and real impact.
              </p>
              <p className="font-medium text-gray-900">
                Monventa is a product built by students, for students — and we're excited to keep growing it to help campuses everywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 