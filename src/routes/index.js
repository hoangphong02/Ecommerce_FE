import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFaultPage from "../pages/NotFaultPage/NotFaultPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccessPage from "../pages/OrderSuccessPage/OrderSuccessPage";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import TrendingProductPage from "../pages/TrendingProductPage/TrendingProductPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import ForgetPasswordPage from "../pages/ForgetPassword/ForgetPasswordPage";
import CreateNewPassword from "../pages/CreateNewPassword/CreateNewPassword";
import BlogPage from "../pages/BlogPage/BlogPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/my-order",
    page: MyOrderPage,
    isShowHeader: true,
  },
  {
    path: "/order-details/:id",
    page: DetailsOrderPage,
    isShowHeader: true,
  },
  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
  },
  {
    path: "/orderSuccess",
    page: OrderSuccessPage,
    isShowHeader: true,
  },
  {
    path: "/products",
    page: ProductsPage,
    isShowHeader: true,
  },
  {
    path: "/productsTrending",
    page: TrendingProductPage,
    isShowHeader: true,
  },
  {
    path: "product/:type",
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: "/contact",
    page: ContactPage,
    isShowHeader: true,
  },
  {
    path: "/blog",
    page: BlogPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFaultPage,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/forget-password",
    page: ForgetPasswordPage,
    isShowHeader: false,
  },
  {
    path: "/create-newPassword",
    page: CreateNewPassword,
    isShowHeader: false,
  },
  {
    path: "/product-detail/:id",
    page: ProductDetailPage,
    isShowHeader: true,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivated: true,
  },
  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHeader: true,
  },
];
