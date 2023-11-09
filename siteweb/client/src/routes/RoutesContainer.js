import React, { Component, useState, useEffect } from "react";
import Footer from "../components/common/footer/Footer";
import {
  Route,
  Routes,
  Router,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import * as ROUTES from "../routes/routes";
import LandingPage from "../components/common/landing_page/landing";
import SignIn from "../components/common/signin/signin";
import Navigation from "../components/client/navigation/navigation";
import Home from "../components/client/home/home";
import AdminRoute from "./adminRoute";
import ClientRoute from "./clientRoute";

import VerifyEmail from "../components/common/verifyEmail";
import NewPassword from "../components/common/newPassword";
import Shop from "../components/client/shop/shop";
import useFindUser from "../hooks/useFindUser";
import PaymentComponent from "../components/payment/paymentComponent";
import AddProduct from "../components/admin/product/addProduct";

import AuthRout from "./AuthRout";
import AdminDashboard from "../components/admin/admin dashboard/adminDashboard";
import AdminSidebar from "../components/admin/admin_navigation/adminSidebar";
import ServiceBagage from "../components/client/service bagages/serviceBagage";
import Account from "../components/client/account/account";
import ClientUserRoute from "./clientuserRoute";
import UnauthRoute from "./unauthRoute";
import Produits from "../components/admin/produits/produits";
import Categories from "../components/client/categories/categories";
import CategoriesAdmin from "../components/admin/categories adm/categoriesAdmin";
import Commandes from "../components/admin/commandes/commandes";
import Commande from "../components/admin/commandes/commande";
import Product from "../components/client/product/product";

import PaypalCheckoutButton from "../components/payment/paypal/paypalCheckoutButton";

import OrderSummary from "../components/client/checkout/step1/orderSummary";
import DetailCommande from "../components/client/checkout/step2/detailCommande";
import CommandeTermine from "../components/client/checkout/step4/commandeTermine";
import { ShippingContext } from "../hooks/ShippingContext";
import Contact from "../components/client/contact/contact";
import AdminAccount from "../components/admin/admin account/adminAccount";
import ScrollToTop from "../components/common/scrollToTop";
const RoutesContainer = () => {
  const [showNav, setShowNav] = useState(false);
  const [showAdminSide, setShowAdminSide] = useState(false);
  const [yOffset, setYOffset] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function handleScroll() {
    const currentYOffset = window.pageYOffset;
    const visible = yOffset > currentYOffset;
    setYOffset(currentYOffset);
    setVisible(visible);
  }
  return (
    <BrowserRouter>
      <ScrollToTop />
      {showAdminSide && <AdminSidebar />}

      {showNav && <Navigation />}

      <Routes>
        <Route
          path="/dashboard"
          element={<AdminDashboard funcNav={setShowAdminSide} />}
        />

        <Route path="/home" element={<Home funcNav={setShowNav} />} />

        <Route path="/admin" element={<AdminRoute />}>
          {/* ROUTES COMMON BETWEEN ADMIN */}
          <Route
            path={ROUTES.PRODUCTS}
            exact
            element={<Produits funcNav={setShowAdminSide} />}
          />
          <Route
            path={ROUTES.ADDPRODUCT}
            exact
            element={<AddProduct funcNav={setShowAdminSide} />}
          />
          <Route
            path={ROUTES.COMMANDES}
            exact
            element={<Commandes funcNav={setShowAdminSide} />}
          />
          <Route
            path={ROUTES.COMMANDE}
            exact
            element={<Commande funcNav={setShowAdminSide} />}
          />
          <Route
            path={ROUTES.CATEGORIES}
            exact
            element={<CategoriesAdmin funcNav={setShowAdminSide} />}
          />

          <Route
            path={ROUTES.MY_ACCOUNT_admin}
            exact
            element={<AdminAccount funcNav={setShowAdminSide} />}
          />
        </Route>

        <Route path="/client" element={<ClientRoute />}>
          {/* ROUTES COMMON BETWEEN CLIENT */}
          {/* <Route path={ROUTES.CHECKOUT_STEP_1} element={<OrderSummary/>}/> */}

          <Route path="compte" element={<Account funcNav={setShowNav} />} />
          <Route path="paypal" element={<PaypalCheckoutButton />} />
          <Route
            path="checkoutStep1"
            element={<OrderSummary funcNav={setShowNav} />}
          />
          <Route
            path="checkoutStep2"
            element={<DetailCommande funcNav={setShowNav} />}
          />
          <Route
            path="checkoutStep3"
            exact
            element={
              <PaymentComponent
                keys={{ stripe: process.env.REACT_APP_STRIPE_PUBLIC_KEY }}
                funcNav={setShowNav}
              />
            }
          />
          <Route
            path="checkoutStep4"
            element={<CommandeTermine funcNav={setShowNav} />}
          />
        </Route>

        <Route path="/auth" element={<AuthRout />}>
          {/* ROUTES COMMON BETWEEN ADMIN AND CLIENT (PROFILE ....) */}
        </Route>

        <Route path="/user" element={<ClientUserRoute />}>
          {/* ROUTES COMMON BETWEEN CLIENT AND USER (ProductDetail....) */}

          {/* <Route path="shop" element={<Shop funcNav={setShowNav} />} /> */}
          <Route
            path="serviceDeBagages"
            element={<ServiceBagage funcNav={setShowNav} />}
          />
          <Route
            path="Contactez-nous"
            element={<Contact funcNav={setShowNav} />}
          />

          <Route path="shop" element={<Shop funcNav={setShowNav} />} />

          <Route path="shop/:id" element={<Shop funcNav={setShowNav} />} />

          <Route
            path="product/:id"
            element={<Product funcNav={setShowNav} />}
          />
        </Route>

        <Route path="/" element={<UnauthRoute />}>
          {/* ROUTES FOR USER (UNTHENTICATED) (LANDING....) */}
          <Route
            path={ROUTES.LANDING}
            element={<LandingPage funcNav={setShowNav} />}
          />
          <Route
            path={ROUTES.SIGNIN}
            exact
            element={<SignIn funcNav={setShowNav} />}
          />
          <Route path={ROUTES.VERIFYEMAIL} exact element={<VerifyEmail />} />
        </Route>

        {/* ROUTES FOR EVERYONE */}
        <Route path={ROUTES.RESETPASSWORD} exact element={<NewPassword />} />
      </Routes>

      {showAdminSide == false && <Footer />}
    </BrowserRouter>
  );
};
export default RoutesContainer;
