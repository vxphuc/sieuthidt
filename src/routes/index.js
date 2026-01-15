import Home from "../pages/Home";
import Product from "../pages/Product";
import ProductAdmin from "../pages/Admin/ProductAdmin";
import CreateProduct from "../pages/Admin/CreateProduct";
import AdminLayout from "../components/Layouts/AdminLayout";
import HeaderLayout from "../components/Layouts/HeaderLayout";

// import HeaderLayout from "../components/Layouts/HeaderEvent";
import Header from "../components/Layouts/HeaderEvent";
import event from "../pages/Event_Hue";
import eventAnhNhat from "../pages/Event";
import TypeProductAdmin from "../pages/Admin/TypeProductAdmin";
import ManageAdmin from "../pages/Admin/ManageAdmin";
import CreateTypeProductAdmin from "../pages/Admin/CreateTypeProductAdmin";
import RecycleBin from "../pages/Admin/RecycleBin";
import Login from "../pages/Login";

// login event in hue
import LoginEventInHue from "../pages/login_event_in_hue";
import LoginEventAnhNhat from "../pages/Login_Event";
import CreateBanner from "../pages/Admin/CreateBanner";
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
import RegisterCTV from "../pages/RegisterCTV";
import PayMentBank from "../pages/PayMentBank";
import InvoiceDetails from "../pages/InvoiceDetails";
import SearchPage from "../pages/SearchPage";
import OrderManagement from "../pages/Admin/OrderManagement";
import ChatBot from "../pages/Admin/ChatBot";
import DetailProductBill from "../pages/Admin/DetailProductBill";
import Taikhoanquanly from "../pages/Admin/Taikhoanquanly";
import Suataikhoannguoidung from "../pages/Admin/Suataikhoannguoidung";
import DetailUsers from "../pages/Admin/DetailUser";
import LuckyWheel from "../pages/Admin/luckywheel/index";
import LuckyWheelPage from "../pages/Admin/luckywheel/LuckyWheel/index";
import ExchangeGifts from "../pages/ExchangeGifts";
import CheckCodeAdmin from "../pages/CheckCode";

//ctv import
import ManageCTV from "../pages/Admin/ManageCTV";
import CreateDiscount from "../pages/Admin/CreateDiscount";
import ListDiscount from "../pages/Admin/ListDiscount";
import MyDiscountList from "../pages/MyDiscountList";
import TopSellingProducts from "../pages/Admin/TopSellingProducts";
import UserStatistics from "../pages/Admin/UserStatistics";
import RevenueStatistics from "../pages/Admin/RevenueStatistics";
import UsingDiscountCode from "../pages/UsingDiscountCode";
import ActiveKOCList from "../pages/Admin/ActiveKOCList";
import TopProductsKOC from "../pages/Admin/TopProductsKOC";

