import { HomeHero } from "@/components/home/HomeHero";
import { Benefits } from "@/components/home/Benefits";
import {
  FeaturedProducts,
  FeaturedTestimonials,
  HomeCTA,
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <>
      <HomeHero />
      <Benefits />
      <FeaturedProducts />
      <FeaturedTestimonials />
      <HomeCTA />
    </>
  );
}
