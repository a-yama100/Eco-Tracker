// E:\programming\Project\eco-tracker\app\components\Login.tsx

import axios, { AxiosError } from 'axios';
import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/login', { email, password });
            // トークンを保存したり、ユーザーをダッシュボードにリダイレクトするなどの処理
        } catch (error: any) {
            const axiosError = error as AxiosError;
            setErrorMessage(axiosError.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                {/* ... */}
            </form>
        </div>
    );
};

export default Login;
