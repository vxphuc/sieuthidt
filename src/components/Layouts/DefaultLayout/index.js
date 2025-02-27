import Header from "./Header";
import Footer from "./Footer";

function DefaultLayout({children}) {
    return ( 
        <div>
            <div>
                <Header></Header>
            </div>
            <div className="">
                {children}
            </div>
            <div>
                <Footer></Footer>
            </div>
        </div>
     );
}

export default DefaultLayout;