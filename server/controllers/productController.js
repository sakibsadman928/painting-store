import productService from "../services/productService.js";
import Product from "../models/Product.js";
import fs from 'fs';

const addProduct = async (req, res) => {
    try {
        const { name, description, price, offerprice, stock } = req.body;
        
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                return item.filename;
            })
        );

        const productData = {
            name,
            description,
            price: Number(price),
            offerprice: Number(offerprice),
            stock: Number(stock),
            image: imagesUrl,
            rating: 0,
            totalRatings: 0,
            ratings: [],
            date: Date.now()
        }

        const product = new Product(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listProducts = async (req, res) => {
    try {
        const filters = {
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            inStockOnly: req.query.inStockOnly === 'true',
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            minRating: req.query.minRating,
            limit: req.query.limit,
            page: req.query.page
        };

        const result = await productService.getAllProducts(filters);
        
        res.json({ 
            success: true, 
            products: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.body.id);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        product.image.forEach((item) => {
            fs.unlink(`uploads/${item}`, () => {});
        });

        await Product.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        
        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const product = await productService.getProductById(productId);
        
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }
        
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error fetching single product:', error);
        res.json({ success: false, message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, offerprice, stock } = req.body;
        
        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        const updateData = {
            name,
            description,
            price: Number(price),
            offerprice: Number(offerprice),
            stock: Number(stock)
        };

        const image1 = req.files && req.files.image1 && req.files.image1[0];
        const image2 = req.files && req.files.image2 && req.files.image2[0];
        const image3 = req.files && req.files.image3 && req.files.image3[0];
        const image4 = req.files && req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if (images.length > 0) {
            product.image.forEach((item) => {
                fs.unlink(`uploads/${item}`, () => {});
            });

            let imagesUrl = await Promise.all(
                images.map(async (item) => {
                    return item.filename;
                })
            );
            updateData.image = imagesUrl;
        }

        await Product.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Product Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getTopRatedProducts = async (req, res) => {
    try {
        const { limit = 4 } = req.query;
        const products = await productService.getTopRatedProducts(limit);
        
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const searchProducts = async (req, res) => {
    try {
        const { q: searchTerm, limit = 10 } = req.query;
        
        if (!searchTerm) {
            return res.json({ success: false, message: "Search term is required" });
        }

        const products = await productService.searchProducts(searchTerm, limit);
        
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct, getTopRatedProducts, searchProducts };