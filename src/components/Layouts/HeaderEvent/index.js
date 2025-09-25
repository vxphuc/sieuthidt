import Footer from "./Footer";

function HeaderLayout({children}) {
    return ( 
        <div>
            <div>{children}</div>
            <div><Footer></Footer></div>
        </div>
     );
}

export default HeaderLayout;