# 🍽️ RestrauBuddy - Frontend

![RestrauBuddy Banner](../assets/banner.png)

RestrauBuddy is a premium, AI-powered restaurant management dashboard designed to optimize operations, predict demand, and enhance the dining experience through data-driven insights.

## 🚀 Features

- **AI Demand Prediction**: Real-time forecasting of customer footfall and dish demand using machine learning.
- **Dynamic Dashboard**: Visual representation of sales trends, inventory efficiency, and revenue analytics.
- **Inventory Management**: Track and manage stock levels with automated alerts.
- **Multilingual Support**: Seamlessly switch between languages for global accessibility.
- **Theme Customization**: Beautiful Light and Dark modes with a premium golden aesthetic.
- **Supabase Integration**: Secure authentication and real-time data persistence.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Vanilla CSS for custom components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Backend Service**: [Supabase](https://supabase.com/)

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd RestrauBuddy/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ML_API_URL=http://localhost:5001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint for code quality.
- `npm run preview`: Preview the production build locally.