//chinh sach
import PaymentPolice from "../pages/NotePage/PaymentPolice";
import ComplaintsPolice from "../pages/NotePage/ComplaintsPolice";
import TransportPolice from "../pages/NotePage/TransportPolice";
import RefurnPolice from "../pages/NotePage/RefurnPolice";
import CollectionInfo from "../pages/NotePage/CollectionInfo";
import ScopeOfUse from "../pages/NotePage/ScopeOfUse";
import RealTimeUse from "../pages/NotePage/RealTimeUse";
import UserUseInfo from "../pages/NotePage/UserUseInfo";
import UpdateData from "../pages/NotePage/UpdateData";

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
    path: "/quan-tri/LuckyWheel",
    component: LuckyWheel,
    layout: HeaderOnly,
  },
  {
    path: "/quan-tri/quan-ly-tai-khoan",
    component: Taikhoanquanly,
    layout: AdminLayout,
  },

  //ctv route
  {
    path: "/quan-tri/quan-ly-ctv",
    component: ManageCTV,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/tao-giam-gia",
    component: CreateDiscount,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/quan-ly-giam-gia",
    component: ListDiscount,
    layout: AdminLayout,
  },
  {
    path: "/thong-tin-khach-hang/kho-ma-giam-gia",
    component: MyDiscountList,
    layout: InfomationLayout,
  },
  {
    path: "/quan-tri/top-san-pham-ban-chay",
    component: TopSellingProducts,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/thong-ke-nguoi-dung",
    component: UserStatistics,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/thong-ke-doanh-thu",
    component: RevenueStatistics,
    layout: AdminLayout,
  },
  {
    path: "/thong-tin-khach-hang/su-dung-ma-giam-gia",
    component: UsingDiscountCode,
    layout: InfomationLayout,
  },
  {
    path: "/quan-tri/danh-sach-koc-hoat-dong",
    component: ActiveKOCList,
    layout: AdminLayout,
  },
  {
    path: "/quan-tri/san-pham-mua-nhieu-koc",
    component: TopProductsKOC,
    layout: AdminLayout,
  },

  // end ctv route
  {
    path: "/quan-tri/hoa-don",
    component: OrderManagement,
    layout: AdminLayout,
  },
  {
    path: "/thong-tin-khach-hang/hoa-don",
    component: Bill,
    layout: InfomationLayout,
  },
  {
    path: "/thong-tin-khach-hang/dang-ky-ctv",
    component: RegisterCTV,
    layout: InfomationLayout,
  },
  {
    path: "/thong-tin-khach-hang",
    component: Infomation,
    layout: InfomationLayout,
  },
  { path: "/gio-hang/cap-nhap-dia-chi", component: Adress, layout: HeaderOnly },
  { path: "/", component: Home },
  { path: "/gio-hang", component: Carts, layout: HeaderOnly },
  {
    path: "/quan-tri/sua-tai-khoan-nguoi-dung/:id",
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
  // login event in hue
  { path: "/dang-nhap-event-hue", component: LoginEventInHue, layout: null },
  { path: "/dang-ky-tu-van", component: LoginEventAnhNhat, layout: null },

  {path:"/hoi-cho-mua-thu", component: event, layout: null},
  {path:"/gioi-thieu-cong-ty", component: eventAnhNhat, layout: null},
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
  {
    path: "/vongquaymayman",
    component: LuckyWheelPage,
    layout: HeaderOnly,
  },
  { path: "/san-pham/:slug", component: Product },
  { path: "/:slug/:slug", component: DetailProduct, layout: HeaderOnly},
  {
    path: "/doi-qua",
    component: ExchangeGifts,
    layout: HeaderOnly,
  },
  {
    path: "/kiem-tra-ma-qua",
    component: CheckCodeAdmin,
    layout: HeaderOnly,
  },
//chinh sach
  {
    path: "/chinh-sach-thanh-toan",
    component: PaymentPolice,
    layout: HeaderOnly
  },
  {
    path: "/chinh-sach-khieu-nai",
    component: ComplaintsPolice,
    layout: HeaderOnly
  },
  {path: "/chinh-sach-van-chuyen-giao-nhan",
    component: TransportPolice,
    layout: HeaderOnly
  },
  {
    path: "/chinh-sach-doi-tra",
    component: RefurnPolice,
    layout: HeaderOnly
  },
  {
    path: "/chinh-sach-muc-dich-pham-vi-thu-thap-thong-tin",
    component: CollectionInfo,
    layout: HeaderOnly
  },
  {
    path: "/chinh-sach-pham-vi-su-dung",
    component: ScopeOfUse,
    layout: HeaderOnly
  },
  {
    path: "/chinh-sach-thoi-gian-luu-tru",
    component: RealTimeUse,
    layout: HeaderOnly
  },
  {
    path: "/don-vi-tiep-can-thong-tin",
    component: UserUseInfo,
    layout: HeaderOnly
  },
  {
    path: "/cach-nguoi-dung-chinh-sua-yeu-cau-xoa-du-lieu",
    component: UpdateData,
    layout: HeaderOnly
  },
];
