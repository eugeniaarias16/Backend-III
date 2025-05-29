import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import { authenticateJWT, authorizeUser } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/", cartController.getAllCarts);
router.get("/:cid", cartController.getCartById);
router.post("/", cartController.createCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.post('/:cid/purchase', authenticateJWT, authorizeUser, cartController.purchaseCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/product/:pid", cartController.updateProductQuantity);
router.delete("/:cid/product/:pid", cartController.removeProductFromCart);
router.delete("/:cid", cartController.clearCart);

export default router;