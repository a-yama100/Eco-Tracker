// E:\programming\Project\eco-tracker\pages\profile.tsx

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';


const Profile = () => {

    type UserData = {
        username?: string;
        email?: string;
        message?: string;
        // 必要に応じて他のプロパティも追加
    };

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userData, setUserData] = useState<UserData>({});

    useEffect(() => {
        // APIからユーザー情報を取得して、setUserDataでステートを更新
        async function fetchUserData() {
            try {
                const response = await axios.get('/api/profile');
                setUserData(response.data);
            } catch (error) {
                const axiosError = error as AxiosError;
                alert(axiosError.response?.data?.message || "Failed to change password.");
            }
        }
        fetchUserData();
    }, []);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            alert("Please fill out both fields");
            return;
        }

        try {
            const response = await axios.put('/api/profile', {
                currentPassword,
                newPassword
            });

            if (response.status === 200) {
                alert(response.data.message);
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (error: any) {
            if (error && error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert("Failed to change password.");
            }
        }
    };

    const handleDeleteAccount = async () => {
        // アカウント削除の確認と処理
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                await axios.delete('/api/profile');
                // アカウント削除後の処理、例: ログアウトしてホームページにリダイレクト
            } catch (error) {
                console.error("Failed to delete account:", error);
            }
        }
    };

    return (
        <div>
            {/* ... */}

            {/* パスワード変更フォーム */}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
            }}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="submit">Change Password</button>
            </form>

            {/* ... */}
        </div>
    );
};

export default Profile;

