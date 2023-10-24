import { Features } from '@/components/component/features';
import { Hero } from '@/components/component/hero';

export default function IndexPage() {
  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <Hero />
        <Features />
      </section>
    </>
  );
}
