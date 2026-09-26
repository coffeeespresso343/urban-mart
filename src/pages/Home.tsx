import BestSellers from "../components/sections/BestSellers";
import CategorySection from "../components/sections/CategorySection";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import Hero from "../components/sections/Hero";
import Newsletter from "../components/sections/Newsletter";
import Promotion from "../components/sections/Promotion";
import WhyUrbanMart from "../components/sections/WhyUrbanMart";

const Home = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <Promotion />
      <FeaturedProducts />
      {/* <EditorialBanner /> */}
      <BestSellers />
      <WhyUrbanMart />
      <Newsletter />
    </>
  );
};

export default Home;
