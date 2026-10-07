import { Hero } from '../components/home/Hero.jsx';
import { Showcase } from '../components/home/Showcase.jsx';
import { Features } from '../components/home/Features.jsx';
import { FinalCTA } from '../components/home/FinalCTA.jsx';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Showcase />
      <Features />
      <FinalCTA />
    </>
  );
}
