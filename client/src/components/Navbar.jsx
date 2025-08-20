import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const [navSearchTerm, setNavSearchTerm] = React.useState('')
    const { user, setShowUserLogin, navigate, setSearchTerm, cartCount, userLogout } = useAppContext();
    
    const handleSearch = (e) => {
        e.preventDefault()
        setSearchTerm(navSearchTerm.trim())
        navigate("/products")
        setNavSearchTerm('')
    }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to="/" onClick={()=> setOpen(false)}>
              <img className='h-9' src='/art_15353520.png'/>
            </NavLink>

            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">All Paintings</NavLink>
                <NavLink to="/exhibition">Exhibitions</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                <form onSubmit={handleSearch} className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input 
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" 
                        type="text" 
                        placeholder="Search Paintings" 
                        value={navSearchTerm}
                        onChange={(e) => setNavSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>

                <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#6200ee" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-3 text-xs text-white bg-[#bb86fc] w-[18px] h-[18px] rounded-full flex items-center justify-center">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </div>

                {!user ? (
                    <button onClick={()=>setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-[#bb86fc] hover:bg-[#9b6fe5] transition text-white rounded-full">
                        Login
                    </button>
                ) : (
                    <div className="relative group">
                        <img src="/user.png" className='w-9'/>
                        <ul className='hidden group-hover:block absolute top-6 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40 pt-6'>
                            <li onClick={()=> navigate("/myOrders")} className='p-1.5 pl-3 hover:bg-[#bb86fc]/10 cursor-pointer'>My Orders</li>
                            <li onClick={userLogout} className='p-1.5 pl-3 hover:bg-[#bb86fc]/10 cursor-pointer'>Logout</li>
                        </ul>
                    </div>
                )}
            </div>

            <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="21" height="1.5" rx=".75" fill="#426287" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                </svg>
            </button>

            {open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to="/" onClick={()=> setOpen(false)}>Home</NavLink>
                <NavLink to="/products" onClick={()=> setOpen(false)}>All Paintings</NavLink>
                <NavLink to="/exhibition" onClick={()=> setOpen(false)}>Exhibitions</NavLink>
                {user && 
                <NavLink to="/myOrders" onClick={()=> setOpen(false)}>My Orders</NavLink>}

                <NavLink to="/contact" onClick={()=> setOpen(false)}>Contact</NavLink>

                <form onSubmit={handleSearch} className="flex items-center text-sm gap-2 border border-gray-300 px-3 py-2 rounded-full mt-2 w-full max-w-xs">
                    <input 
                        className="py-1 w-full bg-transparent outline-none placeholder-gray-500" 
                        type="text" 
                        placeholder="Search..." 
                        value={navSearchTerm}
                        onChange={(e) => setNavSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>

                {!user ? (
                  <button onClick={()=> {setOpen(false);setShowUserLogin(true)}} className="cursor-pointer px-6 py-2 mt-2 bg-[#bb86fc] text-white hover:bg-[#9b6fe5] transition rounded-full text-sm">
                    Login
                  </button>

                ) : (
                    <button onClick={() => {setOpen(false); userLogout();}} className="cursor-pointer px-6 py-2 mt-2 bg-[#bb86fc] text-white hover:bg-[#9b6fe5] transition rounded-full text-sm">
                        LogOut
                    </button>
                )}

            </div>)}

        </nav>

  )
}

export default Navbar