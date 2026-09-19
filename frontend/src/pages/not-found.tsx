import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <Link className="underline-offset-4 hover:underline" to="/">
        Back home
      </Link>
    </main>
  );
}
