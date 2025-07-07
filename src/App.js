import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { router } from './routes';
import DefaultLayout from './components/Layouts/DefaultLayout';
import { Fragment } from 'react';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
      <div className="App">
        <Routes>
            {router.map((router, index) => {
              let Layout = DefaultLayout;
              if(router.layout === null){
                Layout = Fragment;
              }else if(router.layout){
                Layout = router.layout;
              }

              const Page = router.component
              return <Route path={router.path} element={<Layout><Page/></Layout>}/>
            })}
        </Routes>
    </div>
    </Router>
    </CartProvider>
    
  );
}

export default App;
