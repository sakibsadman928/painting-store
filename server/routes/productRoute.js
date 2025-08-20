import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct, updateProduct, getTopRatedProducts, searchProducts } from "../controllers/productController.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";

const productRouter = express.Router();

productRouter.post('/add', authAdmin, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);

productRouter.post('/remove', authAdmin, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.get('/top-rated', getTopRatedProducts);
productRouter.get('/search', searchProducts);
productRouter.put('/update', authAdmin, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), updateProduct);

export default productRouter;