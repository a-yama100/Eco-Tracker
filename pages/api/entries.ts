// E:\programming\Project\eco-tracker\pages\entries.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../utils/db';
import jwt from 'jsonwebtoken';  // 必要に応じて適切な場所からインポート

const SECRET = process.env.JWT_SECRET || '';  // 環境変数から取得

const authorize = async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access Token Required' });
        return false;
    }

    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
        return true;
    } catch (err) {
        res.status(403).json({ message: 'Invalid Access Token' });
        return false;
    }
}

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const { type, ...data } = req.body;
    const isAuthenticated = await authorize(req, res);
    if (!isAuthenticated) return;

    try {
        const { id, queryType } = req.query;

        if (typeof queryType !== 'string') {
            res.status(400).json({ message: 'Invalid type' });
            return;
        }
        const tableMap: Record<string, string> = {
            product: 'products',
            meal: 'meals',
            transport: 'transports'
        };
        // typeに基づくデータのバリデーション
        switch (type) {
            case 'product':
            case 'meal':
                if (!data.user_id || typeof data.user_id !== 'number' ||
                    !data.name || typeof data.name !== 'string' ||
                    !data.co2_emission || typeof data.co2_emission !== 'number') {
                    res.status(400).json({ message: 'Invalid or missing fields for product/meal' });
                    return;
                }
                break;

            case 'transport':
                if (!data.user_id || typeof data.user_id !== 'number' ||
                    !data.mode || typeof data.mode !== 'string' ||
                    !data.distance || typeof data.distance !== 'number' ||
                    !data.co2_emission || typeof data.co2_emission !== 'number') {
                    res.status(400).json({ message: 'Invalid or missing fields for transport' });
                    return;
                }

                const tableName = tableMap[queryType as string];

                if (!tableName) {
                    res.status(400).json({ message: 'Invalid type' });
                    return;
                }

                const result = await pool.query(`SELECT * FROM ${tableName}`);

                if (typeof queryType === 'string') {
                    const entries = {
                        [queryType]: result.rows
                    };

                    if (id) {
                        const specificResult = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
                        res.status(200).json(specificResult.rows[0]);
                    } else {
                        res.status(400).json({ message: 'Invalid queryType' });
                        return;
                    }
                    res.status(200).json(entries);
                }
                break;

            case 'POST':
                // ユーザーIDの確認
                if (!req.user) {
                    res.status(403).json({ message: 'User not authenticated' });
                    return;
                }
                if (data.user_id !== req.user.id) {
                    res.status(403).json({ message: 'Access denied' });
                    return;
                }
                if (type === 'product') {
                    const { user_id, name, co2_emission } = data;
                    const result = await pool.query('INSERT INTO products (user_id, name, co2_emission) VALUES ($1, $2, $3) RETURNING *', [user_id, name, co2_emission]);
                    res.status(201).json(result.rows[0]);
                } else if (type === 'meal') {
                    const { user_id, name, co2_emission } = data;
                    const result = await pool.query('INSERT INTO meals (user_id, name, co2_emission) VALUES ($1, $2, $3) RETURNING *', [user_id, name, co2_emission]);
                    res.status(201).json(result.rows[0]);
                } else if (type === 'transport') {
                    const { user_id, mode, distance, co2_emission } = data;
                    const result = await pool.query('INSERT INTO transports (user_id, mode, distance, co2_emission) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, mode, distance, co2_emission]);
                    res.status(201).json(result.rows[0]);
                } else {
                    res.status(400).json({ message: 'Invalid type' });
                }
                break;

            case 'PUT':
                // ユーザーIDの確認
                if (!req.user) {
                    res.status(403).json({ message: 'User not authenticated' });
                    return;
                }
                if (data.user_id !== req.user.id) {
                    res.status(403).json({ message: 'Access denied' });
                    return;
                }
                if (type === 'product') {
                    const { id, user_id, name, co2_emission } = data;
                    const result = await pool.query('UPDATE products SET user_id = $1, name = $2, co2_emission = $3 WHERE id = $4 RETURNING *', [user_id, name, co2_emission, id]);
                    res.status(200).json(result.rows[0]);
                } else if (type === 'meal') {
                    const { id, user_id, name, co2_emission } = data;
                    const result = await pool.query('UPDATE meals SET user_id = $1, name = $2, co2_emission = $3 WHERE id = $4 RETURNING *', [user_id, name, co2_emission, id]);
                    res.status(200).json(result.rows[0]);
                } else if (type === 'transport') {
                    const { id, user_id, mode, distance, co2_emission } = data;
                    const result = await pool.query('UPDATE transports SET user_id = $1, mode = $2, distance = $3, co2_emission = $4 WHERE id = $5 RETURNING *', [user_id, mode, distance, co2_emission, id]);
                    res.status(200).json(result.rows[0]);
                } else {
                    res.status(400).json({ message: 'Invalid type for update' });
                }
                break;

            case 'DELETE':
                if (!req.user) {
                    res.status(403).json({ message: 'User not authenticated' });
                    return;
                }
                if (data.user_id !== req.user.id) {
                    res.status(403).json({ message: 'Access denied' });
                    return;
                }
                if (type === 'product') {
                    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
                    res.status(200).json(result.rows[0]);
                } else if (type === 'meal') {
                    const result = await pool.query('DELETE FROM meals WHERE id = $1 RETURNING *', [id]);
                    res.status(200).json(result.rows[0]);
                } else if (type === 'transport') {
                    const result = await pool.query('DELETE FROM transports WHERE id = $1 RETURNING *', [id]);
                    res.status(200).json(result.rows[0]);
                } else {
                    res.status(400).json({ message: 'Invalid type for deletion' });
                }
                break;
                default:
                    res.status(405).json({ message: 'Method not allowed' });
            }
            } catch (error: any) {
                // データベースのエラーコードに基づくエラーハンドリング
                switch (error.code) {
                    case '23505':
                        res.status(400).json({ message: 'A record with the same unique constraint already exists.' });
                        break;
                    case '23503':
                        res.status(400).json({ message: 'Foreign key constraint violation.' });
                        break;
                    case '22001':
                        res.status(400).json({ message: 'Value too long for column.' });
                        break;
                    case '22P02':
                        res.status(400).json({ message: 'Invalid text representation.' });
                        break;
                    case '23502':
                        res.status(400).json({ message: 'Null value violation.' });
                        break;
                    default:
                        res.status(500).json({ message: error.message });
                        break;
                }
            }
}

export default handleRequest;