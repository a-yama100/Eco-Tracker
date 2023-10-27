// E:\programming\Project\eco-tracker\pages\api\login.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { pool } from '../../utils/db';
import { validatePostBody } from '../../utils/middleware';
import { validateUserBody } from '../../utils/validators';
import jwt from 'jsonwebtoken'; // JWTを扱うためのライブラリ

const SECRET = process.env.JWT_SECRET || '';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    const { email, password } = req.body;

    // データベースからユーザーの情報を取得
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    // ハッシュ化されたパスワードと提供されたパスワードを比較
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    // JWTトークンの生成
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
};

export default login;
