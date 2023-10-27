// E:\programming\Project\eco-tracker\utils\validators.ts

interface UserRequestBody {
    username?: string;
    email?: string;
    password?: string;
    // 他のフィールドもここに追加可能
}

interface ValidationResult {
    valid: boolean;
    message: string;
}

export const validateUserBody = (body: UserRequestBody): ValidationResult => {
    if (!body.username || !body.email || !body.password) {
        return { valid: false, message: 'Username, email, and password are required.' };
    }
    // 他のバリデーションルールもここに追加可能
    return { valid: true, message: 'Valid user body.' };
};
