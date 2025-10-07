'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

export default function AboutUs() {
  const [whatRef, whatInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [missionRef, missionInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [foundersRef, foundersInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [howItWorksRef, howItWorksInView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  // Typewriter effect for the title
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'We service universities, schools, gyms and many other organizations. Get in touch for pricing and implementation.';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setShowCursor(false); // Hide cursor when typing is complete
      }
    }, 30); // Speed of typing

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen" role="main" aria-labelledby="about-title">
      {/* Hero Section */}
      <section 
        className="relative h-[30vh] flex items-center justify-center overflow-hidden"
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
            Monventa
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

      {/* Contact Button Section */}
      <section className="pt-6 pb-0 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Contact Information */}
            <div className="text-center">
              <motion.h2 
                className="text-3xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {displayText}
                {showCursor && <span className="animate-pulse">|</span>}
              </motion.h2>
              <motion.button
                onClick={() => {
                  const subject = encodeURIComponent('Monventa - Pricing, Implementation and Service Inquiry');
                  const body = encodeURIComponent('Hello,\n\nI am interested in learning more about Monventa for our institution.\n\nPlease provide information about your organization:\n- Type of institution (university, school, gym, etc.)\n- Location\n- Size (number of students/members)\n\nThank you for your interest. We will get back to you with information about the implementation of Monventa at your organization.\n\nBest regards,\n[Your Name]');
                  window.open(`mailto:support@monventa.com?subject=${subject}&body=${body}`);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Contact Us
              </motion.button>
            </div>
            
            {/* Right Column - Video */}
            <div className="flex justify-center">
              <motion.div
                className="relative w-full max-w-md rounded-lg overflow-hidden shadow-xl border-2 border-gray-300"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto rounded-lg"
                  onLoadStart={() => console.log('Video loading started')}
                  onCanPlay={() => console.log('Video can play')}
                  onError={(e) => console.error('Video error:', e)}
                  onEnded={(e) => {
                    // Pause for 3 seconds after each loop
                    const video = e.target as HTMLVideoElement;
                    setTimeout(() => {
                      video.play();
                    }, 3000);
                  }}
                >
                  <source src="/images/websitevideo.mov" type="video/quicktime" />
                  <source src="/images/websitevideo.mov" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How Monventa Works Section */}
      <section ref={howItWorksRef} className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              How It Works
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="text-center cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.1 }
              }}
              whileLeave={{ 
                scale: 1,
                transition: { duration: 0.05 }
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4
              }}
            >
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-lg bg-gray-50">
                <Image
                  src="/images/tutorial1.png"
                  alt="Step 1: Report a lost item"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1</h3>
              <p className="text-gray-600">Admin logs recovered items</p>
            </motion.div>
            
            <motion.div 
              className="text-center cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.1 }
              }}
              whileLeave={{ 
                scale: 1,
                transition: { duration: 0.05 }
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.8
              }}
            >
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-lg bg-gray-50">
                <Image
                  src="/images/tutorial2.png"
                  alt="Step 2: Search for items"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2</h3>
              <p className="text-gray-600">Users browse recovered items</p>
            </motion.div>
            
            <motion.div 
              className="text-center cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.1 }
              }}
              whileLeave={{ 
                scale: 1,
                transition: { duration: 0.05 }
              }}
              transition={{ 
                duration: 0.6, 
                delay: 1.2
              }}
            >
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-lg bg-gray-50">
                <Image
                  src="/images/tutorial3.png"
                  alt="Step 3: Contact and verify"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3</h3>
              <p className="text-gray-600">Contact relevant location</p>
            </motion.div>
            
            <motion.div 
              className="text-center cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.1 }
              }}
              whileLeave={{ 
                scale: 1,
                transition: { duration: 0.05 }
              }}
              transition={{ 
                duration: 0.6, 
                delay: 1.6
              }}
            >
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden shadow-lg bg-gray-50">
                <Image
                  src="/images/tutorial4.png"
                  alt="Step 4: Reunite with your item"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 4</h3>
              <p className="text-gray-600">Lost item is returned to user</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Monventa Section */}
      <section 
        ref={whatRef}
        className="pt-8 pb-20 bg-white"
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
              Monventa is a digital lost and found platform built specifically for universities. With a focus on simplicity and efficiency, Monventa helps students and staff report, track, and recover lost items through one centralized, intuitive system. Instead of relying on outdated bulletin boards, spreadsheets, or uncoordinated inboxes, Monventa brings everything into one streamlined platform &mdash; fast, easy to use, and highly effective.
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
                At Monventa, our mission is to improve the campus experience by offering reliable support during one of the most stressful moments in student life: losing something important. Whether it&apos;s a laptop, ID card, or set of keys, we aim to make the recovery process as smooth and stress-free as possible.
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                But the problem extends beyond students. Faculty, campus security, and administrative staff often shoulder the burden of managing manual lost and found systems &mdash; typically unstructured, time-consuming, and difficult to scale. Monventa is built to alleviate that burden by digitizing and centralizing the entire process. Our platform simplifies operations for universities while improving results for students &mdash; making lost and found smarter, faster, and far more effective.
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

      {/* Meet the Founders Section - HIDDEN FOR NOW */}
      {/* <section 
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Carl Gustaf</h3>
                <p className="text-gray-800 mb-4">Mathematics at Royal Institute of Technology (KTH)</p>
              </div>
            </div>
            <div className="mt-12 text-lg text-gray-800 leading-relaxed text-center">
              <p className="mb-6">
                As students ourselves, we understand how frustrating and disruptive it can be to lose something important on campus. That&apos;s why we set out to create a tool that makes the process of finding and returning lost items easier for everyone. We&apos;ve designed and coded every part of Monventa ourselves &mdash; with a focus on simplicity, reliability, and real impact.
              </p>
              <p className="font-medium text-gray-900">
                Monventa is a product built by students, for students &mdash; and we&apos;re excited to keep growing it to help campuses everywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section> */}
    </main>
  );
} 