import CategorySection from "../components/sections/CategorySection";
import EditorialBanner from "../components/sections/EditorialBanner";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import Hero from "../components/sections/Hero";

const Home = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <EditorialBanner />
      {/*<BestSellers />
      <WhyUrbanMart />
      <Newsletter /> */}
    </>
  );
};

export default Home;
