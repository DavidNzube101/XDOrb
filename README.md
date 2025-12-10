# XDOrb - Xandeum Analytics Platform

<img src="/Logo.png" alt="XDOrb Logo" width="200" height="auto" />

XDOrb is a comprehensive analytics platform for monitoring and analyzing Xandeum pNodes in real-time.

## Features

### Core Dashboard
- **Real-time Stats**: Live network health, active/inactive node counts, and total rewards
- **Interactive Charts**: Network health trends, validation rates, and performance metrics
- **Customizable Widgets**: Drag-and-drop dashboard with persistent settings

### pNode Management
- **Detailed Directory**: Paginated table with search, filters by status/region
- **Individual Analytics**: Deep-dive pages with historical uptime, storage trends, and reward history
- **Peer Connections**: View connected network peers and latency metrics
- **Alert System**: Real-time notifications for downtime and performance issues

### Advanced Analytics
- **AI-Powered Insights**: Gemini AI analysis for risk prediction and recommendations
- **3D Visualizations**: Interactive storage usage charts with Three.js
- **Gamification**: Leaderboards, badges, and performance challenges
- **Heatmap**: Global pNode distribution with Leaflet maps

### Social & Sharing
- **Bookmarking**: Save favorite pNodes locally
- **Sharing**: Native share API and link generation
- **Embeddable Widgets**: Network status, top nodes, and reward charts for external sites

### Notifications & Themes
- **Browser Alerts**: Push notifications for node status changes
- **Dark/Light Mode**: Automatic theme switching with custom colors (#f9961e, #116b61)
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## View More Features

Visit `/features` for detailed feature breakdowns and demos.

## Live Demo

View the live platform at [https://xdorb.appwrite.network](https://xdorb.appwrite.network)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Charts**: Recharts, Three.js for 3D viz
- **Maps**: Leaflet with React-Leaflet
- **AI**: Google Gemini integration
- **Data**: SWR for caching, 30s real-time updates

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

For full setup instructions, see the deployment guide.