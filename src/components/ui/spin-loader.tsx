'use client';

import { LoaderCircle } from 'lucide-react';

export function FullSpinLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <LoaderCircle className="h-8 w-8 animate-spin text-primary text-white"/>
    </div>
  );
}

export function SpinLoaderComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
