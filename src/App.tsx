import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import RootLayout from "./components/layout/RootLayout";
import About from "./pages/About";
import OrderConfirmation from "./pages/OrderConfirmation";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Account from "./pages/Account";
import AccountOrders from "./pages/AccountOrders";
import AccountOrderDetail from "./pages/AccountOrderDetail";
import AdminLayout from "./components/layout/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminRoute from "./components/auth/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />

                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/account/orders"
                  element={
                    <ProtectedRoute>
                      <AccountOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/account/orders/:orderNumber"
                  element={
                    <ProtectedRoute>
                      <AccountOrderDetail />
                    </ProtectedRoute>
                  }
                />

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                {/* <Route path="users" />
                <Route path="orders" />
                <Route path="products" /> */}
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
