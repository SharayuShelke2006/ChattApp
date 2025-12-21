import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { signup, login,logout,update_profile } from "../controllers/auth.controller.js";
const router=express.Router();

router.post("/signup", signup);
router.post("/login", login);
//router.post("/login",arcjetProtection, login);

router.post("/logout", logout);
router.put("/update-profile",protectRoute, update_profile);
router.get("/check", protectRoute, (req, res) => {
    return res.status(200).json({ message: "Authorized", user: req.user });
});
export default router;