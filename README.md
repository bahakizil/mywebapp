# AI Engineer & Computer Vision Specialist Portfolio

A modern, blazing-fast personal portfolio website for an AI Engineer & Computer Vision Specialist, built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Features

- Next.js 14 App Router with React 18 and TypeScript
- Responsive design with Tailwind CSS
- shadcn/ui components and Radix UI primitives
- Framer Motion animations and transitions
- Dark/light mode with next-themes
- MDX for blog content
- Typewriter effect on homepage
- GitHub integration for "Now Building" section
- PWA support with next-pwa
- Email integration with Resend
- Interactive AI demos section
- SEO optimization with dynamic OG images

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-engineer-portfolio.git
   cd ai-engineer-portfolio
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory with your API keys (see `.env.example`):
   ```
   RESEND_API_KEY=your_resend_api_key
   OG_IMAGE_SECRET=your_og_image_secret
   GITHUB_API_TOKEN=your_github_api_token
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

The easiest way to deploy this portfolio is through Vercel:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up or log in.
3. Click "New Project" and import your repository.
4. Add your environment variables.
5. Click "Deploy".

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared code
- `/public` - Static assets
- `/src/content` - Content files (projects, talks, blog posts)
- `/src/config` - Site configuration

## Customization

### Site Configuration

Edit `/src/config/siteConfig.ts` to update your name, social links, and site metadata.

### Content Management

- **Projects**: Update `/src/content/projects.json` to add or modify projects.
- **Talks**: Update `/src/content/talks.json` to add or modify talks.
- **Blog**: Add or edit MDX files in `/src/content/blog`.

### Styling

The design uses a "futuristic minimal" theme with:
- Primary color: #38bdf8
- Accent color: #f472b6
- Neutral colors: #18181b / #f8fafc
- Inter font for UI
- JetBrains Mono for code

Customize these in `tailwind.config.ts` and `app/globals.css`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.