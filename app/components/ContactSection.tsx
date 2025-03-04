"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaTelegram } from "react-icons/fa";
import Link from "next/link";

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    status: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ status: "loading", message: "Sending message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          status: "success",
          message: "Thank you for your message! I will get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setFormStatus({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
      console.error("Error sending message:", error);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Send Me a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>

              {formStatus.status && (
                <div
                  className={`mt-4 p-3 rounded-md ${
                    formStatus.status === "success"
                      ? "bg-green-50 text-green-800"
                      : formStatus.status === "error"
                      ? "bg-red-50 text-red-800"
                      : "bg-blue-50 text-blue-800"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FaEnvelope className="w-5 h-5 text-blue-600 mr-4" />
                  <a
                    href="mailto:pcsetia03@gmail.com"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    pcsetia03@gmail.com
                  </a>
                </div>

                <div className="flex items-center">
                  <FaTelegram className="w-5 h-5 text-blue-600 mr-4" />
                  <a
                    href="https://t.me/priscillacs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    @priscillacs03
                  </a>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Connect with me
                  </h4>
                  <div className="flex space-x-4">
                    <Link
                      href="https://www.linkedin.com/in/priscilla-celine/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaLinkedin className="w-6 h-6" />
                    </Link>
                    <Link
                      href="https://github.com/priscillacs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaGithub className="w-6 h-6" />
                    </Link>
                    <Link
                      href="mailto:pcsetia03@gmail.com"
                      className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaEnvelope className="w-6 h-6" />
                    </Link>
                    <Link
                      href="https://t.me/priscillacs03"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaTelegram className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
