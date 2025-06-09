"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/src/config/siteConfig";
import { Github, Linkedin, Mail, Send } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

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

    try {
      // Send email using our API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }
      
      setIsSuccess(true);
      toast({
        title: "Message Sent! ✅",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      // Reset form
      e.currentTarget.reset();
    } catch (error) {
      console.error('Email send error:', error);
      toast({
        title: "Something went wrong ❌",
        description: error instanceof Error ? error.message : "Your message couldn't be sent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: "Send Email",
      href: `mailto:${siteConfig.email}`,
      icon: <Mail className="h-6 w-6" />,
    },
    {
      name: "LinkedIn",
      href: siteConfig.links.linkedin,
      icon: <Linkedin className="h-6 w-6" />,
    },
    {
      name: "GitHub",
      href: siteConfig.links.github,
      icon: <Github className="h-6 w-6" />,
    },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Send className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Message Sent Successfully! 🎉</h1>
            <p className="text-gray-600 mb-8">Thank you for reaching out. I'll get back to you as soon as possible.</p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Have a question, project idea, or just want to say hello? I'd love to hear from you.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr] max-w-5xl mx-auto">
          {/* Left Side - Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-600">
                Feel free to reach out through the form or connect with me directly via email or social media.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-4">Connect</h3>
              <div className="space-y-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors p-3 rounded-lg hover:bg-gray-50 border"
                  >
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                      {link.icon}
                    </div>
                    <span className="font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gray-50 border">
              <h3 className="text-xl font-medium mb-2">Location</h3>
              <p className="text-gray-600">Istanbul, Turkey</p>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="p-8 rounded-lg border bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  placeholder="What is your message about?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Please provide as much detail as possible.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}