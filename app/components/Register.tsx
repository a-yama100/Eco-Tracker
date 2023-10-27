// E:\programming\Project\eco-tracker\app\components\Register.tsx

import React, { useState } from "react";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const user = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong!");
      }

      // トースト通知やリダイレクトなどの成功時の処理を追加することができます。
    } catch (error) {
      console.error("Registration failed:", error);
      // ここでエラーメッセージをユーザーに表示することができます。
    }
  };

  return (
    <div className="container mt-5">
      <h2>ユーザー登録</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ユーザー名</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="btn btn-primary">登録</button>
      </form>
    </div>
  );
};

export default Register;
