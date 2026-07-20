# Milla Hair Studio — Full-Stack Enterprise Digital Storefront & Management System

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel&logoColor=white)

An ultra-premium, full-stack digital storefront and salon management ecosystem engineered for **Milla Hair Studio** — an elite boutique hair salon based in Sidoarjo. Architected with modern full-stack software engineering paradigms, Supabase relational backend, hardware-accelerated 60fps micro-animations, and high-converting customer acquisition pipelines.

---

## 🌟 Enterprise Overview

**Milla Hair Studio** is not merely a landing page — it is a **Full-Stack Premium Digital Storefront & Management Platform** engineered to bridge luxury offline salon operations with cutting-edge digital infrastructure.

Architected for extreme scalability, data integrity, and high-throughput performance, the system delivers sub-second page delivery, real-time data synchronization, and robust authorization models. It serves as the digital flagship for Milla Hair Studio, offering an omnichannel experience for service reservations, product cataloging, and client management.

### Strategic Pillar Objectives
* **Full-Stack Scalability**: Decoupled, API-first architecture powered by Next.js App Router and Supabase BaaS.
* **Core Web Vitals & SEO Excellence**: Sub-second Initial Server Response (TTFB), optimized Largest Contentful Paint (LCP), and high search visibility.
* **Enterprise Security & Data Protection**: Row Level Security (RLS) policies enforcing zero-trust data access on PostgreSQL tables.
* **Luxury UI/UX Aesthetics**: Hardware-accelerated 60fps animations, glassmorphism UI tokens, and ergonomic responsive layouts.

---

## 🏗️ System Architecture & Technology Stack

The platform implements an end-to-end type-safe enterprise architecture:

```
[ Client Viewport ]  <--->  [ Next.js App Router (SSR/SSG) ]  <--->  [ Supabase BaaS ]
 (Framer Motion UI)           (Server Actions & API Routes)          (PostgreSQL + RLS + Auth)
```

| Component / Layer | Technology | Professional Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | Leverages Server-Side Rendering (SSR) & Static Site Generation (SSG) for lightning-fast TTFB, automated code-splitting, and peak SEO indexing. |
| **Backend-as-a-Service** | **Supabase (PostgreSQL)** | Open-source BaaS delivering enterprise relational database management, Row Level Security (RLS) authorization, secure Auth, and real-time database subscriptions. |
| **Language & Type System** | **TypeScript** | Enforces strict end-to-end type safety across database schemas, API payload models, and client React components. |
| **Design System & Styling** | **Tailwind CSS v4** | Delivers zero-runtime CSS utility classes, custom luxury color tokens, and responsive layout structures without style clutter. |
| **Motion & Interactivity** | **Framer Motion** | Powers hardware-accelerated 60fps micro-animations, staggered layout reveals, and dynamic state transitions via `AnimatePresence`. |
| **Deployment Infrastructure** | **Vercel Platform** | Global Edge Network hosting with automated CI/CD deployment pipelines, instant CDN caching, and serverless runtime capabilities. |

---

## ✨ Key Technical Highlights

### ⚡ Seamless Database & Backend Infrastructure
* **PostgreSQL Relational Engine**: Normalized schema architecture managing treatments, pricing tiers, product catalogs, customer bookings, and membership tiers.
* **Row Level Security (RLS)**: Fine-grained access control policies guaranteeing strict data isolation between public clients and administrative management views.
* **End-to-End Type Safety**: Generated TypeScript definitions synchronized directly with Supabase database schemas.

### 💎 Glassmorphism & Active Scroll Navigation
* **Sticky Glass Header**: Sleek `backdrop-blur-md` navigation bar with dynamic border contrast adaptation during scroll sequences.
* **Scroll-Aware Active State**: Real-time section detection via `IntersectionObserver` paired with Framer Motion `layoutId` pill indicators.
* **Thumb-Friendly Mobile Drawer**: Ergonomic mobile navigation panel featuring fluid `AnimatePresence` slide-in sequences and generous touch targets.

### 🎭 Hardware-Accelerated Motion Engine
* **Staggered Hero Entrance**: Micro-timed entrance orchestrations for brand badges, typography, CTA buttons, and key performance counters.
* **Scroll-Driven Viewport Reveals**: Viewport-triggered scroll animations (`whileInView`) delivering seamless content reveals.
* **Elevated Card Physics**: Hardware-accelerated hover physics (`whileHover={{ y: -8 }}`), glowing button states, and scale transitions.

### 📋 Complex Dynamic Data Mapping
* **Desktop Categorized Tabs**: Smooth layout transitions without layout shift using Framer Motion tab layout primitives.
* **Mobile Accordion Engine**: Fluid height-measured expand/collapse transitions using `AnimatePresence` for mobile viewports.

### 🎯 Zero-Friction Conversion & Reservation Pipeline
* **High-Intent WhatsApp Routing**: Context-aware deep-linking API embedding service details, product SKUs, and booking intent.
* **Extensible Self-Service Engine**: Pre-built API architecture ready for instant expansion into autonomous online booking and QRIS payment integration.

---

## 🚀 Local Development & Environment Setup

Follow this step-by-step guide to configure and run the project in your local development environment:

### Prerequisites
* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher (or `pnpm` / `yarn`)
* **Supabase Account**: (Optional for local DB connection)

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rendirmdhnii/millahairstudio.git
   cd millahairstudio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Supabase project credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser to explore the platform.

5. **Build and verify production bundle**:
   ```bash
   npm run build
   npm run start
   ```

---

## 👨‍💻 Engineering Credits

<table border="0">
  <tr>
    <td width="110" align="center">
      <img src="https://github.com/Rendirmdhnii.png" width="90" height="90" style="border-radius: 50%;" alt="Rendi"/>
    </td>
    <td>
      <strong>Lead Full-Stack Engineer</strong><br/>
      <h3>Rendi</h3>
      <p>GitHub: <a href="https://github.com/Rendirmdhnii">@Rendirmdhnii</a></p>
      <p><strong>Expertise:</strong> Full-Stack Ecosystem (Next.js + Supabase), Cloud Architecture, & Premium UI/UX Engineering.</p>
    </td>
  </tr>
</table>

---

© 2026 Milla Hair Studio. All rights reserved. Architected & Engineered with Precision.
