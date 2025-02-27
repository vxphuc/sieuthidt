import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { router } from './routes';
import DefaultLayout from './components/Layouts/DefaultLayout';
import { Fragment } from 'react';

function App() {
  return (
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
              return <Route path={router.path} key={index} element={<Layout><Page/></Layout>}/>
            })}
        </Routes>
    </div>
    </Router>
    
  );
}

export default App;
