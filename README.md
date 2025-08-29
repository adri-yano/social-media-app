# Instagram-like Social Media App

A modern social media web application built with Next.js and Tailwind CSS, featuring Instagram-like functionality.

## Features Built

### Home/Feed Page (`/home`)
- **Instagram-style feed layout** with posts, stories, and sidebar
- **Interactive posts** with like, comment, and share functionality
- **Stories section** with gradient borders (Instagram-style)
- **Sidebar with user suggestions** and follow buttons
- **Responsive design** that works on desktop and mobile
- **Real-time like counter** with heart animation
- **Comment system** with expandable comments
- **Post captions** with hashtags and emojis

### Profile Page (`/profile`)
- **Instagram-style profile header** with large profile picture
- **User stats** (posts, followers, following) with proper formatting
- **Bio section** with website link
- **Action buttons** (Follow, Message, More options)
- **Posts grid** with hover effects showing likes and comments
- **Profile tabs** (Posts, Saved, Tagged) - Posts tab is active
- **Responsive layout** that adapts to different screen sizes

### Components
- **Post Component**: Full-featured post with interactions
- **ProfileForm Component**: Enhanced profile display
- **Navbar Component**: Instagram-style navigation with search and icons

## Technical Features
- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Client-side interactivity** with React hooks
- **Responsive design** with mobile-first approach
- **Modern UI/UX** following Instagram design patterns

## Pages Structure
```
/
├── home/          # Feed page with posts and stories
├── profile/       # User profile page with posts grid
└── components/    # Reusable components
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Collaboration Notes

This project is being developed collaboratively:
- **Home/Feed Page & Profile Page**: Completed ✅
- **Signup/Login Pages**: To be implemented by team members
- **Post Creation Page**: To be implemented by team members  
- **Backend API**: To be implemented by team members

## Design Features
- Instagram-like color scheme and typography
- Smooth hover animations and transitions
- Proper spacing and layout following Instagram patterns
- Interactive elements with visual feedback
- Mobile-responsive design

## Next Steps for Team
1. Implement authentication system (signup/login)
2. Create post creation/upload functionality
3. Build backend API with database integration
4. Add real-time features (notifications, live updates)
5. Implement direct messaging system
