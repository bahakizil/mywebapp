"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import { AnimatedArrow } from "@/components/AnimatedSVG";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { ScrollReveal } from "@/components/scroll-reveal"; // Replaced with new scroll-reveal
import { KonamiCode } from "@/components/konami-code";
import { NavigationDots } from "@/src/components/NavigationDots";
import { Section } from "@/src/components/Section";
import { ScrollProvider } from "@/src/providers/ScrollProvider";
import { useParallax } from "@/src/hooks/useParallax";
import { GsapScrollAnimation } from "@/src/components/GsapScrollAnimation";
import { 
  ArrowRight, 
  Download, 
  ExternalLink, 
  Github, 
  Linkedin,
  Brain, 
  Code, 
  Database, 
  LineChart, 
  Book, 
  BookOpen,
  Award, 
  BarChart, 
  UserPlus, 
  PieChart, 
  RefreshCcw, 
  Cpu, 
  Workflow,
  FileText, 
  Video, 
  MessagesSquare, 
  Bot, 
  Upload,
  Calendar, 
  Search, 
  Youtube, 
  Clock, 
  Send, 
  Mail,
  Users,
  Star,
  GitFork,
  Eye,
  Twitter,
  Phone,
  MapPin,
  Heart,
  Share2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import HuggingFaceSpacesSection from "@/components/HuggingFaceSpacesSection";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { FloatingCards } from "@/components/ui/floating-cards";
import { PromptEngineeringDemo } from "@/components/ui/prompt-engineering-demo";
import { JetsonEdgeDemo } from "@/components/ui/jetson-edge-demo";
import { N8NWorkflowDemo } from "@/components/ui/n8n-workflow-demo";
import { InteractiveNeuralNetwork } from "@/components/ui/interactive-neural-network";
import { SectionDivider } from "@/components/ui/section-divider";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaggeredReveal } from "@/components/ui/staggered-reveal";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { Typewriter } from "@/components/ui/typewriter";
import { ContactFormSection } from "@/components/contact-form-section";
import { AITrainingVisualization } from "@/components/ui/ai-training-visualization";
import { ObjectDetectionDemo } from "@/components/ui/object-detection-demo";
import { GitHubActivityBoard } from "@/components/ui/github-activity-board";

// Removed TypewriterComponent due to type issues

const LottiePlayer = dynamic(() => import("react-lottie-player").then(mod => mod.default), {
  ssr: false
});

// Types
interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
}

interface MediumArticle {
  title: string;
  link: string;
  publishedDate?: string;
  pubDate?: string;
  description: string;
  thumbnail?: string;
  image_url?: string;
  categories: string[];
  content?: string;
  views?: number;
  reads?: number;
  claps: number;
  responses?: number;
}

interface LinkedInPost {
  text?: string;
  content?: string;
  date?: string;
  publishedAt?: string;
  likes?: number;
  comments?: number;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  url: string;
  id?: string;
  image_url?: string;
}

