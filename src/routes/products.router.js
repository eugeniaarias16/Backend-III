import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { authenticateJWT, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas
router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);

// Rutas protegidas (solo admin)
router.post("/", authenticateJWT, authorizeAdmin, productController.createProduct);
router.put("/:pid", authenticateJWT, authorizeAdmin, productController.updateProduct);
router.delete("/:pid", authenticateJWT, authorizeAdmin, productController.deleteProduct);

export default router;