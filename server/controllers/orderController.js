import Order from "../models/Order.js";
import User from "../models/user.js";
import Product from "../models/Product.js";

const placeOrder = async (req, res) => {
    try {
        const { items, amount, address, paymentMethod } = req.body;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.json({ success: false, message: `Product ${item.name} not found` });
            }
            
            if (product.stock < item.quantity) {
                return res.json({ 
                    success: false, 
                    message: `Insufficient stock for ${item.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }
        }

        const orderData = {
            userId: req.userId,
            items,
            address,
            amount,
            paymentMethod,
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderData);
        await newOrder.save();

        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        await User.findByIdAndUpdate(req.userId, { cartItems: {} });

        res.json({ success: true, message: "Order Placed", orderId: newOrder._id });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({ date: -1 });
        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


const getSingleOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, getUserOrders, getAllOrders, updateStatus, getSingleOrder };