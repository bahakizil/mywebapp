"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Github, Link as LinkIcon } from "lucide-react";

import projectsData from "@/src/content/projects.json";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState(
    projectsData.find((p) => p.id === id)
  );

  useEffect(() => {
    // Update project if ID changes
    setProject(projectsData.find((p) => p.id === id));
  }, [id]);

  // Handle not found
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Projects
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <ScrollReveal direction="left">
              <div className="relative aspect-video overflow-hidden rounded-xl border shadow-sm mx-auto md:mx-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold sm:text-4xl">{project.title}</h1>
                <p className="text-lg text-muted-foreground">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-sm rounded-full bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  {project.githubUrl && (
                    <Button asChild>
                      <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        View on GitHub
                      </Link>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button variant="outline" asChild>
                      <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Live Demo
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <Card className="p-6 mt-8">
              <h2 className="text-2xl font-bold mb-4">Project Details</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Related Projects</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {projectsData
                .filter((p) => p.id !== project.id)
                .slice(0, 3)
                .map((relatedProject) => (
                  <Card
                    key={relatedProject.id}
                    className="overflow-hidden group hover:shadow-md transition-all w-full max-w-sm"
                  >
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        width={600}
                        height={400}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">{relatedProject.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                        {relatedProject.description}
                      </p>
                      <Link
                        href={`/projects/${relatedProject.id}`}
                        className="text-primary text-sm font-medium flex items-center mt-2 hover:underline"
                      >
                        View Details <ArrowLeft className="ml-1 h-3 w-3 rotate-180" />
                      </Link>
                    </div>
                  </Card>
                ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}