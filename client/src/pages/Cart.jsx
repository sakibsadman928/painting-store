import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const Cart = () => {
    const { user, setShowUserLogin, navigate, cartItems, updateCartItem, removeFromCart, clearCart } = useAppContext();
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddress, setShowAddress] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [placing, setPlacing] = useState(false);

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate('/');
            return;
        }
        fetchCartProducts();
        fetchAddresses();
    }, [user, cartItems]);

    const fetchCartProducts = async () => {
        try {
            setLoading(true);
            const productIds = Object.keys(cartItems);
            
            if (productIds.length === 0) {
                setCartProducts([]);
                setLoading(false);
                return;
            }

            const promises = productIds.map(async (productId) => {
                const response = await fetch('http://localhost:4000/api/product/single', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId })
                });
                const data = await response.json();
                if (data.success) {
                    return {
                        ...data.product,
                        quantity: cartItems[productId]
                    };
                }
                return null;
            });

            const products = await Promise.all(promises);
            setCartProducts(products.filter(p => p !== null));
        } catch (error) {
            console.error('Error fetching cart products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/address/list', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setAddresses(data.addresses);
                const defaultAddress = data.addresses.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity <= 0) {
            await removeFromCart(productId);
        } else {
            await updateCartItem(productId, newQuantity);
        }
    };

    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
    };

    const calculateSubtotal = () => {
        return cartProducts.reduce((total, product) => {
            return total + (product.offerprice * product.quantity);
        }, 0);
    };

    const calculateTax = () => {
        return Math.round(calculateSubtotal() * 0.02);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        setPlacing(true);

        const orderData = {
            items: cartProducts.map(product => ({
                productId: product._id,
                name: product.name,
                price: product.offerprice,
                quantity: product.quantity,
                image: product.image[0]
            })),
            amount: calculateTotal(),
            address: selectedAddress,
            paymentMethod: 'Online Payment'
        };

        try {
            const response = await fetch('http://localhost:4000/api/order/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            if (data.success) {
                await clearCart();
                alert('Order placed successfully!');
                navigate('/myOrders');
            } else {
                alert(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bb86fc]"></div>
            </div>
        );
    }

    if (cartProducts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-4">Add some beautiful paintings to get started!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-[#bb86fc]">{cartProducts.length} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartProducts.map((product) => (
                    <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3 border-b border-gray-200 pb-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div 
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <img 
                                    className="max-w-full h-full object-cover" 
                                    src={`http://localhost:4000/images/${product.image[0]}`} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold text-gray-900">{product.name}</p>
                                <p className="md:hidden font-semibold text-gray-900 text-xs">{product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}</p>
                                <p className="text-[#bb86fc] font-medium">${product.offerprice}</p>
                                <div className='flex items-center font-normal text-gray-500/70'>
                                    <p>Qty:</p>
                                    <select 
                                        className='outline-none ml-1 border border-gray-300 rounded px-1'
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                    >
                                        {Array.from({length: Math.min(product.stock, 10)}, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <p className="text-center font-semibold text-gray-900">${product.offerprice * product.quantity}</p>
                        <button 
                            className="cursor-pointer mx-auto"
                            onClick={() => handleRemoveItem(product._id)}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                ))}

                <button 
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-[#bb86fc] font-medium"
                    onClick={() => navigate('/products')}
                >
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#bb86fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        {selectedAddress ? (
                            <p className="text-gray-700 text-sm">
                                {selectedAddress.firstName} {selectedAddress.lastName}<br/>
                                {selectedAddress.address}<br/>
                                {selectedAddress.city}, {selectedAddress.country}
                            </p>
                        ) : (
                            <p className="text-gray-500">No address found</p>
                        )}
                        <button 
                            onClick={() => setShowAddress(!showAddress)} 
                            className="text-[#bb86fc] hover:underline cursor-pointer text-sm"
                        >
                            {selectedAddress ? 'Change' : 'Give Address'}
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full z-10 max-h-40 overflow-y-auto">
                                {addresses.map((address) => (
                                    <div
                                        key={address._id}
                                        onClick={() => {
                                            setSelectedAddress(address);
                                            setShowAddress(false);
                                        }}
                                        className="text-gray-700 p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {address.firstName} {address.lastName}<br/>
                                        {address.address}, {address.city}
                                    </div>
                                ))}
                                <p 
                                    onClick={() => {
                                        setShowAddress(false);
                                        navigate('/address');
                                    }}
                                    className="text-[#bb86fc] text-center cursor-pointer p-2 hover:bg-[#bb86fc]/10"
                                >
                                    Add new address
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-center text-sm text-green-700">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Payment Method: Online Payment</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Secure online payment processing</p>
                    </div>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Subtotal</span><span>${calculateSubtotal()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>${calculateTax()}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3 text-gray-900">
                        <span>Total Amount:</span><span className="text-[#bb86fc]">${calculateTotal()}</span>
                    </p>
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddress || placing}
                    className="w-full py-3 mt-6 cursor-pointer bg-[#bb86fc] text-white font-medium hover:bg-[#9b6fe5] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {placing ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Cart;