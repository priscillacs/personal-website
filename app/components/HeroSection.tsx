"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Software Engineer & Product Manager";
  const typingSpeed = 100;

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(timeout);
    }
  }, [typedText, fullText]);

  return (
    <section className="relative bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight">
              Hi, I'm{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Priscilla Celine
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 h-8">
              {typedText}
              <span className="animate-blink ml-1">|</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-lg">
              Computer Science student at NTU Singapore with experience in
              DevSecOps, software development, and product management.
              Passionate about building efficient and user-centered solutions.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="/assets/resume/resume.pdf"
                target="_blank"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Download Resume
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-blue-100 border-4 border-white shadow-xl">
              <Image
                src="/picture/priscilla.JPG"
                alt="Priscilla Celine"
                fill
                sizes="(max-width: 700px) 16rem, 20rem"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute bottom-0 left-0 right-0 flex justify-center pb-8"
        >
          <a
            href="#about"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-blue-600 hover:text-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 animate-bounce"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
