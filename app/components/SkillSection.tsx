"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  FaCode,
  FaServer,
  FaCloud,
  FaDatabase,
  FaToolbox,
  FaReact,
  FaPython,
  FaJava,
  FaDocker,
  FaAws,
  FaCertificate,
  FaGoogle,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiMongodb,
  SiKubernetes,
  SiTerraform,
} from "react-icons/si";

const skills = [
  {
    category: "Programming Languages",
    icon: <FaCode className="w-6 h-6" />,
    items: [
      { name: "Python", icon: <FaPython /> },
      { name: "Java", icon: <FaJava /> },
      { name: "JavaScript", icon: <FaCode /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "C", icon: <FaCode /> },
    ],
  },
  {
    category: "Frontend Development",
    icon: <FaReact className="w-6 h-6" />,
    items: [
      { name: "React.js", icon: <FaReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "React Native", icon: <FaReact /> },
      { name: "Tailwind CSS", icon: <FaToolbox /> },
      { name: "Figma", icon: <FaToolbox /> },
    ],
  },
  {
    category: "Backend Development",
    icon: <FaServer className="w-6 h-6" />,
    items: [
      { name: "Node.js", icon: <FaServer /> },
      { name: "Express.js", icon: <FaServer /> },
      { name: "REST APIs", icon: <FaServer /> },
    ],
  },
  {
    category: "Databases",
    icon: <FaDatabase className="w-6 h-6" />,
    items: [
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "PostgreSQL", icon: <FaDatabase /> },
      { name: "MySQL", icon: <FaDatabase /> },
      { name: "Firebase", icon: <FaDatabase /> },
      { name: "Neo4j", icon: <FaDatabase /> },
    ],
  },
  {
    category: "DevSecOps",
    icon: <FaCloud className="w-6 h-6" />,
    items: [
      { name: "AWS", icon: <FaAws /> },
      { name: "Docker", icon: <FaDocker /> },
      { name: "Kubernetes", icon: <SiKubernetes /> },
      { name: "Terraform", icon: <SiTerraform /> },
      { name: "GitHub Actions", icon: <FaToolbox /> },
    ],
  },
];

// Certification data
const certifications = [
  {
    name: "Google IT Automation with Python",
    issuer: "Google",
    icon: <FaGoogle />,
    year: "2024",
  },
  {
    name: "Google Business Intelligence",
    issuer: "Google",
    icon: <FaGoogle />,
    year: "2024",
  },
  {
    name: "Google Project Management",
    issuer: "Google",
    icon: <FaGoogle />,
    year: "2024",
  },
  {
    name: "Google UX Design",
    issuer: "Google",
    icon: <FaGoogle />,
    year: "2024",
  },
  {
    name: "NTU Product Management Experience",
    issuer: "NTU",
    icon: <FaCertificate />,
    year: "2024",
  },
];

export default function SkillsSection() {
  const ref = useRef(null);
  const certRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const isCertInView = useInView(certRef, { once: true, margin: "-100px 0px" });

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

  // Create a balanced grid for skills
  const skillsRowCount = Math.ceil(skills.length / 3); // For a 3-column grid
  const isLastRowIncomplete = skills.length % 3 !== 0;
  const skillsInLastRow = skills.length % 3;

  // Create a balanced grid for certifications
  const isLastCertRowIncomplete = certifications.length % 2 !== 0;

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Technical Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            My technology stack and areas of expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skillGroup, index) => {
            // Check if this is the last item in an incomplete last row
            const isLastSkillItem =
              isLastRowIncomplete && index === skills.length - 1;
            const isCenterOfLastRow = skillsInLastRow === 1; // Only one item in last row

            return (
              <motion.div
                key={index}
                ref={index === 0 ? ref : undefined}
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                  isCenterOfLastRow
                    ? "md:col-span-2 lg:col-span-3 max-w-md mx-auto"
                    : isLastSkillItem && skillsInLastRow === 2
                    ? "lg:col-start-2 lg:col-end-3"
                    : ""
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
                    {skillGroup.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {skillGroup.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
                    >
                      <span className="mr-1">{skill.icon}</span>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Certifications
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional certifications and training
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => {
                // Check if this is the last item in an incomplete last row for certifications
                const isLastCertItem =
                  isLastCertRowIncomplete &&
                  index === certifications.length - 1;

                return (
                  <motion.div
                    key={index}
                    ref={index === 0 ? certRef : undefined}
                    variants={itemVariants}
                    initial="hidden"
                    animate={isCertInView ? "show" : "hidden"}
                    className={`flex items-center bg-gray-100 rounded-lg p-4 ${
                      isLastCertItem ? "md:col-span-2 max-w-md mx-auto" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
                      {cert.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {cert.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cert.issuer} - {cert.year}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