// Loading skeleton component
const ProjectSkeleton = () => (
  <div className="w-full max-w-md">
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const ArticleSkeleton = () => (
  <div className="w-full max-w-md">
    <div className="border rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  </div>
);

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();
  const bgParallax = useTransform(scrollY, [0, 1000], [0, -200]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [mediumArticles, setMediumArticles] = useState<MediumArticle[]>([]);
  const [linkedInPosts, setLinkedInPosts] = useState<LinkedInPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize GSAP animations
  const { refreshScrollTrigger } = useGSAPAnimations();
  
  // Parallax effects
  // const bgParallax = useParallax(100); // Replaced with scroll-based parallax
  const contentParallax = useParallax(-50);
  
  // Load static/cached data instead of making API calls
  useEffect(() => {
    async function loadStaticData() {
      try {
        setIsLoading(true);
        // Use the static data endpoint which loads from cached JSON
        const response = await fetch('/api/static-data');
        const data = await response.json();

        if (data && typeof data === 'object') {
          setRepos(data.repos || []);
          setMediumArticles(data.articles || []);
          setLinkedInPosts(data.linkedinPosts || []);
          console.log('📊 Loaded static data from cache');
        } else {
          throw new Error('Invalid data format');
        }
        
      } catch (err) {
        console.error('⚠️ Error loading static data:', err);
        // Set empty arrays as fallback
        setRepos([]);
        setMediumArticles([]);
        setLinkedInPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStaticData();
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);



  return (
    <ScrollProvider>
      <AnimatedGradient />
      <FloatingCards />
      <NavigationDots />
      <KonamiCode />

      {/* Hero Section */}
      <Section id="hero">
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 md:pt-28">
          {/* Background gradient effect with parallax */}
          <motion.div 
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
            style={{ y: bgParallax }}
          />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center gap-8 lg:gap-12 max-w-7xl mx-auto">
              
              {/* Hero Content - Mobile First */}
              <div className="lg:col-span-2 xl:col-span-2 text-center lg:text-left order-1 lg:order-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight"
                >
                  Hi, I'm{" "}
                  <span className="text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Baha KIZIL
                  </span>
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary mb-8 leading-normal"
                >
                  AI Engineer & Mechatronics Student
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-6"
                >
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                    AI Workflow Automation • RAG Systems • Computer Vision • Multi-Agent Systems • FastAPI Development
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="text-muted-foreground text-base md:text-base leading-relaxed mb-8 max-w-2xl lg:max-w-none space-y-4"
                >
                  <p>
                    <Typewriter
                      texts={[
                        "Ambitious AI engineer transforming advanced technologies into practical solutions — from enterprise workflow automation to real-time computer vision systems.",
                        "I develop modular MCP servers, FastAPI backends, and intelligent RAG architectures that power next-generation AI applications.",
                        "Specializing in multi-agent systems, semantic search pipelines, and end-to-end AI solutions that create measurable business impact.",
                        "From fine-tuning YOLO models for smart traffic monitoring to building voice-enabled chatbots — I turn AI research into production-ready systems."
                      ]}
                      speed={80}
                      deleteSpeed={40}
                      pauseTime={3500}
                      className="text-base md:text-base leading-relaxed"
                    />
                  </p>
                  
                  <div className="space-y-3">
                    <p className="font-medium text-foreground">Currently pursuing Mechatronics Engineering at Bahçeşehir University (2020-2025), with hands-on experience in:</p>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Enterprise AI Workflow Automation</strong> - MCP servers, FastAPI backends, LangChain orchestration</li>
                      <li>• <strong>Advanced RAG Systems</strong> - PostgreSQL + PGVector, dynamic embeddings, semantic search</li>
                      <li>• <strong>Computer Vision & Real-time Detection</strong> - YOLO fine-tuning, OpenCV pipelines, smart monitoring</li>
                      <li>• <strong>Multi-Agent AI Systems</strong> - Voice chatbots, STT/TTS integration, conversational AI</li>
                      <li>• <strong>Full-Stack AI Development</strong> - FastAPI, Supabase, React, Docker deployment</li>
                      <li>• <strong>Cloud & Infrastructure</strong> - AWS, Google Cloud, CI/CD, production monitoring</li>
                    </ul>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                    <p className="text-primary font-medium mb-2">🎯 Current Focus</p>
                    <p className="text-sm text-muted-foreground">
                      Building enterprise AI solutions at <strong>Kafein Technology</strong> • Developing semantic CV management systems • 
                      Creating smart agriculture automation with Raspberry Pi 5 • Committed to continuous learning and innovation in AI
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 flex-wrap"
                >
                  <Button asChild className="btn-primary group min-w-[160px] min-h-[48px] px-6 py-3 text-base font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Link href="#projects">
                      View Projects
                      <AnimatedArrow className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="group min-w-[160px] min-h-[48px] px-6 py-3 text-base font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <a href="https://drive.google.com/uc?export=download&id=1GMAQtFtaexvEwoz8SopgW9xGPuIaWGZf" target="_blank" rel="noopener noreferrer">
                      Download CV
                      <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="group min-w-[160px] min-h-[48px] px-6 py-3 text-base font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Link href="#huggingface">
                      🤗 HF Spaces
                      <AnimatedArrow className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="group min-w-[160px] min-h-[48px] px-6 py-3 text-base font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    <Link href="#ai-demos">
                      🎮 Try AI Demos
                      <AnimatedArrow className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Profile Image - Mobile Last */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="order-2 lg:order-1"
              >
                <div className="w-64 h-72 sm:w-72 sm:h-80 lg:w-80 lg:h-96 mx-auto rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl">
                  <Image
                    src="/profile.jpg"
                    alt="Baha Kizil"
                    width={320}
                    height={320}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Location Badge & Social Icons */}
                <div className="flex flex-col items-center gap-3 mt-4">
                  <div className="flex flex-col items-center gap-3">
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
                      transition={{ duration: 0.5, delay: 1.3 }}
                      className="flex items-center justify-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 w-fit"
                    >
                      <Book className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Bahçeşehir University • Mechatronics Eng.</span>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    className="flex items-center gap-2"
                  >
                    <Button variant="ghost" asChild className="min-h-[44px] min-w-[44px] p-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                      <a href="https://github.com/bahakizil" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub Profile">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="ghost" asChild className="min-h-[44px] min-w-[44px] p-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                      <a href="https://linkedin.com/in/bahakizil" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn Profile">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="ghost" asChild className="min-h-[44px] min-w-[44px] p-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                      <a href="mailto:kizilbaha26@gmail.com" className="hover:text-primary transition-colors" aria-label="Email Contact">
                        <Mail className="h-5 w-5" />
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* GitHub Activity Board - Desktop Only */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="hidden xl:block order-3"
              >
                <GitHubActivityBoard />
              </motion.div>

            </div>
          </div>
        </div>
      </Section>

      <ParallaxScroll speed={20} direction="up">
        <SectionDivider />
      </ParallaxScroll>


      {/* Projects Section */}
      <Section id="projects">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                  Featured Projects {repos.length > 0 && `(${repos.length})`}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                  A showcase of my latest work in AI engineering, computer vision, and machine learning.
                </p>
              </div>
            </ScrollReveal>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                {[...Array(6)].map((_, index) => (
                  <ProjectSkeleton key={index} />
                ))}
              </div>
            ) : (
              <StaggeredReveal staggerDelay={0.1} direction="up">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                  {repos.slice(0, 6).map((repo, index) => (
                <a 
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-container animate-card group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:scale-[1.03] duration-300 w-full max-w-md cursor-pointer block"
                  style={{ opacity: 1, visibility: 'visible' }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <Github className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3" />
                        <span>{repo.stargazers_count}</span>
                        <GitFork className="h-3 w-3 ml-2" />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>
                    <h3 className="font-bold mb-2">{repo.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {repo.description || "No description available"}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {repo.language && (
                        <Badge variant="secondary" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                      {repo.topics?.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-primary font-medium flex items-center hover:underline">
                      View on GitHub <ExternalLink className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </a>
                  ))}
                </div>
              </StaggeredReveal>
            )}
            
            {!isLoading && repos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found.</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Blog Section */}
      <Section id="blog">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <ScrollReveal direction="down" delay={0.3}>
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                  Latest Articles {mediumArticles.length > 0 && `(${mediumArticles.length})`}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                  My thoughts and insights on AI engineering, computer vision, and related topics.
                </p>
              </div>
            </ScrollReveal>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                {[...Array(6)].map((_, index) => (
                  <ArticleSkeleton key={index} />
                ))}
              </div>
            ) : (
              <StaggeredReveal staggerDelay={0.15} direction="left">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                  {mediumArticles.slice(0, 6).map((article, index) => (
                <a 
                  key={article.link}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-container animate-card group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:scale-[1.03] duration-300 w-full max-w-md cursor-pointer block"
                  style={{ opacity: 1, visibility: 'visible' }}
                >
                  {(article.thumbnail || article.image_url) && (
                    <div className="aspect-video relative">
                      <Image
                        src={article.thumbnail || article.image_url || ''}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                        <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z"/>
                      </svg>
                      <span className="text-sm text-muted-foreground">
                        {new Date(article.publishedDate || article.pubDate || '').toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {article.description || "Read more about this article..."}
                    </p>
                    
                    {/* Medium Engagement Stats */}
                    {(article.claps > 0 || article.views || article.reads) && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.37 12.91c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm3.74-3.19c-.9-.9-2.35-.9-3.25 0-.9.9-.9 2.35 0 3.25.9.9 2.35.9 3.25 0 .9-.9.9-2.35 0-3.25z"/>
                          </svg>
                          <span>{article.claps.toLocaleString()}</span>
                        </div>
                        {article.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views.toLocaleString()}</span>
                          </div>
                        )}
                        {article.reads && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{article.reads.toLocaleString()}</span>
                          </div>
                        )}
                        {article.responses && article.responses > 0 && (
                          <div className="flex items-center gap-1">
                            <MessagesSquare className="h-4 w-4" />
                            <span>{article.responses}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <span className="text-primary font-medium flex items-center hover:underline">
                      Read on Medium <ExternalLink className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </a>
                  ))}
                </div>
              </StaggeredReveal>
            )}
            
            {!isLoading && mediumArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found.</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <ParallaxScroll speed={30} direction="down">
        <SectionDivider />
      </ParallaxScroll>

      {/* LinkedIn Insights Section */}
      <Section id="insights">
        <div className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <ScrollReveal direction="right" delay={0.4}>
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Latest Insights
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                  Professional insights and thoughts from my LinkedIn posts.
                </p>
              </div>
            </ScrollReveal>

            <StaggeredReveal staggerDelay={0.12} direction="right">
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                {linkedInPosts.slice(0, 6).map((post, index) => (
                <a 
                  key={post.id || index}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-container animate-card group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:scale-[1.03] duration-300 w-full max-w-md cursor-pointer block"
                  style={{ opacity: 1, visibility: 'visible' }}
                >
                  {post.image_url && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.image_url}
                        alt={post.text?.substring(0, 50) + '...' || 'LinkedIn post image'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-600/10 p-2 rounded-full text-blue-600">
                        <Linkedin className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="line-clamp-4 text-sm leading-relaxed">{post.text || post.content || "Professional insight shared on LinkedIn..."}</p>
                    </div>
                    {(post.engagement || post.likes !== undefined) && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          <span>{post.engagement?.likes || post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessagesSquare className="h-4 w-4" />
                          <span>{post.engagement?.comments || post.comments || 0}</span>
                        </div>
                        {post.engagement?.shares && (
                          <div className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            <span>{post.engagement.shares}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <span className="text-blue-600 font-medium flex items-center hover:underline">
                      View on LinkedIn <ExternalLink className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </a>
              ))}
              </div>
            </StaggeredReveal>
            
            {linkedInPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading insights...</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <ParallaxScroll speed={25} direction="up">
        <SectionDivider />
      </ParallaxScroll>

      {/* Hugging Face Spaces Section */}
      <Section id="huggingface">
        <ScrollReveal direction="up" delay={0.5}>
          <HuggingFaceSpacesSection />
        </ScrollReveal>
      </Section>

      <ParallaxScroll speed={35} direction="down">
        <SectionDivider />
      </ParallaxScroll>

      {/* Contact Section */}
      <Section id="contact">
        <ContactFormSection />
      </Section>

      <ParallaxScroll speed={20} direction="up">
        <SectionDivider />
      </ParallaxScroll>

      {/* AI Interactive Demos Section - Moved to bottom as games/minigames */}
      <Section id="ai-demos" className="relative z-10">
        <div className="py-20 bg-background/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            
            {/* AI Demos Showcase */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="text-center mb-16">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-4">
                  Interactive AI Playground
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                  Explore and interact with neural networks, computer vision, and machine learning systems
                </p>
              </div>
            </ScrollReveal>

            {/* Mobile Optimized AI Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {/* Row 1 */}
              <div className="h-[400px] sm:h-[450px]">
                <AITrainingVisualization />
              </div>
              <div className="h-[400px] sm:h-[450px]">
                <ObjectDetectionDemo autoDetect={false} />
              </div>
              <div className="h-[400px] sm:h-[450px] lg:col-span-2 xl:col-span-1">
                <JetsonEdgeDemo />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="h-[400px] sm:h-[450px]">
                <PromptEngineeringDemo />
              </div>
              <div className="h-[400px] sm:h-[450px]">
                <N8NWorkflowDemo />
              </div>
              <div className="h-[400px] sm:h-[450px] lg:col-span-2 xl:col-span-1">
                <InteractiveNeuralNetwork />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </ScrollProvider>
  );
}