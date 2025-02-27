import { NavLink } from 'react-router-dom';
import style from './Product.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

function Product() {
    const [products, setProducts] = useState([]);

    const data = async () => {
        try{
            const datas = await axios.get('https://web-dt.onrender.com/product')
            console.log(datas.data)
            setProducts(datas.data)
         }catch{
             console.log('error connect server')
         }
    }

    useEffect(()=>{
        data()
    }, [])
    console.log(products.results)
  return (
    <div>
        <div className="container">
            <img width='100%' height='100%' src="https://cf.shopee.vn/file/vn-50009109-727a24a85a60935da5ccb9008298f681"></img>
        </div>
      <div className="container mt-2">
        <div><h2 className="text-center">Sản phẩm</h2></div>
        <div className={style.cKV3cM}>
            <div className={style.shopee_filter_panel}>
                <div className={style.shopee_filter_panel__item}>
                    <NavLink to="/san-pham">

                    </NavLink>
                </div>
            </div>
            <div className={style.shopeeSortBar}>

            </div>
            <ul className={`row ${style.shopeeProductList}`}>
                {products.results?.map((item, index) =>{
                    return(
                        <li className= {`${style.products} col-lg-3 ms-3`} key={index}>
                            <div className= {`${style.product}`}>
                                <img width='100%' height= '200px' src={`https://web-dt.onrender.com/uploads/${item.image}`}></img>
                            </div>
                            <div>
                                <div>
                                    <h5 className={`text-start`}>{item.name}</h5>
                                </div>
                                <div className={`text-danger text-start`}>
                                    <p>{item.price}</p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default Product;
