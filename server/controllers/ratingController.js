import Product from "../models/Product.js";
import Order from "../models/Order.js";

const addRating = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;

    if (!productId || !rating) {
      return res.json({
        success: false,
        message: "Product ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const userOrders = await Order.find({
      userId: req.userId,
      status: "Shipped",
    });

    const hasPurchased = userOrders.some((order) =>
      order.items.some((item) => item.productId === productId),
    );

    if (!hasPurchased) {
      return res.json({
        success: false,
        message: "You can only rate products you have purchased and received",
      });
    }

    const existingRatingIndex = product.ratings.findIndex(
      (r) => r.userId.toString() === req.userId,
    );

    if (existingRatingIndex !== -1) {
      return res.json({
        success: false,
        message:
          "You have already rated this product. Each product can only be rated once.",
      });
    }

    product.ratings.push({
      userId: req.userId,
      rating,
      review: review || "",
      createdAt: new Date(),
    });
    product.totalRatings += 1;

    const totalRatingPoints = product.ratings.reduce(
      (sum, r) => sum + r.rating,
      0,
    );
    product.rating =
      Math.round((totalRatingPoints / product.ratings.length) * 10) / 10;

    await product.save();

    res.json({
      success: true,
      message: "Rating added successfully",
      rating: product.rating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.body;

    // UPDATED: Added .slice('ratings', -20) to only fetch the last 20 inserted reviews
    const product = await Product.findById(productId)
      .slice("ratings", -20)
      .populate("ratings.userId", "name")
      .select("rating totalRatings ratings");

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // UPDATED: Sort those specific 20 reviews so the absolute newest is at the top
    const sortedLatestRatings = product.ratings.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.json({
      success: true,
      rating: product.rating,
      totalRatings: product.totalRatings,
      ratings: sortedLatestRatings, // Send only the sorted 20 reviews
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserRating = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const userRating = product.ratings.find(
      (r) => r.userId.toString() === req.userId,
    );

    const userOrders = await Order.find({
      userId: req.userId,
      status: "Shipped",
    });

    const hasPurchased = userOrders.some((order) =>
      order.items.some((item) => item.productId === productId),
    );

    res.json({
      success: true,
      userRating: userRating || null,
      canRate: hasPurchased && !userRating,
      hasAlreadyRated: !!userRating,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const canUserRate = async (req, res) => {
  try {
    const { productId } = req.body;

    const userOrders = await Order.find({
      userId: req.userId,
      status: "Shipped",
    });

    const hasPurchased = userOrders.some((order) =>
      order.items.some((item) => item.productId === productId),
    );

    const product = await Product.findById(productId);
    const hasAlreadyRated = product.ratings.some(
      (r) => r.userId.toString() === req.userId,
    );

    res.json({
      success: true,
      canRate: hasPurchased && !hasAlreadyRated,
      hasPurchased,
      hasAlreadyRated,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteRating = async (req, res) => {
  try {
    return res.json({
      success: false,
      message: "Ratings cannot be deleted once submitted",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addRating,
  getProductRatings,
  getUserRating,
  canUserRate,
  deleteRating,
};
