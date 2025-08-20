import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Breadcrumb from '../components/Breadcrumb';

const ProductDetails = () => {
    const { productId } = useParams();
    const { navigate, updateCartItem, cartItems, user, setShowUserLogin } = useAppContext();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [loadingRatings, setLoadingRatings] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0);

    useEffect(() => {
        if (productId) {
            fetchProductDetails();
        }
    }, [productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('http://localhost:4000/api/product/single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId })
            });

            const data = await response.json();

            if (data.success) {
                setProduct(data.product);
                if (data.product.image && data.product.image.length > 0) {
                    setSelectedImage(`http://localhost:4000/images/${data.product.image[0]}`);
                    setSelectedImageIndex(0);
                }
                fetchProductRatings();
            } else {
                setError(data.message || 'Failed to fetch product details');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductRatings = async () => {
        try {
            setLoadingRatings(true);
            const response = await fetch('http://localhost:4000/api/rating/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId })
            });

            const data = await response.json();
            
            if (data.success) {
                setRatings(data.ratings || []);
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoadingRatings(false);
        }
    };

    const handleImageSelect = (imageName, index) => {
        setSelectedImage(`http://localhost:4000/images/${imageName}`);
        setSelectedImageIndex(index);
    };

    const openFullScreenImage = (imageName, index) => {
        setFullScreenImage(`http://localhost:4000/images/${imageName}`);
        setFullScreenImageIndex(index);
    };

    const closeFullScreenImage = () => {
        setFullScreenImage(null);
        setFullScreenImageIndex(0);
    };

    const navigateFullScreenImage = (direction) => {
        const totalImages = product.image.length;
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (fullScreenImageIndex + 1) % totalImages;
        } else {
            newIndex = (fullScreenImageIndex - 1 + totalImages) % totalImages;
        }
        
        setFullScreenImageIndex(newIndex);
        setFullScreenImage(`http://localhost:4000/images/${product.image[newIndex]}`);
    };

    const checkLoginAndProceed = (callback) => {
        if (!user) {
            setShowUserLogin(true);
            return false;
        }
        callback();
        return true;
    };

    const handleQuantityChange = async (change) => {
        if (!checkLoginAndProceed(() => {})) return;
        
        const currentQuantity = cartItems[product._id] || 0;
        const newQuantity = currentQuantity + change;
        
        if (newQuantity >= 0 && newQuantity <= product.stock) {
            await updateCartItem(product._id, newQuantity);
        }
    };

    const handleQuantitySelect = async (e) => {
        if (!checkLoginAndProceed(() => {})) {
            e.target.value = cartItems[product._id] || 0;
            return;
        }
        
        const newQuantity = parseInt(e.target.value);
        if (newQuantity >= 0 && newQuantity <= product.stock) {
            await updateCartItem(product._id, newQuantity);
        }
    };

    const handleBuyNow = () => {
        if (!checkLoginAndProceed(() => {})) return;
        
        if (currentQuantity === 0) {
            alert('Please select a quantity first');
            return;
        }
        navigate('/cart');
    };

    const renderStars = (rating, size = 'small') => {
        const starSize = size === 'large' ? 'w-6 h-6' : 'w-4 h-4';
        return Array(5).fill('').map((_, i) => (
            <svg 
                key={i} 
                className={`${starSize} ${rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    const renderRatingDistribution = () => {
        if (ratings.length === 0) return null;

        const distribution = [0, 0, 0, 0, 0];
        ratings.forEach(rating => {
            if (rating.rating >= 1 && rating.rating <= 5) {
                distribution[rating.rating - 1]++;
            }
        });

        return (
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rating Distribution</h4>
                {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center mb-1">
                        <span className="text-sm w-3">{star}</span>
                        <svg className="w-4 h-4 text-yellow-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 mx-2">
                            <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-yellow-400 h-2 rounded-full" 
                                    style={{ width: `${ratings.length > 0 ? (distribution[star - 1] / ratings.length) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{distribution[star - 1]}</span>
                    </div>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const FullScreenImageModal = () => {
        if (!fullScreenImage) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
                <div className="relative max-w-7xl max-h-full p-4">
                    <button
                        onClick={closeFullScreenImage}
                        className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {product.image.length > 1 && (
                        <>
                            <button
                                onClick={() => navigateFullScreenImage('prev')}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={() => navigateFullScreenImage('next')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    <img
                        src={fullScreenImage}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {product.image.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                            {fullScreenImageIndex + 1} / {product.image.length}
                        </div>
                    )}
                </div>

                <div 
                    className="absolute inset-0 -z-10" 
                    onClick={closeFullScreenImage}
                ></div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bb86fc]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Product not found</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const currentQuantity = cartItems[product._id] || 0;
    const displayedReviews = showAllReviews ? ratings : ratings.slice(0, 3);

    return (
        <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32 mb-16">
            <Breadcrumb 
                items={[
                    { label: 'Home', path: '/' },
                    { label: 'Products', path: '/products' },
                    { label: product.name }
                ]}
            />

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex gap-4 lg:w-1/2">
                    <div className="flex flex-col gap-3">
                        {product.image && product.image.map((imageName, index) => (
                            <div
                                key={index}
                                className={`border-2 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition ${
                                    selectedImage === `http://localhost:4000/images/${imageName}`
                                        ? 'border-[#bb86fc]'
                                        : 'border-gray-300 hover:border-[#bb86fc]/50'
                                }`}
                            >
                                <img
                                    src={`http://localhost:4000/images/${imageName}`}
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onClick={() => handleImageSelect(imageName, index)}
                                    onDoubleClick={() => openFullScreenImage(imageName, index)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 border-2 border-gray-300 rounded-lg overflow-hidden max-w-md">
                        <img
                            src={selectedImage || '/placeholder-image.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => {
                                const imageIndex = selectedImageIndex !== undefined ? selectedImageIndex : 0;
                                const imageName = product.image && product.image[imageIndex] ? product.image[imageIndex] : product.image[0];
                                
                                if (imageName) {
                                    openFullScreenImage(imageName, imageIndex);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {renderStars(product.rating || 0, 'large')}
                            </div>
                            <span className="text-xl font-semibold text-gray-900">
                                {product.rating ? product.rating.toFixed(1) : '0.0'}
                            </span>
                        </div>
                        <div className="text-gray-600">
                            <span className="font-medium">{product.totalRatings || 0}</span> review{product.totalRatings !== 1 ? 's' : ''}
                        </div>
                    </div>

                    <div className="mb-6">
                        {product.price !== product.offerprice && (
                            <p className="text-lg text-gray-500 line-through">MRP: ${product.price}</p>
                        )}
                        <p className="text-3xl font-bold text-[#bb86fc]">MRP: ${product.offerprice}</p>
                        <p className="text-sm text-gray-500">(inclusive of all taxes)</p>
                    </div>

                    <div className="mb-6">
                        {product.stock > 0 ? (
                            <div>
                                <p className="text-green-600 font-medium">In Stock ({product.stock} available)</p>
                                {user && currentQuantity > 0 && (
                                    <p className="text-[#bb86fc] font-medium">In Cart: {currentQuantity}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-red-600 font-medium">Out of Stock</p>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Painting</h3>
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    {product.stock > 0 && (
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Quantity {!user && <span className="text-red-500">*Login required</span>}
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={!user || currentQuantity <= 0}
                                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={!user ? "Please login to modify quantity" : ""}
                                    >
                                        -
                                    </button>
                                    <select 
                                        value={user ? currentQuantity : 0}
                                        onChange={handleQuantitySelect}
                                        disabled={!user}
                                        className="px-3 py-2 border-l border-r border-gray-300 outline-none bg-white min-w-[60px] text-center disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        title={!user ? "Please login to select quantity" : ""}
                                    >
                                        {Array.from({length: Math.min(product.stock + 1, 11)}, (_, i) => (
                                            <option key={i} value={i}>{i}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={!user || currentQuantity >= product.stock}
                                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={!user ? "Please login to modify quantity" : ""}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {user ? (
                                        currentQuantity > 0 ? (
                                            <span>Subtotal: <span className="font-semibold text-[#bb86fc]">${(product.offerprice * currentQuantity).toFixed(2)}</span></span>
                                        ) : (
                                            <span>Select quantity to add to cart</span>
                                        )
                                    ) : (
                                        <span className="text-red-600">Please login to purchase</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {product.stock > 0 ? (
                            !user ? (
                                <button 
                                    onClick={() => setShowUserLogin(true)}
                                    className="w-full py-3 px-6 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition font-medium"
                                >
                                    Login to Purchase
                                </button>
                            ) : (
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={currentQuantity === 0}
                                    className="w-full py-3 px-6 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {currentQuantity > 0 ? 'Proceed to Cart' : 'Select Quantity First'}
                                </button>
                            )
                        ) : (
                            <button disabled className="w-full py-3 px-6 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium">
                                Out of Stock
                            </button>
                        )}
                    </div>

                    {user && currentQuantity > 0 && (
                        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center text-green-800">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">
                                    {currentQuantity} item{currentQuantity > 1 ? 's' : ''} added to cart
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                            {ratings.length > 0 && (
                                <span className="text-sm text-gray-600">
                                    Based on {ratings.length} review{ratings.length !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        
                        {loadingRatings ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bb86fc]"></div>
                            </div>
                        ) : ratings.length > 0 ? (
                            <div>
                                {renderRatingDistribution()}
                                
                                <div className="space-y-6">
                                    {displayedReviews.map((rating, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[#bb86fc] rounded-full flex items-center justify-center text-white font-semibold">
                                                        {rating.userId?.name?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {rating.userId?.name || 'Anonymous'}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex items-center gap-0.5">
                                                                {renderStars(rating.rating)}
                                                            </div>
                                                            <span className="text-sm text-gray-600">
                                                                {rating.rating}.0 out of 5
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(rating.createdAt)}
                                                </span>
                                            </div>
                                            {rating.review && (
                                                <p className="text-gray-700 ml-13 leading-relaxed">{rating.review}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {ratings.length > 3 && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => setShowAllReviews(!showAllReviews)}
                                            className="px-6 py-2 border border-[#bb86fc] text-[#bb86fc] rounded-lg hover:bg-[#bb86fc] hover:text-white transition"
                                        >
                                            {showAllReviews ? `Show Less` : `Show All ${ratings.length} Reviews`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                                <p className="text-gray-500">Be the first to review this product after purchasing!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FullScreenImageModal />
        </div>
    );
};

export default ProductDetails;