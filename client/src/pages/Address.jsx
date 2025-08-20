import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const Address = () => {
    const { user, setShowUserLogin, navigate } = useAppContext();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: ''
    });

    useEffect(() => {
        if (!user) {
            setShowUserLogin(true);
            navigate('/');
            return;
        }
        fetchAddresses();
    }, [user]);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/address/list', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/address/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                alert('Address added successfully!');
                setFormData({ firstName: '', lastName: '', address: '', city: '' });
                setShowForm(false);
                fetchAddresses();
            } else {
                alert(data.message || 'Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            alert('Failed to add address');
        }
    };

    const handleDelete = async (addressId) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const response = await fetch('http://localhost:4000/api/address/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id: addressId })
            });

            const data = await response.json();
            if (data.success) {
                alert('Address deleted successfully!');
                fetchAddresses();
            } else {
                alert(data.message || 'Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address');
        }
    };

    const setDefault = async (addressId) => {
        try {
            const response = await fetch('http://localhost:4000/api/address/default', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id: addressId })
            });

            const data = await response.json();
            if (data.success) {
                fetchAddresses();
            } else {
                alert(data.message || 'Failed to set default address');
            }
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="mt-16 px-6 md:px-16 lg:px-24 xl:px-32 mb-16">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-medium text-[#6b46c1]">My Addresses</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition"
                    >
                        Add New Address
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Add New Address</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc]"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc]"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Address"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc]"
                                required
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc]"
                                required
                            />
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition"
                                >
                                    Save Address
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bb86fc]"></div>
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No addresses found</p>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] transition"
                            >
                                Add Your First Address
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div key={address._id} className="border border-gray-300 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {address.firstName} {address.lastName}
                                            {address.isDefault && (
                                                <span className="ml-2 px-2 py-1 bg-[#bb86fc] text-white text-xs rounded">
                                                    Default
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            {address.address}<br/>
                                            {address.city}, {address.country}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => setDefault(address._id)}
                                                className="text-[#bb86fc] hover:underline text-sm"
                                            >
                                                Set Default
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(address._id)}
                                            className="text-red-500 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8">
                    <button
                        onClick={() => navigate('/cart')}
                        className="text-[#bb86fc] hover:underline"
                    >
                        ← Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Address;