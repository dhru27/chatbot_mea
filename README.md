# Mechanical Engineering Association Website - IIT Bombay

## Project Overview

This project is a comprehensive website redesign for the Mechanical Engineering Association (MEA) of IIT Bombay. The website serves as a central hub for mechanical engineering students, faculty, and alumni to connect, share resources, and stay updated on department activities.

## Live Demo

The website is deployed and accessible at: [MEA Website](https://mea.netlify.app/)

## Project Requirements

The project was developed to meet the following requirements:

1. Design a light-themed website for the MEA with multiple pages
2. Include key sections such as homepage, gallery, events, resources, and more
3. Maintain consistency through a unified navbar and footer
4. Create a responsive design that works across all devices
5. Implement modern web technologies for optimal performance

## Technology Stack

The website is built using a modern tech stack:

- **React**: For building a component-based UI architecture
- **TypeScript**: For type safety and improved developer experience
- **Tailwind CSS**: For utility-first styling that ensures consistency and rapid development
- **Shadcn UI**: For accessible, customizable UI components
- **React Router**: For seamless client-side navigation
- **Vite**: For fast development and optimized builds

### Why This Stack?

- **Performance**: React's virtual DOM and Vite's build optimization ensure fast load times
- **Maintainability**: TypeScript and component architecture make the codebase easy to maintain
- **Responsive Design**: Tailwind CSS provides built-in responsive utilities
- **Accessibility**: Shadcn UI components are built with accessibility in mind

## Website Structure

The website consists of several key sections:

1. **Home**: Introduction to the MEA with a hero section, mission statement, and quick links
2. **Events**: Calendar of upcoming events and archives of past events
3. **Resources**: Repository of academic resources, tools, and tutorials
4. **Editorial**: Blog posts and newsletters section with embedded flipbook
5. **Gallery**: Visual showcase of department activities and student projects
6. **Team**: Profiles of the current MEA council members
7. **Contact**: Contact form and information for reaching out to the MEA

## Design Philosophy

The website follows a clean, modern design approach with:

- Light theme with high contrast for readability
- Consistent typography and color scheme across all pages
- Strategic use of white space to create visual hierarchy
- Responsive layout that adapts to various screen sizes
- Interactive elements that enhance user engagement

## Deployment

The website is deployed on Vercel for several reasons:

1. Seamless integration with GitHub for continuous deployment
2. Fast global CDN for optimal loading speeds
3. Built-in analytics and performance monitoring
4. Automatic HTTPS for security
5. Free tier that supports all required functionality

## Local Development

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/AaravG42/mea-website.git

# Navigate to the project directory
cd mea-website

# Install dependencies
bun install

# Start the development server
bun run dev
```

## Claude Chatbot Setup

The MEA Assistant uses the existing FastAPI backend as a secure proxy to Claude.

Frontend environment:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Backend environment:

```bash
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
ANTHROPIC_MAX_TOKENS=900
```

Add or update chatbot data in:

```text
backend/app/chatbot/knowledge/
```

The backend loads every `*.md` file in that folder, so new verified course notes, instructor mappings,
slot information, or FAQs can be added without changing code.
