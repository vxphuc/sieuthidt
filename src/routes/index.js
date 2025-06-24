import Home from "../pages/Home";
import Product from "../pages/Product";
import ProductAdmin from "../pages/Admin/ProductAdmin";
import CreateProduct from "../pages/Admin/CreateProduct";
import AdminLayout from "../components/Layouts/AdminLayout";
import HeaderLayout from "../components/Layouts/HeaderLayout";
import TypeProductAdmin from "../pages/Admin/TypeProductAdmin";
import ManageAdmin from "../pages/Admin/ManageAdmin";
import CreateTypeProductAdmin from "../pages/Admin/CreateTypeProductAdmin";
import RecycleBin from "../pages/Admin/RecycleBin";
import Login from "../pages/Login";
import CreateBanner from "../pages/Admin/CreateBanner";
import FillInformation from "../pages/fillInInformation";
import ShowBanner from "../pages/Admin/ShowBanner";
import UpdateProduct from "../pages/Admin/UpdateProduct";
import UpdateTypeProduct from "../pages/Admin/UpdateTypeProduc";
import RecycleBinTyproduct from "../pages/Admin/RecycleBinTypeProduct";
import DetailProduct from "../pages/DetailProduct";
import Carts from "../pages/Carts";
import HeaderOnly from "../components/Layouts/HeaderOnly";
import Adress from "../pages/Adress";
import Infomation from "../pages/Infomation";
import InfomationLayout from "../components/Layouts/InfomationLayout";
import Bill from "../pages/Bill";
import PayMentBank from "../pages/PayMentBank";
import InvoiceDetails from "../pages/InvoiceDetails";
import SearchPage from "../pages/SearchPage";
import OrderManagement from "../pages/Admin/OrderManagement";
import ChatBot from "../pages/Admin/ChatBot";
import DetailProductBill from "../pages/Admin/DetailProductBill";
import Taikhoanquanly from "../pages/Admin/Taikhoanquanly";
import Suataikhoannguoidung from "../pages/Admin/Suataikhoannguoidung";
import DetailUsers from "../pages/Admin/DetailUser";

export const router = [
  {
    path: "/tim-kiem",
    component: SearchPage,
  },
  {
    path: "/quan-tri/chat-bot",
    component: ChatBot,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/quan-ly-tai-khoan",
    component: Taikhoanquanly,
    layout: AdminLayout,
  },
  
  {
    path: "/quan-tri/hoa-don",
    component: OrderManagement,
    layout: AdminLayout,
  }
  ,
  {
    path: "/thong-tin-khach-hang/hoa-don",
    component: Bill,
    layout: InfomationLayout,
  },
  {
    path: "/thong-tin-khach-hang",
    component: Infomation,
    layout: InfomationLayout,
  },
  { path: "/gio-hang/cap-nhap-dia-chi", component: Adress, layout: HeaderOnly },
  { path: "/cap-nhap-thong-tin", component: FillInformation, layout: null },
  { path: "/", component: Home },
  { path: "/gio-hang", component: Carts, layout: HeaderOnly },
  {
    path: "/quan-tri/sua-tai-khoan-nguoi-dung/:uid",
    component: Suataikhoannguoidung,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/chi-tiet-tai-khoan/:uid",
    component: DetailUsers,
    layout: AdminLayout,
  },
  {
    path: "/thong-tin-khach-hang/hoa-don/:id",
    component: InvoiceDetails,
    layout: InfomationLayout,
  },
  {
    path: "/gio-hang/thanh-toan/:id",
    component: PayMentBank,
    layout: HeaderOnly,
  },
  {
    path: "/quan-tri/cap-nhap-loai-san-pham/:id",
    component: UpdateTypeProduct,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/chi-tiet/:id",
    component: DetailProductBill,
    layout: AdminLayout,
  },
  { path: "/dang-nhap", component: Login, layout: HeaderLayout },
  {
    path: "/quan-tri/loai-san-pham/thung-rac",
    component: RecycleBinTyproduct,
    layout: AdminLayout,
  },
  { path: "/quan-tri/tong-quan", component: ManageAdmin, layout: AdminLayout },
  {
    path: "/quan-tri/them-moi-banner",
    component: CreateBanner,
    layout: AdminLayout,
  },
  { path: "/quan-tri/san-pham", component: ProductAdmin, layout: AdminLayout },
  {
    path: "/quan-tri/san-pham/them-moi-san-pham",
    component: CreateProduct,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/loai-san-pham",
    component: TypeProductAdmin,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/loai-san-pham/them-moi",
    component: CreateTypeProductAdmin,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/san-pham/thung-rac",
    component: RecycleBin,
    layout: AdminLayout,
  },
  { path: "/quan-tri/banner", component: ShowBanner, layout: AdminLayout },
  {
    path: "/quan-tri/san-pham/:slug/cap-nhap-san-pham",
    component: UpdateProduct,
    layout: AdminLayout,
  },
  { path: "/san-pham/:slug", component: Product },
  { path: "/:slug/:slug", component: DetailProduct },
   
];
