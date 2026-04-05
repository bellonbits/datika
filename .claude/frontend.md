# Datika Frontend — Architecture Guide

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **UI Components**: Ant Design 5.x
- **Layout**: TailwindCSS 3.x
- **Animations**: Framer Motion 11.x
- **State**: Zustand (global), React Query (server state)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Code Editor**: Monaco Editor (for assignment submissions)
- **Charts**: Recharts (for dashboards)

## App Router Structure

```
src/app/
├── layout.tsx                  # Root layout (Ant Design ConfigProvider, Providers)
├── page.tsx                    # Landing page
├── globals.css
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── layout.tsx              # Sidebar + header shell
│   ├── student/
│   │   ├── page.tsx            # Student home
│   │   ├── courses/page.tsx    # My courses
│   │   ├── progress/page.tsx   # Learning progress
│   │   └── certificates/page.tsx
│   ├── instructor/
│   │   ├── page.tsx            # Instructor home
│   │   ├── courses/
│   │   │   ├── page.tsx        # Course list
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── ai-tools/page.tsx   # AI content generators
│   │   └── students/page.tsx
│   └── admin/
│       ├── page.tsx
│       ├── users/page.tsx
│       ├── revenue/page.tsx
│       └── content/page.tsx
├── courses/
│   ├── page.tsx                # Public catalog
│   └── [id]/
│       ├── page.tsx            # Course detail
│       └── learn/
│           └── [lessonId]/page.tsx  # Lesson viewer
└── api/                        # Next.js API routes (minimal, proxy to backend)
```

## Design System

### Colors (TailwindCSS config)
- Primary: `#1890ff` (Ant Design blue)
- Secondary: `#52c41a` (success green)
- Background: `#f0f2f5` (light gray)
- Surface: `#ffffff`
- Text Primary: `#1a1a2e`

### Typography
- Headings: Inter / system-ui
- Body: Inter
- Code: JetBrains Mono / monospace

## Component Conventions

- All page components use `'use client'` only when necessary (prefer Server Components)
- Shared UI in `src/components/ui/`
- Feature-specific components co-located with their route
- All forms use React Hook Form with Zod schemas
- Loading states use Ant Design Skeleton or Spin

## Animation Patterns (Framer Motion)

```typescript
// Page entrance
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// Stagger children
const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } }
}
```

## API Integration

- Base URL from `NEXT_PUBLIC_API_URL`
- Axios instance with JWT interceptor (auto-refresh on 401)
- React Query for all data fetching (5-minute stale time)
- Optimistic updates for enrollment, quiz submission

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_APP_NAME=Datika
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
