export const siteConfig = {
  name: "Baha Kızıl — AI Engineer",
  title: "Baha Kızıl · AI Engineer · Multi-Agent Systems & Computer Vision",
  description:
    "Istanbul-based AI engineer building multi-agent systems, RAG pipelines, and computer-vision products. Currently at Cool Digital Solutions.",
  url: "https://bahakizil.vercel.app",
  ogImage: "https://bahakizil.vercel.app/og.png",
  email: "kizilbaha26@gmail.com",
  phone: "+90 535 070 7368",
  location: "Ortaköy · Istanbul · Türkiye",
  coords: "41.05°N · 29.03°E",
  author: "Baha Kızıl",
  cvPath: "/BAHA_KIZIL_CV.pdf",
  currentRole: {
    title: "AI Engineer",
    company: "Cool Digital Solutions",
    since: "2025-09",
  },
  links: {
    github: "https://github.com/bahakizil",
    linkedin: "https://linkedin.com/in/bahakizil",
    medium: "https://medium.com/@bahakizil",
    huggingface: "https://huggingface.co/bahakizil",
  },
  socials: [
    { name: "GitHub", url: "https://github.com/bahakizil", icon: "github" },
    { name: "LinkedIn", url: "https://linkedin.com/in/bahakizil", icon: "linkedin" },
    { name: "Medium", url: "https://medium.com/@bahakizil", icon: "medium" },
  ],
};

export const navLinks = [
  { title: "Home", href: "/" },
  { title: "Work", href: "#projects" },
  { title: "Writing", href: "#blog" },
  { title: "Signal", href: "#insights" },
  { title: "Demos", href: "#huggingface" },
  { title: "Contact", href: "#contact" },
];

export type SiteConfig = typeof siteConfig;
