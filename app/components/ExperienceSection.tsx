"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaBriefcase, FaUsers, FaHandsHelping } from "react-icons/fa";

const workExperiences = [
  {
    title: "DevSecOps Engineer, Intern",
    company: "minden.ai",
    period: "Jan 2024 - Aug 2024",
    description: [
      "Led the migration from Dependabot to RenovateBot across 150 repositories by automating the process with Bash scripts, reducing manual updates by 90%",
      "Developed Datadog dashboards to enhance infrastructure and security monitoring, reducing incident detection time in the Kubernetes cluster",
      "Automated the deployment and CI/CD workflows for infrastructure components using Terraform and GitHub Actions",
      "Optimized AWS EC2 instance types using AWS Cost Explorer and CloudWatch, cutting operational cost by 15%",
    ],
    type: "work",
  },
  {
    title: "DevOps Engineer, Intern",
    company: "Hydra X",
    period: "Nov 2022 - Jan 2023",
    description: [
      "Developed Grafana dashboards integrated with Prometheus for real-time Kubernetes monitoring, ensuring proactive system health checks and enhanced uptime",
      "Automated Grafana dashboard migration and user onboarding with Python scripts to reduce setup time",
      "Conducted a proof of concept using AWS SDK to assess cloud-based scalability and automation, enabling informed decision-making on cloud adoption",
    ],
    type: "work",
  },

  {
    title: "Vice President External",
    company: "NTU Indonesian Orientation Programme",
    period: "Aug 2023 - Aug 2024",
    description: [
      "Supervised 23 committee members in delivering publication materials for social media platforms",
      "Led a team of 16 committee members to raise over $7,000—exceeding the target by 20%—for the first time after 4 years of financial losses, driving sustainability through proactive sponsorship acquisition, fundraising initiatives, and budget management, optimizing resources for program enhancement and operational efficiency for 250 participant",
      "Provided leadership and mentorship to 6 main committee members, offering constructive feedback, and facilitating open communication channels to foster collaboration and maximize team performance",
    ],
    type: "leadership",
  },
  {
    title: "Technology Director",
    company: "NTU Indonesian Orientation Programme",
    period: "Aug 2022 - Aug 2023",
    description: [
      "Led a team of 10 members throughout the entire web development lifecycle, fostering collaboration and knowledge sharing among senior and junior developers by implementing pair programming system",
      "Spearheaded the UI/UX wireframing process and led the initial project setup to established a robust foundation for development",
      "Monitored the progress of team members, providing guidance and support to ensure timely completion of tasks and adherence to quality standards",
      "Developed frontend of the orientation website using ReactJS and Bootstrap, ensuring optimal user experience for 200+ freshmen and seniors",
    ],
    type: "leadership",
  },
];

export default function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [activeTab, setActiveTab] = useState("work");

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

  // Filter by type
  const workExperience = workExperiences.filter((exp) => exp.type === "work");
  const leadershipExperience = workExperiences.filter(
    (exp) => exp.type === "leadership"
  );

  // Tab styling
  const getTabStyle = (tabName) => {
    return `px-6 py-3 text-lg font-medium rounded-t-lg transition duration-200 ${
      activeTab === tabName
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;
  };

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Experience</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            My professional journey and contributions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("work")}
              className={getTabStyle("work")}
            >
              <div className="flex items-center">
                <FaBriefcase className="mr-2" />
                Work
              </div>
            </button>
            <button
              onClick={() => setActiveTab("leadership")}
              className={getTabStyle("leadership")}
            >
              <div className="flex items-center">
                <FaUsers className="mr-2" />
                Leadership
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div ref={ref} className="mx-auto max-w-4xl">
          {/* Work Experience */}
          {activeTab === "work" && (
            <motion.div
              key="work"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="relative border-l-2 border-blue-200 pl-8 space-y-8 ml-3"
            >
              <div className="flex items-center mb-8">
                <FaBriefcase className="text-blue-600 w-6 h-6 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Work Experience
                </h3>
              </div>

              {workExperience.map((experience, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="absolute -left-[41px] mt-1.5 w-6 h-6 rounded-full bg-blue-500 border-4 border-white" />
                  <div className="mb-1 text-blue-600 font-semibold">
                    {experience.period}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {experience.title}
                  </h4>
                  <div className="text-gray-600 font-medium mb-3">
                    {experience.company}
                  </div>
                  <ul className="space-y-2">
                    {experience.description.map((item, idx) => (
                      <li key={idx} className="text-gray-600 flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Leadership Experience */}
          {activeTab === "leadership" && (
            <motion.div
              key="leadership"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="relative border-l-2 border-blue-200 pl-8 space-y-8 ml-3"
            >
              <div className="flex items-center mb-8">
                <FaUsers className="text-blue-600 w-6 h-6 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Leadership Experience
                </h3>
              </div>

              {leadershipExperience.map((experience, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative"
                >
                  <div className="absolute -left-[41px] mt-1.5 w-6 h-6 rounded-full bg-blue-500 border-4 border-white" />
                  <div className="mb-1 text-blue-600 font-semibold">
                    {experience.period}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {experience.title}
                  </h4>
                  <div className="text-gray-600 font-medium mb-3">
                    {experience.company}
                  </div>
                  <ul className="space-y-2">
                    {experience.description.map((item, idx) => (
                      <li key={idx} className="text-gray-600 flex items-start">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
