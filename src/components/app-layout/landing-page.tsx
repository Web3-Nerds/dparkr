'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AppHero from '../app-layout/app-hero';
import AppFeatures from './app-feature';
import AppFooter from './app-footer';

export default function LandingPage() {
  // const { data: session, status } = useSession();
  // const router = useRouter();
  //
  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     router.push('/dashboard');
  //   }
  // }, [status, router]);

  return (
    <div>
      <AppHero />
      <AppFeatures />
      <AppFooter />
    </div>
  );
}
