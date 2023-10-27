// E:\programming\Project\eco-tracker\pages\api\products.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../utils/db';
import { authorize } from '../../utils/auth';
import { handleError } from '../../utils/handlers';

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuthenticated = await authorize(req, res);
    if (!isAuthenticated) return;

    try {
        const { user_id, name, co2_emission } = req.body;

        // ユーザーIDの確認
        if (!req.user || user_id !== req.user.id) {
            res.status(403).json({ message: 'Access denied.' });
            return;
        }

        switch (req.method) {
            case 'GET':
                const result = await pool.query('SELECT * FROM products WHERE user_id = $1', [req.user.id]);
                res.status(200).json(result.rows);
                break;

            case 'POST':
                const insertResult = await pool.query('INSERT INTO products (user_id, name, co2_emission) VALUES ($1, $2, $3) RETURNING *', [user_id, name, co2_emission]);
                res.status(201).json(insertResult.rows[0]);
                break;

            case 'PUT':
                const { id } = req.body;
                const updateResult = await pool.query('UPDATE products SET name = $1, co2_emission = $2 WHERE id = $3 AND user_id = $4 RETURNING *', [name, co2_emission, id, user_id]);
                if (updateResult.rowCount === 0) {
                    res.status(404).json({ message: 'Product not found.' });
                    return;
                }
                res.status(200).json(updateResult.rows[0]);
                break;

            case 'DELETE':
                const deleteId = req.body.id;
                const deleteResult = await pool.query('DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *', [deleteId, user_id]);
                if (deleteResult.rowCount === 0) {
                    res.status(404).json({ message: 'Product not found.' });
                    return;
                }
                res.status(200).json(deleteResult.rows[0]);
                break;

            default:
                res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error: any) {
        handleError(res, error);
    }
};

export default handleRequest;
