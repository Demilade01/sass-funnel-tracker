# SaaS Analytics Demo - PostHog Funnel Tracker

A demo SaaS analytics and funnel tracker built with Next.js and PostHog. This project simulates a small SaaS product's user journey, from landing on the site, signing up, subscribing to a plan, and finally creating a project.

## Features

- **Funnel Tracking**: Track user conversions at every step of the funnel
- **Event Analytics**: Capture and analyze user interactions in real-time
- **Conversion Optimization**: Identify bottlenecks and optimize conversion rates
- **Marketing Attribution**: Track which channels drive the most signups
- **User Segmentation**: Segment users based on behavior and properties
- **Real-time Insights**: Get instant insights into user behavior and trends

## User Journey

The application tracks the following user journey:

1. **Landing Page** → User visits the homepage
2. **Sign Up** → User creates an account
3. **Pricing** → User views and selects a subscription plan
4. **Checkout** → User completes payment (simulated)
5. **Dashboard** → User creates their first project

## Tech Stack

- **Next.js 16** - React framework with App Router
- **PostHog** - Product analytics platform
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **localStorage** - Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A PostHog account (free at [posthog.com](https://posthog.com))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd posthog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Get your PostHog API key:
   - Sign up at [posthog.com](https://posthog.com) (free)
   - Go to Project Settings → API Keys
   - Copy your Project API Key

5. Update `.env.local` with your PostHog credentials:
```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## PostHog Events Tracked

### Landing Page
- `landing_page_viewed` - When user visits the homepage
- `cta_clicked` - When user clicks a call-to-action button
- `pricing_link_clicked` - When user clicks the pricing link

### Sign Up
- `signup_page_viewed` - When user visits the signup page
- `signup_form_started` - When user starts filling the form
- `signup_form_completed` - When user successfully signs up
- `signup_form_abandoned` - When user leaves without completing

### Pricing
- `pricing_page_viewed` - When user visits the pricing page
- `plan_viewed` - When user views a specific plan
- `plan_selected` - When user selects a plan
- `checkout_initiated` - When user starts checkout

### Checkout
- `checkout_page_viewed` - When user visits the checkout page
- `payment_method_selected` - When user selects a payment method
- `payment_completed` - When user completes payment
- `payment_failed` - When payment fails

### Dashboard
- `dashboard_viewed` - When user visits the dashboard
- `project_creation_started` - When user starts creating a project
- `project_created` - When user creates a project
- `project_viewed` - When user views a project

## Project Structure

```
├── app/
│   ├── dashboard/          # Dashboard and project pages
│   ├── checkout/           # Checkout page
│   ├── pricing/            # Pricing page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout with PostHog provider
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── navigation.tsx      # Navigation component
│   └── posthog-pageview.tsx # Pageview tracking (optional)
├── lib/
│   ├── posthog.tsx         # PostHog initialization
│   ├── tracking.ts         # Event tracking functions
│   ├── storage.ts          # localStorage utilities
│   ├── types.ts            # TypeScript types
│   └── plans.ts            # Subscription plans
└── public/                 # Static assets
```

## How PostHog Works

This project demonstrates several PostHog concepts:

1. **Event Tracking**: Custom events are tracked throughout the user journey
2. **User Identification**: Users are identified with their email and name
3. **User Properties**: User properties are set (plan, projects count, etc.)
4. **Marketing Attribution**: UTM parameters are captured and stored
5. **Funnel Analysis**: Events can be analyzed as a funnel in PostHog
6. **Automatic Pageviews**: PostHog automatically tracks pageviews with `defaults: '2025-05-24'`

## Viewing Analytics in PostHog

1. Go to your PostHog dashboard
2. Navigate to **Insights** to see event analytics
3. Create a **Funnel** to analyze the user journey:
   - Landing page viewed
   - Signup form completed
   - Plan selected
   - Payment completed
   - Project created
4. View **Persons** to see individual user journeys
5. Check **Events** to see all tracked events

## Local Storage

The application uses `localStorage` to persist user data locally. This includes:
- User information (email, name, ID)
- Subscription plan
- Projects

To clear all data, you can clear your browser's localStorage or use the browser's developer tools.

## License

This is a demo project for educational purposes.

## Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostHog Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)
