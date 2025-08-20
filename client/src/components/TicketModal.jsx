import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const TicketModal = ({ exhibition, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [purchaseComplete, setPurchaseComplete] = useState(false);
    const [ticketInfo, setTicketInfo] = useState(null);

    const { user, setShowUserLogin } = useAppContext();

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= Math.min(exhibition.availableTickets, 10)) {
            setQuantity(newQuantity);
        }
    };

    const handleProceedToPayment = () => {
        if (!user) {
            setShowUserLogin(true);
            return;
        }
        setShowPayment(true);
    };

    const handlePurchase = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        try {
            setLoading(true);
            
            const response = await fetch('http://localhost:4000/api/exhibition/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    exhibitionId: exhibition._id,
                    quantity,
                    paymentMethod
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setTicketInfo(data.ticket);
                setPurchaseComplete(true);
            } else {
                alert(data.message || 'Failed to purchase tickets');
            }
        } catch (error) {
            console.error('Error purchasing tickets:', error);
            alert('Failed to purchase tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const totalAmount = quantity * exhibition.ticketPrice;

    if (purchaseComplete) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-green-600 mb-2">Purchase Successful!</h3>
                        <p className="text-gray-600 mb-6">Your tickets have been purchased successfully.</p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <h4 className="font-semibold text-gray-800 mb-2">Ticket Information:</h4>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Ticket Number:</span> {ticketInfo?.ticketNumber}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Event:</span> {ticketInfo?.exhibitionId?.title}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Quantity:</span> {ticketInfo?.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Total Amount:</span> ${ticketInfo?.totalAmount}
                            </p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-6">
                            You can view your tickets in the "My Orders" section.
                        </p>
                        
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#6b46c1]">
                            {showPayment ? 'Payment' : 'Buy Tickets'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {!showPayment ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{exhibition.title}</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><span className="font-medium">Date:</span> {formatDate(exhibition.eventDate)}</p>
                                    <p><span className="font-medium">Time:</span> {formatTime(exhibition.eventTime)}</p>
                                    <p><span className="font-medium">Venue:</span> {exhibition.venue}</p>
                                    <p><span className="font-medium">Available Tickets:</span> {exhibition.availableTickets}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of Tickets
                                </label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-8 h-8 rounded-full border border-[#bb86fc] flex items-center justify-center text-[#bb86fc] hover:bg-[#bb86fc] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= Math.min(exhibition.availableTickets, 10)}
                                        className="w-8 h-8 rounded-full border border-[#bb86fc] flex items-center justify-center text-[#bb86fc] hover:bg-[#bb86fc] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Maximum 10 tickets per purchase</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span>Price per ticket:</span>
                                    <span>${exhibition.ticketPrice}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span>Quantity:</span>
                                    <span>{quantity}</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between items-center font-semibold text-lg">
                                    <span>Total:</span>
                                    <span className="text-[#bb86fc]">${totalAmount}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                className="w-full px-4 py-3 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition font-medium"
                            >
                                {user ? 'Proceed to Payment' : 'Login to Continue'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
                                
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="text-sm space-y-1">
                                        <div className="flex justify-between">
                                            <span>Event:</span>
                                            <span className="font-medium">{exhibition.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tickets:</span>
                                            <span>{quantity} × ${exhibition.ticketPrice}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total:</span>
                                            <span className="text-[#bb86fc]">${totalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <div className="space-y-2">
                                        {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Event'].map((method) => (
                                            <label key={method} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={paymentMethod === method}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="mr-3 text-[#bb86fc] focus:ring-[#bb86fc]"
                                                />
                                                <span className="text-sm">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowPayment(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePurchase}
                                    disabled={loading || !paymentMethod}
                                    className="flex-1 px-4 py-3 bg-[#bb86fc] text-white rounded-lg hover:bg-[#9b6fe5] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : 'Complete Purchase'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketModal;