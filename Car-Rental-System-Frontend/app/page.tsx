'use client';

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import dynamic from 'next/dynamic';

// Import the client component with no SSR
const HomeClient = dynamic(() => import('./home-client'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Header />
      <HomeClient />
      <Footer />
    </>
  );
}
