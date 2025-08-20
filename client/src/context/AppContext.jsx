import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);

  const checkUserAuth = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/user/profile', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setUser({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await checkUserAuth();
      setLoading(false);
    };
    
    initializeApp();
  }, []);

  const fetchCartCount = async () => {
    if (user) {
      try {
        const response = await fetch('http://localhost:4000/api/cart/count', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setCartCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    } else {
      setCartCount(0);
    }
  };

  const fetchCartItems = async () => {
    if (user) {
      try {
        const response = await fetch('http://localhost:4000/api/cart/get', {
          method: 'POST',
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setCartItems(data.cartData);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    } else {
      setCartItems({});
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    if (!user) {
      setShowUserLogin(true);
      return false;
    }

    try {
      const response = await fetch('http://localhost:4000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity })
      });

      const data = await response.json();
      if (data.success) {
        await fetchCartCount();
        await fetchCartItems();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await fetch('http://localhost:4000/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity })
      });

      const data = await response.json();
      if (data.success) {
        await fetchCartCount();
        await fetchCartItems();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating cart:', error);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch('http://localhost:4000/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemId })
      });

      const data = await response.json();
      if (data.success) {
        await fetchCartCount();
        await fetchCartItems();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/cart/clear', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        await fetchCartCount();
        await fetchCartItems();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const adminLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setAdmin(null);
      window.location.href = 'about:blank';
    } catch (error) {
      console.error('Error during admin logout:', error);
      setAdmin(null);
      window.location.href = 'about:blank';
    }
  };

  const userLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/user/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setCartCount(0);
      setCartItems({});
      navigate("/");
    } catch (error) {
      console.error('Error during user logout:', error);
      setUser(null);
      setCartCount(0);
      setCartItems({});
      navigate("/");
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchCartItems();
  }, [user]);

  const value = { 
    navigate, 
    user, 
    setUser,
    admin,
    setAdmin,
    showUserLogin, 
    setShowUserLogin,
    products,
    setProducts,
    searchTerm,
    setSearchTerm,
    cartCount,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCartCount,
    fetchCartItems,
    adminLogout,
    userLogout,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);