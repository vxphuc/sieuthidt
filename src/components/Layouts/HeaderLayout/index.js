import Header from "../DefaultLayout/Header";
import Footer from "./Footer";

function HeaderLayout({children}) {
    return ( 
        <div>
            <div><Header></Header></div>
            <div>{children}</div>
            <div><Footer></Footer></div>
        </div>
     );
}

export default HeaderLayout;