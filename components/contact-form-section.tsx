"use client";

import { useState } from "react";
import { ScrollReveal } from "./ui/scroll-reveal";
import { Mail, Linkedin, MapPin, Send } from "lucide-react";
import { Button } from "./ui/button";

export function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    // Validate fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      alert('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Send email using API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Get In Touch
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have a question or want to work together? I'd love to hear from you. 
                Send me a message and I'll respond as soon as possible.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Contact Information */}
            <ScrollReveal direction="left" delay={0.3}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>
                  <div className="space-y-4">
                    <a 
                      href="mailto:kizilbaha26@gmail.com"
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">kizilbaha26@gmail.com</div>
                      </div>
                    </a>
                    
                    <a 
                      href="https://linkedin.com/in/bahakizil" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="bg-blue-600/10 p-2 rounded-full">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">LinkedIn</div>
                        <div className="text-sm text-muted-foreground">Connect with me professionally</div>
                      </div>
                    </a>
                    
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                      <div className="bg-green-600/10 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-sm text-muted-foreground">Istanbul, Turkey</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="right" delay={0.4}>
              <div className="bg-card p-8 rounded-lg border shadow-sm">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                      <div className="text-green-600 dark:text-green-400 text-4xl mb-4">✓</div>
                      <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-green-600 dark:text-green-400">
                        Thank you for your message. I'll get back to you soon!
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="What's this about?"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                          placeholder="Your message..."
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
} 