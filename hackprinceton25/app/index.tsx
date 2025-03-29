import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // This screen redirects directly to the sign-in screen
  return <Redirect href={'/onboarding/health-info' as any} />;
} 