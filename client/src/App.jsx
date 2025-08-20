import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/Login'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Address from './pages/Address'
import Exhibition from './pages/Exhibition'
import MyOrders from './pages/MyOrders'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/navbar'

const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("admin");
  const { showUserLogin, isLoading } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bb86fc] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {!isAdminPath && <Navbar/>}
      {showUserLogin ? <Login/> : null}
      
      <div className={`${isAdminPath ? "" : "px-6 md:px-16 lg:px xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} /> 
          <Route path='/products' element={<Products/>} />
          <Route path='/product/:productId' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/address' element={<Address/>} />
          <Route path='/exhibition' element={<Exhibition/>} />
          <Route path='/myOrders' element={<MyOrders/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/admin' element={<AdminDashboard/>} />
        </Routes>
      </div>
      
      {!isAdminPath && <Footer/>}
    </div>
  )
}

export default App