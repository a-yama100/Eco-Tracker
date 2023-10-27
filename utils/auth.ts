// E:\programming\Project\eco-tracker\utils\auth.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

// User型を定義します。
interface UserPayload extends JwtPayload {
    username: string;
    id: number;
}

// req.userの型を拡張します。
declare module 'next' {
    interface NextApiRequest {
        user?: UserPayload;
    }
}

const SECRET = process.env.JWT_SECRET; // 環境変数から読み込み

if (!SECRET) {
    throw new Error('JWT_SECRET is not defined.');
}

export const authenticate = (username: string, password: string, userId: number): string => {
    const user = { username: username, id: userId }; // ユーザーIDも含める
    const token = jwt.sign(user, SECRET, { expiresIn: '1h' });
    return token;
}

export const authorize = (req: NextApiRequest, res: NextApiResponse): UserPayload | null => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access Token Required' });
        return null;
    }

    try {
        const user = jwt.verify(token, SECRET) as UserPayload;
        req.user = user;
        return user;
    } catch (err) {
        res.status(403).json({ message: 'Invalid Access Token' });
        return null;
    }
}

export const logout = () => {
    // JWTトークンをlocalStorageから削除
    localStorage.removeItem('token');
  };