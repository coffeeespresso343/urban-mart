import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useEffect } from "react";
import AnnouncementBar from "./AnnouncementBar";
import MobileNavigation from "./MobileNavigation";

const RootLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default RootLayout;
