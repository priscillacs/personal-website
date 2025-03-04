import Link from "next/link";
import { FaLinkedin, FaGithub, FaEnvelope, FaTelegram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Priscilla Celine Setiawan. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="https://www.linkedin.com/in/priscilla-celine/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com/priscillacs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:pcsetia03@gmail.com"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Email</span>
              <FaEnvelope className="h-5 w-5" />
            </Link>
            <Link
              href="https://t.me/priscillacs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Telegram</span>
              <FaTelegram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
