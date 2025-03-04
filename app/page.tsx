import Image from "next/image";
import Link from "next/link";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillSection";
import ProjectsSection from "./components/ProjectSection";
import ExperienceSection from "./components/ExperienceSection";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  );
}
