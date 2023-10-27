// E:\programming\Project\eco-tracker\utils\handlers.ts

import { NextApiResponse } from 'next';

export const handleError = (res: NextApiResponse, error: Error) => {
    console.error(error);

    // 一般的なエラーメッセージを返す
    res.status(500).json({ message: "Internal Server Error" });
};
