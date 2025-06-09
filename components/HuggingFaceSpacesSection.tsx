"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, Heart, Star, TrendingUp, Zap, Filter } from "lucide-react";
import { GsapScrollAnimation } from "@/src/components/GsapScrollAnimation";

interface HuggingFaceSpace {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  likes: number;
  trending_score: number;
  url: string;
  relevance?: number;
}

interface ApiResponse {
  spaces: HuggingFaceSpace[];
  total: number;
  categories: string[];
}

export default function HuggingFaceSpacesSection() {
  const [spaces, setSpaces] = useState<HuggingFaceSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch initial data
  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async (query?: string, category?: string) => {
    const loadingState = query || category ? setSearchLoading : setLoading;
    loadingState(true);
    
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category && category !== 'all') params.append('category', category);
      
      const response = await fetch(`/api/huggingface?${params.toString()}`);
      const data: ApiResponse = await response.json();
      
      setSpaces(data.spaces);
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch spaces:", error);
    } finally {
      loadingState(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && selectedCategory === 'all') {
      await fetchSpaces();
      return;
    }
    await fetchSpaces(searchQuery, selectedCategory);
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    await fetchSpaces(searchQuery, category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'image processing':
      case 'image generation':
        return "🖼️";
      case 'text generation':
      case 'text analysis':
        return "📝";
      case 'object detection':
        return "🎯";
      case 'research':
        return "🔬";
      case 'video generation':
        return "🎬";
      case 'machine learning':
        return "🤖";
      default:
        return "⚡";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'image processing':
      case 'image generation':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'text generation':
      case 'text analysis':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'object detection':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'research':
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case 'video generation':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 'machine learning':
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header */}
        <GsapScrollAnimation animation="fadeIn" className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            🤗 Hugging Face Spaces
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover and explore amazing AI applications and machine learning demos built by the community
          </p>
        </GsapScrollAnimation>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search spaces by name, description, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {getCategoryIcon(category)} {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{spaces.length}</div>
              <p className="text-sm text-muted-foreground">AI Spaces</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{spaces.reduce((sum, s) => sum + s.likes, 0)}</div>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{spaces.filter(s => s.trending_score > 0).length}</div>
              <p className="text-sm text-muted-foreground">Trending</p>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Hugging Face Spaces...</p>
          </div>
        )}

        {/* Spaces Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto justify-items-center">
            {spaces.slice(0, 6).map((space) => (
              <Card key={space.id} className="group hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] w-full max-w-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(space.category)}</span>
                      <Badge className={getCategoryColor(space.category)}>
                        {space.category}
                      </Badge>
                    </div>
                    {space.trending_score > 0 && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {space.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    by <span className="font-medium text-primary">@{space.author}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {space.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{space.likes}</span>
                      </div>
                      {space.relevance && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{space.relevance.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button asChild className="w-full group">
                    <a href={space.url} target="_blank" rel="noopener noreferrer">
                      Try Space
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && spaces.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No spaces found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Unable to load spaces at the moment"}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  fetchSpaces();
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 