import { Suspense } from 'react';
import { SignupForm } from './SignupForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </main>
  );
}
