import User from "../models/user.js";

const addToCart = async (req, res) => {
    try {
        const { itemId, quantity = 1 } = req.body;
        
        const userData = await User.findById(req.userId);
        let cartData = await userData.cartItems;

        if (cartData[itemId]) {
            cartData[itemId] += quantity;
        } else {
            cartData[itemId] = quantity;
        }

        await User.findByIdAndUpdate(req.userId, { cartItems: cartData });
        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateCart = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;

        const userData = await User.findById(req.userId);
        let cartData = await userData.cartItems;

        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        await User.findByIdAndUpdate(req.userId, { cartItems: cartData });
        res.json({ success: true, message: "Cart Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserCart = async (req, res) => {
    try {
        const userData = await User.findById(req.userId);
        let cartData = await userData.cartItems;
        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;

        const userData = await User.findById(req.userId);
        let cartData = await userData.cartItems;

        if (cartData[itemId]) {
            delete cartData[itemId];
        }

        await User.findByIdAndUpdate(req.userId, { cartItems: cartData });
        res.json({ success: true, message: "Removed From Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const clearCart = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId, { cartItems: {} });
        res.json({ success: true, message: "Cart Cleared" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getCartCount = async (req, res) => {
    try {
        const userData = await User.findById(req.userId);
        const cartData = userData.cartItems;
        
        let totalCount = 0;
        for (let itemId in cartData) {
            totalCount += cartData[itemId];
        }
        
        res.json({ success: true, count: totalCount });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart, getCartCount };