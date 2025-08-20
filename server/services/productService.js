import Product from "../models/Product.js";

class productService {
    async getAllProducts(filters = {}) {
        try {
            const {
                search = '',
                sortBy = 'createdAt',
                sortOrder = 'desc',
                inStockOnly = false,
                minPrice,
                maxPrice,
                minRating,
                limit = 50,
                page = 1
            } = filters;

            const query = {};
            
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            if (inStockOnly) {
                query.stock = { $gt: 0 };
            }

            if (minPrice || maxPrice) {
                query.offerprice = {};
                if (minPrice) query.offerprice.$gte = Number(minPrice);
                if (maxPrice) query.offerprice.$lte = Number(maxPrice);
            }

            if (minRating) {
                query.rating = { $gte: Number(minRating) };
            }

            const sortOptions = {};
            switch (sortBy) {
                case 'price-low-high':
                    sortOptions.offerprice = 1;
                    break;
                case 'price-high-low':
                    sortOptions.offerprice = -1;
                    break;
                case 'rating':
                    sortOptions.rating = -1;
                    sortOptions.totalRatings = -1;
                    break;
                case 'name':
                    sortOptions.name = sortOrder === 'asc' ? 1 : -1;
                    break;
                case 'newest':
                    sortOptions.createdAt = -1;
                    break;
                case 'oldest':
                    sortOptions.createdAt = 1;
                    break;
                default:
                    sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
            }

            const skip = (page - 1) * limit;

            const products = await Product.find(query)
                .select('-ratings')
                .sort(sortOptions)
                .limit(parseInt(limit))
                .skip(skip);

            const totalProducts = await Product.countDocuments(query);
            const totalPages = Math.ceil(totalProducts / limit);

            return {
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Failed to fetch products: ${error.message}`);
        }
    }

    async getTopRatedProducts(limit = 4) {
        try {
            const products = await Product.find({ 
                rating: { $gte: 3 },
                stock: { $gt: 0 }
            })
            .sort({ rating: -1, totalRatings: -1 })
            .limit(parseInt(limit))
            .select('-ratings -__v');
            
            return products;
        } catch (error) {
            throw new Error(`Failed to fetch top rated products: ${error.message}`);
        }
    }

    async getProductById(productId) {
        try {
            const product = await Product.findById(productId)
                .populate('ratings.userId', 'name')
                .select('-__v');
            
            if (!product) {
                throw new Error('Product not found');
            }
            
            return product;
        } catch (error) {
            throw new Error(`Failed to fetch product: ${error.message}`);
        }
    }

    async searchProducts(searchTerm, limit = 10) {
        try {
            const products = await Product.find({
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } }
                ],
                stock: { $gt: 0 }
            })
            .select('name offerprice image rating')
            .limit(parseInt(limit));
            
            return products;
        } catch (error) {
            throw new Error(`Search failed: ${error.message}`);
        }
    }
}

export default new productService()