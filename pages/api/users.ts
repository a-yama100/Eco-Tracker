import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../utils/db';
import bcrypt from 'bcrypt';
import { handleError } from '../../utils/handlers';
import { authorize } from '../../utils/auth';

const handleRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                // TODO: 特定のユーザーの情報のみを返すように変更する
                const result = await pool.query('SELECT id, username, email FROM users');  // パスワードは除外
                res.status(200).json(result.rows);
                break;

            case 'POST':
                const { username, email, password } = req.body;

                // 入力データのバリデーション
                if (!username || !email || !password) {
                    res.status(400).json({ message: 'Missing required fields.' }); // 400: Bad Request
                    return;
                }

                // パスワードのハッシュ化
                const hashedPassword = await bcrypt.hash(password, 10);

                // ハッシュ化されたパスワードでデータベースに保存
                const insertResult = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email', [username, email, hashedPassword]);
                res.status(201).json(insertResult.rows[0]);
                break;

            // 必要に応じてPUTやDELETEメソッドでの処理も追加できます

            default:
                res.status(405).json({ message: 'Method not allowed' }); // 405: Method Not Allowed
        }
    } catch (error: any) {
        handleError(res, error);
    }
};

export default handleRequest;
