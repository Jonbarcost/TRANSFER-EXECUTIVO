import QuoteForm from '@/components/QuoteForm';
import { SITE } from '@/lib/site';

export default function Home() {
  return (
    <main>
      <header>
        <h1>{SITE.name}</h1>
        <p>{SITE.description}</p>
      </header>
      <QuoteForm />
      <footer>
        <a href="https://www.geoapify.com/" target="_blank" rel="noopener noreferrer">
          Powered by Geoapify
        </a>
      </footer>
    </main>
  );
}
