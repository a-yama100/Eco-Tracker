// E:\programming\Project\eco-tracker\app\components\Login.tsx

import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      // JWTトークンをフロントエンドに保存 (例: localStorage)
      localStorage.setItem('token', data.token);
      // その他の処理 (例: ダッシュボードにリダイレクト)
    } else {
      // エラーメッセージの表示などのエラーハンドリング
      console.error(data.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">メールアドレス</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">パスワード</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">ログイン</button>
      </form>
    </div>
  );
};

export default Login;
