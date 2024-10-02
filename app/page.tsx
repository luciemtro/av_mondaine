import Header from "@/app/(homepage)/header/page";
import Hero from "@/app/(homepage)/hero/page";
import Services from "@/app/(homepage)/services/page";
import Valeurs from "@/app/(homepage)/valeurs/page";
import Temoignages from "./(homepage)/temoignages/page";
import About from "./(homepage)/about/page";

export default function Home() {
  return (
    <main className="">
      <Header />
      <Hero />
      <Services />
      <Valeurs />
      <Temoignages />
      <About />
    </main>
  );
}
