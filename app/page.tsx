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
const NavigationDots = dynamic(() => import("@/src/components/NavigationDots").then(mod => ({ default: mod.NavigationDots })), { ssr: false });
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
const AnimatedGradient = dynamic(() => import("@/components/ui/animated-gradient").then(mod => ({ default: mod.AnimatedGradient })), { ssr: false });
// Dynamic imports for components that use Math.random to prevent hydration issues
const FloatingCards = dynamic(() => import("@/components/ui/floating-cards").then(mod => ({ default: mod.FloatingCards })), { ssr: false });
const PromptEngineeringDemo = dynamic(() => import("@/components/ui/prompt-engineering-demo").then(mod => ({ default: mod.PromptEngineeringDemo })), { ssr: false });
const JetsonEdgeDemo = dynamic(() => import("@/components/ui/jetson-edge-demo").then(mod => ({ default: mod.JetsonEdgeDemo })), { ssr: false });
const N8NWorkflowDemo = dynamic(() => import("@/components/ui/n8n-workflow-demo").then(mod => ({ default: mod.N8NWorkflowDemo })), { ssr: false });
const InteractiveNeuralNetwork = dynamic(() => import("@/components/ui/interactive-neural-network").then(mod => ({ default: mod.InteractiveNeuralNetwork })), { ssr: false });
import { SectionDivider } from "@/components/ui/section-divider";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaggeredReveal } from "@/components/ui/staggered-reveal";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { Typewriter } from "@/components/ui/typewriter";
import { ContactFormSection } from "@/components/contact-form-section";
const AITrainingVisualization = dynamic(() => import("@/components/ui/ai-training-visualization").then(mod => ({ default: mod.AITrainingVisualization })), { ssr: false });
const ObjectDetectionDemo = dynamic(() => import("@/components/ui/object-detection-demo").then(mod => ({ default: mod.ObjectDetectionDemo })), { ssr: false });

// Removed TypewriterComponent due to type issues

// Removed LottiePlayer to prevent hydration issues

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
  shares?: number;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  url: string;
  id?: string;
  image_url?: string;
}

interface GitHubStats {
  pinnedRepos: Array<{
    name: string;
    description: string;
    stars: number;
    language: string;
  }>;
  contributionChart: {
    totalContributions: number;
    currentStreak: number;
    weeklyData: number[];
    lastYearContributions: number;
  };
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
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
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
          console.log('📊 Raw API Data:', data);
          console.log('📊 Repos count:', data.repos?.length || 0);
          console.log('📊 Articles count:', data.articles?.length || 0);
          console.log('📊 LinkedIn posts count:', data.linkedinPosts?.length || 0);
          
