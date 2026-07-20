# Milla Hair Studio — Enterprise Digital Storefront

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel&logoColor=white)

An ultra-premium, high-converting digital storefront engineered for **Milla Hair Studio** — a luxury hair salon and boutique studio based in Sidoarjo. Designed with startup-grade aesthetics, hardware-accelerated 60fps micro-animations, and zero-friction lead conversion workflows.

---

## 🌟 Executive Summary

**Milla Hair Studio** represents a modern paradigm shift in boutique luxury commerce. Built to bridge offline artistry with elite digital experiences, this platform combines high-performance server-side architecture with high-end editorial aesthetics.

### Key Objectives
* **Conversion Optimization**: High-intent WhatsApp API integration routing direct lead acquisition with zero friction.
* **Core Web Vitals Excellence**: Engineered for sub-second initial load times, perfect Lighthouse accessibility ratings, and seamless responsiveness across mobile & desktop devices.
* **Luxury UI/UX Aesthetics**: Crafted using glassmorphism, dynamic active scroll tracking, and cinematic Framer Motion orchestrations.

---

## 🏗️ Architecture & Technology Stack

The application is architected around modern web performance patterns and enterprise software engineering principles:

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | Leverages Server-Side Rendering (SSR) & Static Site Generation (SSG) to maximize SEO indexing and achieve optimal LCP/FID metrics. |
| **Language** | **TypeScript** | Ensures strict end-to-end type safety, eliminating runtime errors and maintaining modular component scalability. |
| **Styling** | **Tailwind CSS v4** | Delivers zero-runtime CSS overhead with utility-first responsive layout structures and custom design system variables. |
| **Animations** | **Framer Motion** | Provides hardware-accelerated 60fps animations, staggered entrance sequences, and layout transition primitives via `AnimatePresence`. |
| **Icons & Assets** | **Lucide React** | Lightweight, SVG-based icon system tailored for clean corporate presentation. |

---

## ✨ Key Technical Highlights

### 💎 Glassmorphism & Active Scroll Navigation
* **Sticky Glass Navbar**: Ultra-sleek `backdrop-blur-md` navigation header with adaptive border contrast on scroll.
* **Dynamic Active State**: Real-time section scroll detection (`IntersectionObserver` API) paired with Framer Motion `layoutId` pill indicators.
* **Thumb-Friendly Mobile Drawer**: Ergonomic mobile navigation drawer animated via `AnimatePresence` for fluid touch interactions.

### 🎭 Scroll-Driven Motion Engine
* **Staggered Hero Entrance**: Micro-timed entrance sequences for branding badges, typography, CTA buttons, and social proof counters.
* **Viewport Reveal**: Viewport-triggered scroll animations (`whileInView`) that gently reveal content blocks as users navigate down the page.
* **Interactive Hover Dynamics**: Elevated card physics (`whileHover={{ y: -8 }}`), glowing button interactions, and scale-up dynamics.

### 📋 Dynamic Price List Engine
* **Desktop Categorized Tabs**: Smooth layout transitions without content jump using Framer Motion tab layout coordination.
* **Mobile Accordion System**: Fluid height-measured expand/collapse transitions using `AnimatePresence` for mobile viewport optimization.

### ⚡ Zero-Friction Conversion Routing
* Context-aware WhatsApp API deep links embedded across all services, price lists, and product catalog items for instant client booking.

---

## 🚀 Local Development Setup

Follow these steps to run the application locally on your machine:

### Prerequisites
* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher (or `pnpm` / `yarn`)

### Installation & Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rendirmdhnii/millahairstudio.git
   cd millahairstudio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser to view the application.

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 👨‍💻 Engineering Credits

<table border="0">
  <tr>
    <td width="100" align="center">
      <img src="https://github.com/Rendirmdhnii.png" width="80" height="80" style="border-radius: 50%;" alt="Rendi"/>
    </td>
    <td>
      <strong>Lead Software Engineer</strong><br/>
      <h3>Rendi</h3>
      <p><em>Full-Stack & Frontend Specialist</em></p>
      <a href="https://github.com/Rendirmdhnii">GitHub Profile</a>
    </td>
  </tr>
</table>

---

© 2026 Milla Hair Studio. All rights reserved. Engineered with precision.
