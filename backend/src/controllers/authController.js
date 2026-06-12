import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    createUser,
    findUserById,
} from "../models/userModel.js";

import {
    saveRefreshToken,
    findRefreshToken,
    revokeToken,
} from "../models/refreshTokenModel.js";

import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/generateTokens.js";

import { hashToken } from "../utils/hashToken.js";

// COOKIE SETTINGS
const cookieOptions = {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await findUserByEmail(email);
        if (existing) return res.status(400).json({ message: "Email exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await createUser(name, email, hashedPassword);

        const user = { id: userId, name, email };

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const hashed = await hashToken(refreshToken);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await saveRefreshToken(userId, hashed, expiresAt);

        res.cookie("refresh_token", refreshToken, cookieOptions);

        res.json({ user, accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "Invalid email" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const payload = { id: user.id, email: user.email };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const hashed = await hashToken(refreshToken);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await saveRefreshToken(user.id, hashed, expiresAt);

        res.cookie("refresh_token", refreshToken, cookieOptions);

        res.json({
            user: { id: user.id, name: user.name, email: user.email },
            accessToken,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const refresh = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (!token) return res.status(401).json({ message: "No refresh token" });

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const hashed = await hashToken(token);
        const stored = await findRefreshToken(hashed);

        if (!stored || stored.revoked_at) {
            return res.status(401).json({message: "Invalid refresh token"});
        }
        if (new Date(stored.expires_at) < new Date()) {
            return res.status(401).json({message: "Expired refresh token"});
        }
        const user = await findUserById(decoded.id);

        const accessToken = generateAccessToken(user);

        res.json({ accessToken, user });
    } catch (err) {
        res.status(401).json({ message: "Refresh failed" });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;
        if (token) {
            const hashed = await hashToken(token);
            await revokeToken(hashed);
        }

        res.clearCookie("refresh_token");
        res.json({ message: "Logged out" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const me = async (req, res) => {
    const user = await findUserById(req.user.id);
    res.json(user);
};
