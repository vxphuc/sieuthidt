import Header from "../../Layouts/DefaultLayout/Header";
import Footer from "../DefaultLayout/Footer";
import Sitebar from "./Sitebar";
import Style from './Layout.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
function AdminLayout({ children }) {
  return (
    <div>
      <div>
        <Header></Header>
      </div>
      <div className={`row mt-3 `}>
        <div className="col-lg-2">
          <Sitebar></Sitebar>
        </div>
        <div className="col-lg-9">{children}</div>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default AdminLayout;
