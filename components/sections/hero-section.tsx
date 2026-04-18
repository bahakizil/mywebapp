"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { Section } from "@/src/components/Section";
import { AnimatedArrow } from "@/components/AnimatedSVG";
import { siteConfig } from "@/src/config/siteConfig";

const TYPEWRITER_TEXTS = [
  "Developing enterprise AI workflows with MCP servers, FastAPI backends, and LangChain orchestration.",
  "Expert in computer vision, semantic search, and RAG architectures for production-ready solutions.",
  "Specializing in advanced RAG systems with PostgreSQL + PGVector and real-time conversation flows.",
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const bgParallax = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Section id="hero">
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 md:pt-28">
        <motion.div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
          style={{ y: bgParallax }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="order-1 lg:order-1"
            >
              <div className="w-48 h-56 sm:w-56 sm:h-64 lg:w-64 lg:h-72 mx-auto rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                <Image
                  src="/profile.jpg"
                  alt="Baha Kizil"
                  width={256}
                  height={288}
                  priority
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col items-center gap-3 mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="flex items-center justify-center gap-2 bg-card/80 backdrop-blur-sm border rounded-full px-4 py-2 w-fit"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Istanbul, Turkey</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                  className="flex items-center gap-2"
                >
                  <Button variant="ghost" asChild className="min-h-[44px] min-w-[44px] p-3">
                    <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" asChild className="min-h-[44px] min-w-[44px] p-3">
                    <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button variant="ghost" asChild className="min-h-[44px] min-w-[44px] p-3">
                    <a href={`mailto:${siteConfig.email}`} aria-label="Email">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <div className="lg:col-span-1 text-center lg:text-left order-2 lg:order-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-[1.1]"
              >
                <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground mb-2">
                  Hi, I&apos;m
                </span>
                <span className="text-foreground font-bold">Baha KIZIL</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-8 leading-tight tracking-tight"
              >
                AI Engineer
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mb-8"
              >
                Building intelligent systems that transform complex problems into scalable AI solutions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-2xl"
              >
                <Typewriter texts={TYPEWRITER_TEXTS} speed={60} deleteSpeed={30} pauseTime={3500} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-8 flex-wrap"
              >
                <Button asChild size="lg" className="group min-w-[180px] min-h-[56px] px-8 py-4 text-lg font-semibold">
                  <Link href="#projects">
                    View Projects
                    <AnimatedArrow className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="group min-w-[180px] min-h-[56px] px-8 py-4 text-lg font-semibold border-2">
                  <a href="/api/download-cv" download>
                    Download CV
                    <Download className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-[-2px]" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
