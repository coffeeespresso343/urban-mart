import BestSellers from "../components/sections/BestSellers";
import CategorySection from "../components/sections/CategorySection";
import EditorialBanner from "../components/sections/EditorialBanner";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import Hero from "../components/sections/Hero";
import Newsletter from "../components/sections/Newsletter";
import WhyUrbanMart from "../components/sections/WhyUrbanMart";

const Home = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <EditorialBanner />
      <BestSellers />
      <WhyUrbanMart />
      <Newsletter />
    </>
  );
};

export default Home;
