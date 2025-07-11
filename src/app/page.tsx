import { Navigation } from '@/components/ui/navigation';
import { Hero } from '@/components/ui/hero';
import { Features } from '@/components/ui/features';
import { Footer } from '@/components/ui/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
