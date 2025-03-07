"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const projects = [
  {
    title: "Life-Long Learning App",
    description:
      "An AI-driven recommendation system and chatbot using RAG, LLMs, Neo4j Graph DB, and Vector DB for personalized course recommendations.",
    tags: [
      "Next.js",
      "Node.js",
      "Python",
      "FastAPI",
      "Azure",
      "Firebase",
      "Neo4j",
    ],
    // github: "#",
    // demo: "#",
    featured: false,
  },
  {
    title: "Mobile Mall Recommendation App",
    description:
      "A mall-based recommendation engine using React Native and ExpressJS. Built a real-time data pipeline using Firebase and leveraged Scrapy web crawlers for automated mall data collection.",
    tags: ["React Native", "ExpressJS", "Firebase", "Scrapy"],
    github: "https://github.com/priscillacs/Malls-Revision",
    featured: false,
  },
  {
    title: "School Orientation Website",
    description:
      "Developed the frontend for an orientation website using React.js and Tailwind CSS, optimizing UX for 200+ users. Implemented a robust booking and payment system using Stripe API and MongoDB.",
    tags: ["React.js", "Tailwind CSS", "MongoDB", "Stripe API"],
    demo: "http://pintugtd.com/",
    featured: false,
  },
  {
    title: "Interactive Database Query Explorer",
    description:
      "An interactive visualization tool using React.js for exploring disk blocks and query execution plans generated by PostgreSQL. Designed algorithms to parse and analyze physical operator trees.",
    tags: ["React.js", "PostgreSQL", "Data Visualization"],
    demo: "https://drive.google.com/drive/u/1/folders/1Uf5KAALyPgBIkNYIYFq0uGtZZdM88Giu?hl=ID",
    featured: false,
  },
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Projects</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A selection of projects I've worked on
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Featured badge if needed */}
              {project.featured && (
                <div className="p-2 bg-blue-600 text-white text-xs font-semibold text-right">
                  Featured Project
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-3">
                  {project.github && (
                    <Link
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
                    >
                      <FaGithub className="mr-1" /> Code
                    </Link>
                  )}
                  {project.demo && (
                    <Link
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
                    >
                      <FaExternalLinkAlt className="mr-1" /> Demo
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
