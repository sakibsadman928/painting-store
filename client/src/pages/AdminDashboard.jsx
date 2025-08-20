import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [activeSection, setActiveSection] = useState('overview');
    
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [productStats, setProductStats] = useState({});
    
    const [exhibitions, setExhibitions] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [exhibitionStats, setExhibitionStats] = useState({});
    
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(false);
    
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingExhibition, setEditingExhibition] = useState(null);
    
    const { navigate, setShowUserLogin } = useAppContext();

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    useEffect(() => {
        if (products.length || orders.length || exhibitions.length || tickets.length) {
            fetchStats();
        }
    }, [products, orders, exhibitions, tickets]);

    const checkAuthAndFetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/admin/status', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.isAdmin) {
                await fetchData();
            } else {
                handleAuthError();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            handleAuthError();
        }
    };

    const handleAuthError = () => {
        setAuthError(true);
        setShowUserLogin(true);
        navigate('/');
    };

    const apiCall = async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                credentials: 'include',
                ...options
            });
            
            const data = await response.json();
            
            if (data.isAuthError || response.status === 401) {
                handleAuthError();
                return null;
            }
            
            return data;
        } catch (error) {
            console.error(`API call failed for ${url}:`, error);
            return null;
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchProducts(),
                fetchOrders(),
                fetchExhibitions(),
                fetchTickets()
            ]);
            await fetchStats();
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        const data = await apiCall('http://localhost:4000/api/product/list?limit=100');
        if (data && data.success) setProducts(data.products);
    };

    const fetchOrders = async () => {
        const data = await apiCall('http://localhost:4000/api/order/list');
        if (data && data.success) setOrders(data.orders);
    };

    const fetchExhibitions = async () => {
        const data = await apiCall('http://localhost:4000/api/exhibition/list');
        if (data && data.success) setExhibitions(data.exhibitions);
    };

    const fetchTickets = async () => {
        const data = await apiCall('http://localhost:4000/api/admin/tickets');
        if (data && data.success) {
            setTickets(data.tickets);
        } else {
            setTickets([]);
        }
    };

    const fetchStats = async () => {
        try {
            const productData = await apiCall('http://localhost:4000/api/admin/stats/products');
            if (productData && productData.success) {
                setProductStats(productData.stats);
            }

            const exhibitionData = await apiCall('http://localhost:4000/api/admin/stats/exhibitions');
            if (exhibitionData && exhibitionData.success) {
                setExhibitionStats(exhibitionData.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            const productRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
            const ticketRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalAmount, 0);
            
            setProductStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                totalRevenue: productRevenue
            });
            
            setExhibitionStats({
                totalExhibitions: exhibitions.length,
                totalTicketsSold: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
                totalRevenue: ticketRevenue
            });
        }
    };

    const adminLogout = async () => {
        try {
            await fetch('http://localhost:4000/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
            navigate('/');
        } catch (error) {
            console.error('Error during admin logout:', error);
            navigate('/');
        }
    };

    const AddProductForm = () => {
        const [formData, setFormData] = useState({
            name: '', description: '', price: '', offerprice: '', stock: ''
        });
        const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
        const [submitting, setSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setSubmitting(true);

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
            Object.keys(images).forEach(key => {
                if (images[key]) formDataToSend.append(key, images[key]);
            });

            const data = await apiCall('http://localhost:4000/api/product/add', {
                method: 'POST',
                body: formDataToSend
            });

            if (data && data.success) {
                alert('Product added successfully!');
                setFormData({ name: '', description: '', price: '', offerprice: '', stock: '' });
                setImages({ image1: null, image2: null, image3: null, image4: null });
                fetchProducts();
            } else {
                alert(data?.message || 'Failed to add product');
            }
            
            setSubmitting(false);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded border">
                <h3 className="text-lg font-medium text-[#6b46c1]">Add New Product</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        required
                        disabled={submitting}
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        required
                        disabled={submitting}
                    />
                </div>
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                    rows="3"
                    required
                    disabled={submitting}
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="Original Price"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        step="0.01"
                        required
                        disabled={submitting}
                    />
                    <input
                        type="number"
                        placeholder="Offer Price"
                        value={formData.offerprice}
                        onChange={(e) => setFormData({...formData, offerprice: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        step="0.01"
                        required
                        disabled={submitting}
                    />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {['image1', 'image2', 'image3', 'image4'].map((key, i) => (
                        <input
                            key={key}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImages({...images, [key]: e.target.files[0]})}
                            className="p-1 border rounded text-sm"
                            required={i === 0}
                            disabled={submitting}
                        />
                    ))}
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Adding Product...' : 'Add Product'}
                </button>
            </form>
        );
    };

    const EditProductModal = ({ product, onClose, onUpdate }) => {
        const [formData, setFormData] = useState({
            name: product.name,
            description: product.description,
            price: product.price,
            offerprice: product.offerprice,
            stock: product.stock
        });
        const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
        const [submitting, setSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setSubmitting(true);

            const formDataToSend = new FormData();
            formDataToSend.append('id', product._id);
            Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
            Object.keys(images).forEach(key => {
                if (images[key]) formDataToSend.append(key, images[key]);
            });

            const data = await apiCall('http://localhost:4000/api/product/update', {
                method: 'PUT',
                body: formDataToSend
            });

            if (data && data.success) {
                alert('Product updated successfully!');
                onUpdate();
                onClose();
            } else {
                alert(data?.message || 'Failed to update product');
            }
            
            setSubmitting(false);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[#6b46c1]">Edit Product</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                required
                                disabled={submitting}
                            />
                            <input
                                type="number"
                                placeholder="Stock"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                required
                                disabled={submitting}
                            />
                        </div>
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                            rows="3"
                            required
                            disabled={submitting}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Original Price"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                step="0.01"
                                required
                                disabled={submitting}
                            />
                            <input
                                type="number"
                                placeholder="Offer Price"
                                value={formData.offerprice}
                                onChange={(e) => setFormData({...formData, offerprice: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                step="0.01"
                                required
                                disabled={submitting}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {['image1', 'image2', 'image3', 'image4'].map((key, i) => (
                                <input
                                    key={key}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImages({...images, [key]: e.target.files[0]})}
                                    className="p-1 border rounded text-sm"
                                    disabled={submitting}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">Leave image fields empty to keep existing images</p>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] disabled:opacity-50"
                            >
                                {submitting ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const AddExhibitionForm = () => {
        const [formData, setFormData] = useState({
            title: '', description: '', eventDate: '', eventTime: '',
            venue: 'Palette Play Gallery', totalTickets: '', ticketPrice: ''
        });
        const [image, setImage] = useState(null);
        const [submitting, setSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setSubmitting(true);

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
            if (image) formDataToSend.append('image', image);

            const data = await apiCall('http://localhost:4000/api/exhibition/add', {
                method: 'POST',
                body: formDataToSend
            });

            if (data && data.success) {
                alert('Exhibition added successfully!');
                setFormData({
                    title: '', description: '', eventDate: '', eventTime: '',
                    venue: 'Palette Play Gallery', totalTickets: '', ticketPrice: ''
                });
                setImage(null);
                fetchExhibitions();
            } else {
                alert(data?.message || 'Failed to add exhibition');
            }
            
            setSubmitting(false);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded border">
                <h3 className="text-lg font-medium text-[#6b46c1]">Add New Exhibition</h3>
                <input
                    type="text"
                    placeholder="Exhibition Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                    required
                    disabled={submitting}
                />
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                    rows="3"
                    required
                    disabled={submitting}
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        min={new Date().toISOString().split('T')[0]}
                        required
                        disabled={submitting}
                    />
                    <input
                        type="time"
                        value={formData.eventTime}
                        onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        required
                        disabled={submitting}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                    required
                    disabled={submitting}
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="Total Tickets"
                        value={formData.totalTickets}
                        onChange={(e) => setFormData({...formData, totalTickets: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        min="1"
                        required
                        disabled={submitting}
                    />
                    <input
                        type="number"
                        placeholder="Ticket Price"
                        value={formData.ticketPrice}
                        onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                        className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc] focus:border-[#bb86fc]"
                        step="0.01"
                        min="0"
                        required
                        disabled={submitting}
                    />
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full p-2 border rounded"
                    disabled={submitting}
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Adding Exhibition...' : 'Add Exhibition'}
                </button>
            </form>
        );
    };

    const EditExhibitionModal = ({ exhibition, onClose, onUpdate }) => {
        const [formData, setFormData] = useState({
            title: exhibition.title,
            description: exhibition.description,
            eventDate: new Date(exhibition.eventDate).toISOString().split('T')[0],
            eventTime: exhibition.eventTime,
            venue: exhibition.venue,
            totalTickets: exhibition.totalTickets,
            ticketPrice: exhibition.ticketPrice
        });
        const [image, setImage] = useState(null);
        const [submitting, setSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setSubmitting(true);

            const formDataToSend = new FormData();
            formDataToSend.append('exhibitionId', exhibition._id);
            Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
            if (image) formDataToSend.append('image', image);

            const data = await apiCall('http://localhost:4000/api/exhibition/update', {
                method: 'PUT',
                body: formDataToSend
            });

            if (data && data.success) {
                alert('Exhibition updated successfully!');
                onUpdate();
                onClose();
            } else {
                alert(data?.message || 'Failed to update exhibition');
            }
            
            setSubmitting(false);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[#6b46c1]">Edit Exhibition</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Exhibition Title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                            required
                            disabled={submitting}
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                            rows="3"
                            required
                            disabled={submitting}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                value={formData.eventDate}
                                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                required
                                disabled={submitting}
                            />
                            <input
                                type="time"
                                value={formData.eventTime}
                                onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                required
                                disabled={submitting}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Venue"
                            value={formData.venue}
                            onChange={(e) => setFormData({...formData, venue: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                            required
                            disabled={submitting}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Total Tickets"
                                value={formData.totalTickets}
                                onChange={(e) => setFormData({...formData, totalTickets: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                min="1"
                                required
                                disabled={submitting}
                            />
                            <input
                                type="number"
                                placeholder="Ticket Price"
                                value={formData.ticketPrice}
                                onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})}
                                className="p-2 border rounded focus:ring-2 focus:ring-[#bb86fc]"
                                step="0.01"
                                min="0"
                                required
                                disabled={submitting}
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full p-2 border rounded"
                            disabled={submitting}
                        />
                        <p className="text-sm text-gray-500">Leave image field empty to keep existing image</p>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5] disabled:opacity-50"
                            >
                                {submitting ? 'Updating...' : 'Update Exhibition'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const StatsCards = ({ stats, type }) => (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded border">
                <div className="text-2xl font-bold text-[#bb86fc]">
                    {type === 'products' ? (stats.totalProducts || 0) : (stats.totalExhibitions || 0)}
                </div>
                <div className="text-sm text-gray-600">
                    Total {type === 'products' ? 'Products' : 'Exhibitions'}
                </div>
            </div>
            <div className="bg-white p-4 rounded border">
                <div className="text-2xl font-bold text-[#bb86fc]">
                    {type === 'products' ? (stats.totalOrders || 0) : (stats.totalTicketsSold || 0)}
                </div>
                <div className="text-sm text-gray-600">
                    {type === 'products' ? 'Total Orders' : 'Tickets Sold'}
                </div>
            </div>
            <div className="bg-white p-4 rounded border">
                <div className="text-2xl font-bold text-[#bb86fc]">
                    ${stats.totalRevenue || 0}
                </div>
                <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
        </div>
    );

    const DataTable = ({ data, type, onUpdate }) => {
        const handleDelete = async (id, endpoint) => {
            if (!window.confirm('Are you sure?')) return;
            
            const data = await apiCall(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [type === 'products' ? 'id' : 'exhibitionId']: id })
            });

            if (data && data.success) {
                alert('Deleted successfully');
                onUpdate();
            } else {
                alert(data?.message || 'Failed to delete');
            }
        };

        const handleStatusUpdate = async (id, status, endpoint) => {
            const data = await apiCall(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    [type === 'orders' ? 'orderId' : 'exhibitionId']: id, 
                    status 
                })
            });

            if (data && data.success) {
                onUpdate();
            } else {
                alert(data?.message || 'Failed to update');
            }
        };

        if (data.length === 0) {
            return <div className="bg-white p-8 rounded border text-center text-gray-500">No data found</div>;
        }

        return (
            <div className="bg-white rounded border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {type === 'products' && (
                                    <>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </>
                                )}
                                {type === 'orders' && (
                                    <>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </>
                                )}
                                {type === 'exhibitions' && (
                                    <>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exhibition</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </>
                                )}
                                {type === 'tickets' && (
                                    <>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exhibition</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    {type === 'products' && (
                                        <>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={item.image?.[0] ? `http://localhost:4000/images/${item.image[0]}` : '/placeholder-image.jpg'}
                                                        alt={item.name}
                                                        className="h-10 w-10 rounded object-cover mr-3"
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <span className="font-medium text-[#bb86fc]">${item.offerprice}</span>
                                                {item.price !== item.offerprice && (
                                                    <span className="ml-2 text-gray-500 line-through">${item.price}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm">{item.stock}</td>
                                            <td className="px-4 py-4 text-sm space-x-2">
                                                <button
                                                    onClick={() => setEditingProduct(item)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id, 'http://localhost:4000/api/product/remove')}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
                                    {type === 'orders' && (
                                        <>
                                            <td className="px-4 py-4 text-sm">#{item._id.slice(-8)}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-[#bb86fc]">${item.amount}</td>
                                            <td className="px-4 py-4 text-sm">
                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusUpdate(item._id, e.target.value, 'http://localhost:4000/api/order/status')}
                                                    className="text-sm border rounded px-2 py-1"
                                                >
                                                    <option value="Order Placed">Order Placed</option>
                                                    <option value="Packing">Packing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                        </>
                                    )}
                                    {type === 'exhibitions' && (
                                        <>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={item.image ? `http://localhost:4000/images/${item.image}` : '/placeholder-exhibition.jpg'}
                                                        alt={item.title}
                                                        className="h-10 w-10 rounded object-cover mr-3"
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                                        <div className="text-sm text-gray-500">{item.venue}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                {new Date(item.eventDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                {item.availableTickets}/{item.totalTickets}
                                            </td>
                                            <td className="px-4 py-4 text-sm space-x-2">
                                                <button
                                                    onClick={() => setEditingExhibition(item)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id, 'http://localhost:4000/api/admin/exhibition/delete')}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
                                    {type === 'tickets' && (
                                        <>
                                            <td className="px-4 py-4 text-sm font-medium">{item.ticketNumber}</td>
                                            <td className="px-4 py-4 text-sm">{item.exhibitionId?.title || 'N/A'}</td>
                                            <td className="px-4 py-4 text-sm">{item.quantity}</td>
                                            <td className="px-4 py-4 text-sm font-medium text-[#bb86fc]">${item.totalAmount}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (authError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-4">Please login with admin credentials to access the dashboard.</p>
                    <button
                        onClick={() => {
                            setShowUserLogin(true);
                            setAuthError(false);
                        }}
                        className="px-4 py-2 bg-[#bb86fc] text-white rounded hover:bg-[#9b6fe5]"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bb86fc]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-[#6b46c1]">Admin Dashboard</h1>
                    <button
                        onClick={adminLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
                
                <div className="flex space-x-1 mb-6">
                    <button
                        onClick={() => { setActiveTab('products'); setActiveSection('overview'); }}
                        className={`px-6 py-2 rounded ${activeTab === 'products' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => { setActiveTab('exhibitions'); setActiveSection('overview'); }}
                        className={`px-6 py-2 rounded ${activeTab === 'exhibitions' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                    >
                        Exhibitions
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setActiveSection('overview')}
                        className={`px-4 py-2 text-sm rounded ${activeSection === 'overview' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                    >
                        Overview
                    </button>
                    {activeTab === 'products' && (
                        <>
                            <button
                                onClick={() => setActiveSection('add-product')}
                                className={`px-4 py-2 text-sm rounded ${activeSection === 'add-product' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                            >
                                Add Product
                            </button>
                            <button
                                onClick={() => setActiveSection('products')}
                                className={`px-4 py-2 text-sm rounded ${activeSection === 'products' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                            >
                                All Products ({products.length})
                            </button>
                            <button
                                onClick={() => setActiveSection('orders')}
                                className={`px-4 py-2 text-sm rounded ${activeSection === 'orders' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                            >
                                Orders ({orders.length})
                            </button>
                        </>
                    )}
                    {activeTab === 'exhibitions' && (
                        <>
                            <button
                                onClick={() => setActiveSection('add-exhibition')}
                                className={`px-4 py-2 text-sm rounded ${activeSection === 'add-exhibition' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                            >
                                Add Exhibition
                            </button>
                            <button
                                onClick={() => setActiveSection('exhibitions')}
                                className={`px-4 py-2 text-sm rounded ${activeSection === 'exhibitions' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                            >
                                All Exhibitions ({exhibitions.length})
                            </button>
                            <button
                                onClick={() => setActiveSection('tickets')}
                                className={`px-4 py-2 text-sm rounded ${activeSection === 'tickets' ? 'bg-[#bb86fc] text-white' : 'bg-white text-gray-600'}`}
                            >
                                Tickets ({tickets.length})
                            </button>
                        </>
                    )}
                </div>

                {activeSection === 'overview' && (
                    <StatsCards 
                        stats={activeTab === 'products' ? productStats : exhibitionStats} 
                        type={activeTab} 
                    />
                )}
                {activeSection === 'add-product' && <AddProductForm />}
                {activeSection === 'add-exhibition' && <AddExhibitionForm />}
                {activeSection === 'products' && <DataTable data={products} type="products" onUpdate={fetchProducts} />}
                {activeSection === 'orders' && <DataTable data={orders} type="orders" onUpdate={fetchOrders} />}
                {activeSection === 'exhibitions' && <DataTable data={exhibitions} type="exhibitions" onUpdate={fetchExhibitions} />}
                {activeSection === 'tickets' && <DataTable data={tickets} type="tickets" onUpdate={fetchTickets} />}

                {editingProduct && (
                    <EditProductModal 
                        product={editingProduct} 
                        onClose={() => setEditingProduct(null)} 
                        onUpdate={fetchProducts} 
                    />
                )}

                {editingExhibition && (
                    <EditExhibitionModal 
                        exhibition={editingExhibition} 
                        onClose={() => setEditingExhibition(null)} 
                        onUpdate={fetchExhibitions} 
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;