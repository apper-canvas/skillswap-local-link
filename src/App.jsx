import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { routes } from './config/routes';
import Layout from './Layout';
import NotFoundPage from '@/components/pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            {Object.values(routes).map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
))}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          toastClassName="bg-white border border-surface-200 shadow-lg"
          progressClassName="bg-primary"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;