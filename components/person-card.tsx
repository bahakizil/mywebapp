"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Building, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PersonCardProps {
  className?: string;
  compact?: boolean;
}

export function PersonCard({ className, compact = false }: PersonCardProps) {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/bahakizil",
      username: "@bahakizil",
      color: "text-gray-700 dark:text-gray-300"
    },
    {
      name: "LinkedIn", 
      icon: Linkedin,
      href: "https://linkedin.com/in/bahakizil",
      username: "bahakizil",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:kizilbaha26@gmail.com",
      username: "kizilbaha26@gmail.com",
      color: "text-red-600 dark:text-red-400"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg p-4 space-y-3",
        "border-border/50 hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-muted-foreground">Available for work</span>
        </div>
        
        <div>
          <h3 className="font-bold text-lg">Baha Kizil</h3>
          <p className="text-sm text-muted-foreground font-mono">@bahakizil</p>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          🤖 AI Engineer & Computer Vision Specialist. Building intelligent systems with YOLO, OpenCV, and modern ML frameworks.
        </p>
      </div>

      {/* Location & Role */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Building className="w-3 h-3" />
          <span>AI Engineer</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>Istanbul, Turkey</span>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <p className="text-xs font-medium">Focus Areas</p>
        <div className="flex flex-wrap gap-1">
          {["Computer Vision", "YOLOv8", "Real-time AI", "Traffic Analysis"].map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-1">
        {socialLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
            >
              <IconComponent className="w-3 h-3" />
              <span>{link.username}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button size="sm" className="flex-1 text-xs" asChild>
          <a href="mailto:kizilbaha26@gmail.com">
            <Mail className="w-3 h-3 mr-1" />
            Contact
          </a>
        </Button>
        <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
          <a href="/api/download-cv" download>
            Download CV
          </a>
        </Button>
      </div>
    </motion.div>
  );
} 