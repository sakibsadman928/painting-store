import React from "react";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { navigate, addToCart, updateCartItem, cartItems } = useAppContext();

    if (!product) {
        return (
            <div className="border border-gray-300 rounded-md px-4 py-2 bg-white w-full">
                <div className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    const getImageUrl = () => {
        if (product.image && product.image.length > 0) {
            return `http://localhost:4000/images/${product.image[0]}`;
        }
        return "/placeholder-image.jpg";
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#fbbf24" />
                    </svg>
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <svg width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#d1d5db" />
                        </svg>
                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                            <svg width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#fbbf24" />
                            </svg>
                        </div>
                    </div>
                );
            } else {
                stars.push(
                    <svg key={i} width="14" height="13" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#d1d5db" />
                    </svg>
                );
            }
        }
        return stars;
    };

    const currentQuantity = cartItems[product._id] || 0;
    const availableStock = product.stock - currentQuantity;

    const handleProductClick = () => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        
        if (availableStock <= 0) {
            alert('This item is out of stock or maximum quantity already in cart');
            return;
        }
        
        await addToCart(product._id, 1);
    };

    const handleQuantityChange = async (e, change) => {
        e.stopPropagation();
        const newQuantity = currentQuantity + change;
        
        if (newQuantity > product.stock) {
            alert(`Cannot add more items. Only ${product.stock} items available in stock.`);
            return;
        }
        
        if (newQuantity < 0) {
            return;
        }
        
        await updateCartItem(product._id, newQuantity);
    };

    return (
        <div 
            onClick={handleProductClick}
            className="border border-[#bb86fc]/30 rounded-md md:px-4 px-3 py-2 bg-white w-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        >
            <div className="group flex items-center justify-center px-2">
                <img 
                    className="group-hover:scale-105 transition w-full max-w-36 h-32 object-cover rounded" 
                    src={getImageUrl()}
                    alt={product.name || 'Product image'}
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p className="text-[#6b46c1] font-medium">Painting</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5 mb-1">
                    {renderStars(product.rating || 0)}
                    <span className="ml-1 text-xs text-gray-600">
                        ({product.rating ? product.rating.toFixed(1) : '0.0'})
                    </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                    {product.totalRatings || 0} review{product.totalRatings !== 1 ? 's' : ''}
                </p>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-[#bb86fc]">
                        ${product.offerprice} 
                        {product.price !== product.offerprice && (
                            <span className="text-gray-500/60 md:text-sm text-xs line-through ml-2">
                                ${product.price}
                            </span>
                        )}
                    </p>
                    <div className="text-[#bb86fc]">
                        {product.stock === 0 ? (
                            <div className="flex items-center justify-center gap-1 bg-gray-100 border border-gray-300 md:w-[80px] w-[64px] h-[34px] rounded text-gray-500 font-medium text-xs">
                                Out of Stock
                            </div>
                        ) : availableStock <= 0 ? (
                            <div className="flex items-center justify-center gap-1 bg-orange-100 border border-orange-300 md:w-[80px] w-[64px] h-[34px] rounded text-orange-600 font-medium text-xs">
                                Max in Cart
                            </div>
                        ) : currentQuantity === 0 ? (
                            <button 
                                className="flex items-center justify-center gap-1 bg-[#bb86fc]/10 border border-[#bb86fc] md:w-[80px] w-[64px] h-[34px] rounded text-[#bb86fc] font-medium hover:bg-[#bb86fc] hover:text-white transition-colors" 
                                onClick={handleAddToCart}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-[#bb86fc]/25 rounded select-none">
                                <button 
                                    onClick={(e) => handleQuantityChange(e, -1)} 
                                    className="cursor-pointer text-md px-2 h-full text-[#bb86fc] hover:text-[#6b46c1]"
                                >
                                    -
                                </button>
                                <span className="w-5 text-center text-[#bb86fc] font-medium">{currentQuantity}</span>
                                <button 
                                    onClick={(e) => handleQuantityChange(e, 1)} 
                                    className="cursor-pointer text-md px-2 h-full text-[#bb86fc] hover:text-[#6b46c1] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={availableStock <= 0}
                                    title={availableStock <= 0 ? "Maximum stock reached" : ""}
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {availableStock <= 3 && availableStock > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                        Only {availableStock} left in stock!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;