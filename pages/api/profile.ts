// E:\programming\Project\eco-tracker\pages\api\profile.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../utils/db';
import { authorize } from '../../utils/auth';
import { handleError } from '../../utils/handlers';
import bcrypt from 'bcrypt';

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    await authorize(req, res);

    try {
        switch (req.method) {
            case 'GET':
                const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
                res.status(200).json(result.rows[0]);
                break;

            case 'PUT':
                const { currentPassword, newPassword } = req.body;
                // 現在のパスワードの確認
                const user = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
                const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password);

                if (!isMatch) {
                    res.status(401).json({ message: 'Current password is incorrect' });
                    return;
                }

                // 新しいパスワードのハッシュ化
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);

                res.status(200).json({ message: 'Password updated successfully.' });
                break;

            case 'DELETE':
                await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
                res.status(200).json({ message: 'Account deleted successfully.' });
                break;

            default:
                res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error: any) {
        handleError(res, error);
    }
};

export default handleRequest;