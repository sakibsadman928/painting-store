import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [productOrders, setProductOrders] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);
    const [hasAlreadyRated, setHasAlreadyRated] = useState(false);
    const [existingRating, setExistingRating] = useState(null);

    const { user, setShowUserLogin, navigate } = useAppContext();

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate('/');
            return;
        }
        fetchOrders();
        fetchTickets();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/order/userorders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setProductOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load product orders');
        }
    };

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/exhibition/tickets', {
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success) {
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const openRatingModal = async (product) => {
        setSelectedProduct(product);
        setShowRatingModal(true);
        setUserRating(0);
        setUserReview('');
        setHasAlreadyRated(false);
        setExistingRating(null);
        
        try {
            const response = await fetch('http://localhost:4000/api/rating/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ productId: product.productId })
            });

            const data = await response.json();
            if (data.success) {
                if (data.hasAlreadyRated && data.userRating) {
                    setHasAlreadyRated(true);
                    setExistingRating(data.userRating);
                    setUserRating(data.userRating.rating);
                    setUserReview(data.userRating.review || '');
                }
            }
        } catch (error) {
            console.error('Error fetching user rating:', error);
        }
    };

    const submitRating = async () => {
        if (hasAlreadyRated) {
            alert('You have already rated this product. Each product can only be rated once.');
            return;
        }

        if (userRating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmittingRating(true);

        try {
            const response = await fetch('http://localhost:4000/api/rating/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId: selectedProduct.productId,
                    rating: userRating,
                    review: userReview
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Rating submitted successfully!');
                setShowRatingModal(false);
                setSelectedProduct(null);
                setUserRating(0);
                setUserReview('');
                setHasAlreadyRated(false);
                setExistingRating(null);
            } else {
                alert(data.message || 'Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit rating');
        } finally {
            setSubmittingRating(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'used':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'Order Placed':
                return 'bg-blue-100 text-blue-800';
            case 'Packing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800';
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const RatingModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {hasAlreadyRated ? 'Your Rating' : 'Rate Product'}
                    </h3>
                    <button
                        onClick={() => setShowRatingModal(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4">
                    <p className="font-medium text-gray-900 mb-2">{selectedProduct?.name}</p>
                    
                    {hasAlreadyRated && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 text-sm font-medium">
                                ✓ You have already rated this product
                            </p>
                            <p className="text-blue-600 text-xs mt-1">
                                Ratings cannot be changed once submitted
                            </p>
                        </div>
                    )}
                    
                    <div className="flex items-center space-x-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => !hasAlreadyRated && setUserRating(star)}
                                disabled={hasAlreadyRated}
                                className={`focus:outline-none ${hasAlreadyRated ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <svg 
                                    className={`w-8 h-8 ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'} ${!hasAlreadyRated ? 'hover:text-yellow-400' : ''} transition-colors`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={userReview}
                        onChange={(e) => !hasAlreadyRated && setUserReview(e.target.value)}
                        placeholder={hasAlreadyRated ? "Your review" : "Write your review (optional)"}
                        disabled={hasAlreadyRated}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        rows="4"
                        readOnly={hasAlreadyRated}
                    />
                    {hasAlreadyRated && existingRating && (
                        <p className="text-xs text-gray-500 mt-2">
                            Submitted on {new Date(existingRating.createdAt).toLocaleDateString()}
                        </p>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => setShowRatingModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Close
                    </button>
                    {!hasAlreadyRated && (
                        <button
                            onClick={submitRating}
                            disabled={submittingRating || userRating === 0}
                            className="flex-1 px-4 py-2 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submittingRating ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderProductOrders = () => {
        if (productOrders.length === 0) {
            return (
                <div className='text-center py-12'>
                    <svg className='mx-auto h-16 w-16 text-gray-400 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>No product orders found</h3>
                    <p className='text-gray-500'>When you purchase paintings, they will appear here.</p>
                </div>
            );
        }

        return (
            <div className='space-y-4'>
                {productOrders.map(order => (
                    <div key={order._id} className='bg-white border border-gray-200 rounded-lg p-6'>
                        <div className='flex justify-between items-start mb-4'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900'>Order #{order._id.slice(-8)}</h3>
                                <p className='text-sm text-gray-500'>{formatDate(order.date)}</p>
                            </div>
                            <div className='text-right'>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <p className='text-lg font-semibold text-[#bb86fc] mt-1'>${order.amount}</p>
                            </div>
                        </div>
                        
                        <div className='border-t pt-4'>
                            <h4 className='font-medium text-gray-900 mb-3'>Order Items:</h4>
                            <div className='space-y-3'>
                                {order.items.map((item, index) => {
                                    const isProductDeleted = !item.name || item.name.trim() === '';
                                    
                                    return (
                                        <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                                            <div className='flex items-center space-x-4'>
                                                <div className='w-16 h-16 bg-white border border-gray-300 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center'>
                                                    {isProductDeleted ? (
                                                        <span className='text-gray-500 text-xs text-center px-1'>Product not found</span>
                                                    ) : item.image ? (
                                                        <img 
                                                            src={`http://localhost:4000/images/${item.image}`} 
                                                            alt={item.name}
                                                            className='w-full h-full object-cover'
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerHTML = '<span class="text-gray-500 text-xs text-center px-1">Product not found</span>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className='text-gray-500 text-xs text-center px-1'>Product not found</span>
                                                    )}
                                                </div>
                                                <div className='flex-1'>
                                                    <h5 className='font-medium text-gray-900'>
                                                        {isProductDeleted ? 'Product no longer available' : item.name}
                                                    </h5>
                                                    <div className='flex items-center justify-between text-sm text-gray-600 mt-1'>
                                                        <span>Quantity: {item.quantity}</span>
                                                        <span className='font-medium text-[#bb86fc]'>${item.price} each</span>
                                                    </div>
                                                    <p className='text-sm text-gray-500 mt-1'>
                                                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            {order.status === 'Delivered' && !isProductDeleted && (
                                                <button
                                                    onClick={() => openRatingModal(item)}
                                                    className='px-4 py-2 text-sm bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition'
                                                >
                                                    View/Rate Product
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='mt-4 pt-3 border-t border-gray-200'>
                                <div className='flex justify-between text-sm text-gray-600'>
                                    <span>Payment Method:</span>
                                    <span>{order.paymentMethod}</span>
                                </div>
                                <div className='flex justify-between text-sm text-gray-600 mt-1'>
                                    <span>Total Items:</span>
                                    <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderTickets = () => {
        if (tickets.length === 0) {
            return (
                <div className='text-center py-12'>
                    <svg className='mx-auto h-16 w-16 text-gray-400 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' />
                    </svg>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>No tickets found</h3>
                    <p className='text-gray-500'>When you purchase exhibition tickets, they will appear here.</p>
                </div>
            );
        }

        return (
            <div className='space-y-4'>
                {tickets.map(ticket => {
                    const exhibition = ticket.exhibitionId;
                    const isExhibitionDeleted = !exhibition || !exhibition.title;
                    
                    return (
                        <div key={ticket._id} className='bg-white border border-gray-200 rounded-lg p-6'>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900'>
                                        {isExhibitionDeleted ? 'Exhibition no longer available' : exhibition.title}
                                    </h3>
                                    <p className='text-sm font-medium text-[#bb86fc]'>Ticket #{ticket.ticketNumber}</p>
                                </div>
                                <div className='text-right'>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.ticketStatus)}`}>
                                        {ticket.ticketStatus.charAt(0).toUpperCase() + ticket.ticketStatus.slice(1)}
                                    </span>
                                    <p className='text-lg font-semibold text-[#bb86fc] mt-1'>${ticket.totalAmount}</p>
                                </div>
                            </div>
                            
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4'>
                                <div>
                                    <p className='text-sm text-gray-600 mb-1'>
                                        <span className='font-medium'>Event Date:</span> {
                                            isExhibitionDeleted ? 'N/A' : 
                                            exhibition.eventDate ? formatDate(exhibition.eventDate) : 'N/A'
                                        }
                                    </p>
                                    <p className='text-sm text-gray-600 mb-1'>
                                        <span className='font-medium'>Time:</span> {
                                            isExhibitionDeleted ? 'N/A' : 
                                            exhibition.eventTime ? formatTime(exhibition.eventTime) : 'N/A'
                                        }
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Venue:</span> {
                                            isExhibitionDeleted ? 'N/A' : 
                                            exhibition.venue || 'N/A'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600 mb-1'>
                                        <span className='font-medium'>Quantity:</span> {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                                    </p>
                                    <p className='text-sm text-gray-600 mb-1'>
                                        <span className='font-medium'>Purchase Date:</span> {formatDate(ticket.purchaseDate)}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Payment:</span> {ticket.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (!user) {
        return null;
    }

    return (
        <div className='mt-16 px-6 md:px-16 lg:px-24 xl:px-32 mb-16'>
            <div className='flex flex-col items-center w-full mb-8'>
                <h1 className='text-2xl font-medium text-[#6b46c1] mb-2'>My Orders</h1>
                <div className='w-16 h-0.5 bg-[#bb86fc] rounded-full'></div>
            </div>

            <div className='flex border-b border-gray-200 mb-6'>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                        activeTab === 'products'
                            ? 'border-[#bb86fc] text-[#bb86fc]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Product Orders ({productOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                        activeTab === 'tickets'
                            ? 'border-[#bb86fc] text-[#bb86fc]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Exhibition Tickets ({tickets.length})
                </button>
            </div>

            {loading ? (
                <div className='flex justify-center py-12'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#bb86fc]'></div>
                </div>
            ) : error ? (
                <div className='text-center py-12'>
                    <p className='text-red-500 mb-4'>{error}</p>
                    <button 
                        onClick={() => {
                            fetchOrders();
                            fetchTickets();
                        }}
                        className='px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition'
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {activeTab === 'products' && renderProductOrders()}
                    {activeTab === 'tickets' && renderTickets()}
                </>
            )}

            {showRatingModal && <RatingModal />}
        </div>
    );
};

export default MyOrders;