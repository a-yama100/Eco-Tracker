// E:\programming\Project\eco-tracker\utils\middleware.ts

import { NextApiRequest, NextApiResponse } from 'next';

export const validatePostBody = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    if (req.method === 'POST' && (!req.body || Object.keys(req.body).length === 0)) {
        res.status(400).json({ message: 'Bad Request: Request body is missing or empty.' });
        return;
    }
    next();
};