          setRepos(data.repos || []);
          setMediumArticles(data.articles || []);
          setLinkedInPosts(data.linkedinPosts || []);
          setGithubStats(data.githubStats || null);
          console.log('📊 State updated - Loading completed');
        } else {
          throw new Error('Invalid data format');
        }
        
      } catch (err) {
        console.error('⚠️ Error loading static data:', err);
        // Set empty arrays as fallback
        setRepos([]);
        setMediumArticles([]);
        setLinkedInPosts([]);
        setGithubStats(null);
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

  // Prioritize pinned repositories
  const getPrioritizedRepos = () => {
    if (!githubStats?.pinnedRepos) return repos.slice(0, 6);
    
    const pinnedNames = githubStats.pinnedRepos.map(p => p.name);
    
    // First, get pinned repos from the repos list
    const pinnedRepos = repos.filter(repo => pinnedNames.includes(repo.name));
    
    // Then get non-pinned repos
    const nonPinnedRepos = repos.filter(repo => !pinnedNames.includes(repo.name));
    
    // Combine: pinned first, then highest starred non-pinned repos
    const prioritizedRepos = [
      ...pinnedRepos,
      ...nonPinnedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count)
    ];
    
    return prioritizedRepos.slice(0, 6);
  };

  return (
    <ScrollProvider>
      <AnimatedGradient />
      <FloatingCards />
      <NavigationDots />
      {/* <KonamiCode /> Temporarily disabled to isolate DOM error */}

      {/* Hero Section */}
      <Section id="hero">
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 md:pt-28">
          {/* Background gradient effect with parallax */}
          <motion.div 
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"
            style={{ y: bgParallax }}
          />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto">
              
              {/* Profile Image - Desktop Left */}
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
                    className="object-cover w-full h-full"
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

              {/* Hero Content - Desktop Right */}
              <div className="lg:col-span-1 text-center lg:text-left order-2 lg:order-2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-[1.1]"
                >
                  <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-muted-foreground mb-2">Hi, I'm</span>
                  <span className="text-foreground font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    Baha KIZIL
                  </span>
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-8 leading-tight tracking-tight"
                >
                  AI Engineer
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-8"
                >
                  <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
                    Building intelligent systems that transform complex problems into scalable AI solutions
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-2xl"
                >
                  <Typewriter
                    texts={[
                      "Developing enterprise AI workflows with MCP servers, FastAPI backends, and LangChain orchestration.",
                      "Expert in computer vision, semantic search, and RAG architectures for production-ready solutions.",
                      "Specializing in advanced RAG systems with PostgreSQL + PGVector and real-time conversation flows."
                    ]}
                    speed={60}
                    deleteSpeed={30}
                    pauseTime={3500}
                    className="text-sm md:text-base leading-relaxed font-light"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-8 flex-wrap"
                >
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group min-w-[180px] min-h-[56px] px-8 py-4 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="#projects">
                      View Projects
                      <AnimatedArrow className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="group min-w-[180px] min-h-[56px] px-8 py-4 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-2 hover:bg-accent transition-all duration-300">
                    <a href="https://drive.usercontent.google.com/download?id=1GMAQtFtaexvEwoz8SopgW9xGPuIaWGZf&export=download" target="_blank" rel="noopener noreferrer">
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
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                  {getPrioritizedRepos().slice(0, 6).map((repo, index) => (
                <a 
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-container animate-card group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm text-card-foreground shadow-lg transition-all hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:scale-[1.05] duration-500 w-full max-w-md cursor-pointer block"
                  style={{ opacity: 1, visibility: 'visible' }}
                >
                  <div className="aspect-video relative">
                    <div 
                      className="bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                    >
                      <div className="text-center">
                        <Github className="h-12 w-12 text-primary/60 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground font-medium">{repo.language || 'Repository'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-xl text-primary shadow-lg">
                        <Github className="h-5 w-5" />
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                        {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {repo.name.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {repo.description || "Read more about this project..."}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full">
                        <GitFork className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{repo.forks_count}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full">
                        <Eye className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{repo.watchers_count}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center text-primary font-medium group-hover:text-primary/80 transition-colors pt-2">
                      <span>View on GitHub</span>
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
                </a>
                ))}
              </div>
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
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                  {mediumArticles.slice(0, 6).map((article, index) => (
                <a 
                  key={article.link}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-container animate-card group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm text-card-foreground shadow-lg transition-all hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/50 hover:scale-[1.05] duration-500 w-full max-w-md cursor-pointer block"
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
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-br from-green-600/20 to-green-600/10 p-3 rounded-xl text-green-600 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z"/>
                        </svg>
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                        {new Date(article.publishedDate || article.pubDate || '').toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {article.description || "Read more about this article..."}
                      </p>
                    </div>
                    
                    {/* Medium Engagement Stats */}
                    {(article.claps > 0 || article.views || article.reads) && (
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full">
                          <svg className="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.37 12.91c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm3.74-3.19c-.9-.9-2.35-.9-3.25 0-.9.9-.9 2.35 0 3.25.9.9 2.35.9 3.25 0 .9-.9.9-2.35 0-3.25z"/>
                          </svg>
                          <span className="font-medium">{article.claps.toLocaleString()}</span>
                        </div>
                        {article.views && (
                          <div className="flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-full">
                            <Eye className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">{article.views.toLocaleString()}</span>
                          </div>
                        )}
                        {article.reads && (
                          <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{article.reads.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center text-green-600 font-medium group-hover:text-green-500 transition-colors pt-2">
                      <span>Read on Medium</span>
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
                </a>
                ))}
              </div>
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
                  Latest Insights {linkedInPosts.length > 0 && `(${linkedInPosts.length})`}
                </h2>
                <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                  Professional insights and thoughts from my LinkedIn posts.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                {linkedInPosts.slice(0, 12).map((post, index) => (
                <a 
                  key={post.id || index}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-container animate-card group relative overflow-hidden rounded-xl border bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm text-card-foreground shadow-lg transition-all hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 hover:scale-[1.05] duration-500 w-full max-w-md cursor-pointer block"
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
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/10 p-3 rounded-xl text-blue-600 shadow-lg">
                        <Linkedin className="h-5 w-5" />
                      </div>
                      <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                    
                    <div>
                      <p className="line-clamp-4 text-sm leading-relaxed text-foreground">
                        {post.text || post.content || "Professional insight shared on LinkedIn..."}
                      </p>
                    </div>
                    
                    {(post.engagement || post.likes !== undefined) && (
                      <div className="flex items-center justify-center gap-6 text-sm">
                        <div className="flex items-center gap-1 bg-red-500/10 px-3 py-1 rounded-full">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{post.engagement?.likes || post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full">
                          <MessagesSquare className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{post.engagement?.comments || post.comments || 0}</span>
                        </div>
                        {(post.engagement?.shares || post.shares) ? (
                          <div className="flex items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full">
                            <Share2 className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{post.engagement?.shares || post.shares || 0}</span>
                          </div>
                        ) : null}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-500 transition-colors pt-2">
                      <span>View on LinkedIn</span>
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl" />
                </a>
            ))}
            </div>
            
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