export const siteConfig = {
  name: "AI Engineer & CV Specialist",
  title: "AI Engineer & Computer Vision Specialist Portfolio",
  description: "Portfolio of an AI Engineer and Computer Vision Specialist showcasing projects, articles, talks, and interactive AI demos.",
  url: "https://aieng-portfolio.com",
  ogImage: "https://aieng-portfolio.com/og.png",
  email: "kizilbaha26@gmail.com",
  author: "Baha Kizil",
  cvPath: "/Users/bahakizil/Desktop/BAHA_KIZIL_CV.pdf",
  links: {
    github: "https://github.com/bahakizil",
    linkedin: "https://linkedin.com/in/bahakizil",
    youtube: "https://youtube.com/bahakizil",
    medium: "https://medium.com/@bahakizil",
    twitter: "https://twitter.com/bahakizil"
  },
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/bahakizil",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/bahakizil",
      icon: "linkedin",
    },
    {
      name: "Medium",
      url: "https://medium.com/@bahakizil",
      icon: "medium",
    },
  ],
};

export const navLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Projects",
    href: "#projects",
  },
  {
    title: "Articles",
    href: "#blog",
  },
  {
    title: "Insights",
    href: "#insights",
  },
  {
    title: "HF Spaces",
    href: "#huggingface",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export type SiteConfig = typeof siteConfig;