
import Home from "../pages/Home"
import Product from "../pages/Product";
import ProductAdmin from "../pages/Admin/ProductAdmin";
import CreateProduct from "../pages/Admin/CreateProduct";
import AdminLayout from "../components/Layouts/AdminLayout";
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



export const router = [
    {path: '/cap-nhap-thong-tin', component: FillInformation, layout: null},
    {path: '/', component: Home},
    {path: '/san-pham', component: Product},
    {path: '/quan-tri/cap-nhap-loai-san-pham/:id', component: UpdateTypeProduct, layout: AdminLayout},
    {path: '/dang-nhap', component: Login},
    {path: '/quan-tri/loai-san-pham/thung-rac', component: RecycleBinTyproduct, layout: AdminLayout},
    {path: '/quan-tri', component: ManageAdmin, layout: AdminLayout},
    {path: '/quan-tri/them-moi-banner', component: CreateBanner, layout: AdminLayout},
    {path: '/quan-tri/san-pham', component: ProductAdmin, layout: AdminLayout},
    {path: '/quan-tri/san-pham/them-moi-san-pham', component: CreateProduct, layout: AdminLayout},
    {path: '/quan-tri/loai-san-pham', component: TypeProductAdmin, layout: AdminLayout},
    {path: '/quan-tri/loai-san-pham/them-moi', component: CreateTypeProductAdmin, layout: AdminLayout},
    {path: '/quan-tri/san-pham/thung-rac', component: RecycleBin, layout: AdminLayout},
    {path: '/quan-tri/banner', component: ShowBanner, layout: AdminLayout},
    {path: '/quan-tri/san-pham/:slug/cap-nhap-san-pham', component: UpdateProduct, layout: AdminLayout},

    


]

