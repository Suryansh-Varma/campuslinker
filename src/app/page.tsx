'use client';

import React, { useEffect } from 'react';
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { LazyMotion, domAnimation, m } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LandingPage() {
  const { user } = useUser();
  const router = useRouter();

  // Optional: Auto-redirect signed-in users to dashboard
  // Uncomment if you want this behavior
  useEffect(() => {
    if (user) {
       router.push("/dashboard");
     }
 }, [user]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-white text-gray-800">

        {/* Hero Section */}
        <section className="text-center py-20 bg-gradient-to-b from-blue-100 to-blue-50">
          <m.div initial="hidden" animate="show" variants={fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Showcase Your Talent. Connect. Collaborate. Get Discovered.
            </h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto mb-6">
              SkilLoop helps students display their skills and projects, join campus collaborations, and get noticed by recruiters.
            </p>
          </m.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Student Profiles',
                desc: 'Highlight your skills, projects, certificates, and experiences.',
                bg: 'bg-blue-100',
              },
              {
                title: 'Collaboration Boards',
                desc: 'Find peers to join clubs, competitions, and freelance projects.',
                bg: 'bg-green-100',
              },
              {
                title: 'Micro-Gigs',
                desc: 'Offer or join paid student gigs across campuses.',
                bg: 'bg-yellow-100',
              },
              {
                title: 'Recruiter Access',
                desc: 'Let companies and clubs discover student talent directly.',
                bg: 'bg-purple-100',
              },
            ].map((feature, index) => (
              <m.div
                key={index}
                className={`p-6 ${feature.bg} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
              </m.div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6 bg-gray-100 max-w-6xl mx-auto">
          <m.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Why Skilloop?</h2>
            <p className="text-lg">
              Unlike LinkedIn, SkilLoop is built specifically for students. Whether you're an artist, coder, organizer, or speaker —
              you deserve to be seen. We connect offline student communities with online opportunities.
            </p>
          </m.div>
        </section>

        {/* Developers Section */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12">Developers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            {[
              {
                title: 'Balaji',
                desc: 'I am a passionate developer who loves building cool things.',
                bg: 'bg-pink-100',
              },
              {
                title: 'Suryansh',
                desc: 'I’m a creative thinker and a lover of clean, efficient code.',
                bg: 'bg-black text-white',
              },
            ].map((dev, index) => (
              <m.div
                key={index}
                className={`p-6 ${dev.bg} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h3 className="font-semibold text-xl mb-2">{dev.title}</h3>
                <p>{dev.desc}</p>
              </m.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-blue-50 text-center text-gray-600 text-sm">
          © 2025 SkilLoop. Connect. Collaborate. Get Discovered.
        </footer>
      </div>
    </LazyMotion>
  );
}
