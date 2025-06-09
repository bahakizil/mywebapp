"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { StaggeredReveal } from "@/components/ui/staggered-reveal";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Github, Mail, Download, MapPin, Linkedin, ExternalLink,
  Brain, Code, Target, Eye, Zap, Camera
} from "lucide-react";

interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  topics?: string[];
}

export default function About() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);

  useEffect(() => {
    fetch('/api/repos')
      .then(res => res.json())
      .then(data => setRepos(data.slice(0, 4)))
      .catch(console.error);
  }, []);

  const skills = [
    "Computer Vision", "YOLOv8/v11", "OpenCV", "Python", "JavaScript", 
    "React", "Next.js", "FastAPI", "PostgreSQL", "Docker", "AI/ML"
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Profile Header with Animation */}
        <ScrollReveal direction="down" delay={0.2}>
          <div className="text-center mb-12">
            {/* Animated Profile Card */}
            <div className="max-w-md mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-xl backdrop-blur-sm">
              {/* Profile Image with Status */}
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-3 border-primary/30 shadow-lg p-1 bg-gradient-to-br from-primary/20 to-primary/10">
                  <Image
                    src="/profile.jpg"
                    alt="Baha Kizil"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>

              </div>
              
              {/* Name and Title */}
              <h1 className="text-2xl font-bold mb-1">Baha Kizil</h1>
              <p className="text-primary font-semibold mb-3">AI Engineer & Computer Vision Specialist</p>
              
              {/* Location */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-3 h-3" />
                <span>Istanbul, Turkey</span>
              </div>
              

            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-3 flex-wrap">
              <Button asChild>
                <a href="mailto:kizilbaha26@gmail.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/api/download-cv" download>
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="https://linkedin.com/in/bahakizil" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="https://github.com/bahakizil" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* About Me */}
        <ScrollReveal direction="left" delay={0.3}>
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                About Me
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm a passionate AI Engineer specializing in computer vision and real-time detection systems. 
                  My expertise lies in developing intelligent solutions that can understand and analyze visual data 
                  in real-time scenarios.
                </p>
                <p>
                  Currently focused on building production-grade AI systems using YOLOv8/v11, OpenCV, and modern 
                  ML frameworks. I enjoy working on challenging problems like traffic analysis, surveillance systems, 
                  and automated monitoring solutions.
                </p>
                <p>
                  When I'm not coding, I share my knowledge through technical writing on Medium and LinkedIn, 
                  contributing to the AI community with insights and practical tutorials.
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Focus Areas */}
        <ScrollReveal direction="right" delay={0.4}>
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Focus Areas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Computer Vision</h3>
                  <p className="text-sm text-muted-foreground">Real-time object detection and analysis</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">AI Engineering</h3>
                  <p className="text-sm text-muted-foreground">Production-ready ML systems</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Traffic Analysis</h3>
                  <p className="text-sm text-muted-foreground">Smart monitoring solutions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Skills */}
        <ScrollReveal direction="up" delay={0.5}>
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="w-6 h-6 text-primary" />
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Featured Repositories */}
        <ScrollReveal direction="up" delay={0.6}>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Github className="w-6 h-6 text-primary" />
                Featured Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <div key={repo.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold truncate">{repo.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{repo.stars}</span>
                        <span>⭐</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{repo.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                      <a 
                        href={repo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        View Project <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}