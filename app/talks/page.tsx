"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, Youtube, ExternalLink } from "lucide-react";

import talksData from "@/src/content/talks.json";

export default function TalksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTalks, setFilteredTalks] = useState(talksData);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredTalks(talksData);
      return;
    }
    
    const filtered = talksData.filter(
      (talk) =>
        talk.title.toLowerCase().includes(term) ||
        talk.description.toLowerCase().includes(term) ||
        talk.conference.toLowerCase().includes(term) ||
        talk.location.toLowerCase().includes(term)
    );
    
    setFilteredTalks(filtered);
  };

  // Group talks by year
  const talksByYear = filteredTalks.reduce((acc, talk) => {
    const year = new Date(talk.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(talk);
    return acc;
  }, {} as Record<string, typeof talksData>);

  const years = Object.keys(talksByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <ScrollReveal>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center">
            Talks & Presentations
          </h1>
          <p className="text-muted-foreground text-center mt-4 max-w-3xl mx-auto">
            Conference talks, workshops, and presentations on AI engineering, computer vision, and related topics.
          </p>
        </ScrollReveal>

        <div className="mt-12 space-y-8 max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search talks..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </ScrollReveal>

          {years.length > 0 ? (
            <ScrollReveal>
              <Tabs defaultValue={years[0]} className="w-full">
                <TabsList className="grid grid-cols-3 max-w-md mx-auto">
                  {years.map((year) => (
                    <TabsTrigger key={year} value={year}>
                      {year}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {years.map((year) => (
                  <TabsContent key={year} value={year}>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 justify-items-center">
                      {talksByYear[year].map((talk) => (
                        <Card key={talk.id} className="overflow-hidden group transition-all hover:shadow-lg w-full max-w-md">
                          <div className="aspect-video relative overflow-hidden">
                            <Image
                              src={talk.image}
                              alt={talk.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="icon" className="rounded-full bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-background/30">
                                  <Youtube className="h-6 w-6" />
                                  <span className="sr-only">Watch Video</span>
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(talk.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{talk.title}</h3>
                            <p className="text-muted-foreground mb-4">
                              {talk.description}
                            </p>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                              <span>{talk.conference}</span>
                              <span>{talk.location}</span>
                            </div>
                            <div className="flex gap-4">
                              <Button variant="outline" size="sm" className="gap-1" asChild>
                                <Link href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
                                  <Youtube className="h-4 w-4" />
                                  Watch
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1" asChild>
                                <Link href={talk.slidesUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                  Slides
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </ScrollReveal>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No talks match your search criteria.{" "}
                <Button variant="link" onClick={() => setSearchTerm("")} className="p-0">
                  Clear search
                </Button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}