"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Me</h2>
          <div className="text-lg text-gray-600 space-y-4">
            <p>
              A curious soul who finds joy in exploring new experiences, whether
              that's hiking through nature trails, learning a new language,
              getting lost in films and books, or spending hours perfecting a
              crochet project. I thrive on genuine connections and approach
              challenges with creativity and calm determination.
            </p>
            <p>
              My friends know me as someone who stays positive when things get
              chaotic, finding ways to turn unexpected situations into
              opportunities. At heart, I'm simply a person who believes life is
              meant to be lived fully—collecting diverse experiences, embracing
              different perspectives, and appreciating the beauty in both grand
              adventures and quiet moments.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
