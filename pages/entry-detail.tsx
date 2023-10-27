// E:\programming\Project\eco-tracker\pages\entry-detail.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EntryForm from '../components/EntryForm';

const EntryDetailPage: React.FC = () => {
  const router = useRouter();
  const { id, type } = router.query; // URLからidとtypeを取得

  const [entry, setEntry] = useState<any>(null);

  useEffect(() => {
    if (id && type) {
      // 既存のエントリを取得
      fetch(`/api/entries?type=${type}&id=${id}`)
        .then(res => res.json())
        .then(data => setEntry(data))
        .catch(error => console.error('Error fetching entry:', error));
    }
  }, [id, type]);

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch(`/api/entries?type=${type}&id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('エントリが正常に更新されました！');
        const updatedEntry = await response.json();
        setEntry(updatedEntry); // エントリのステートを更新
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert('エントリの更新中にエラーが発生しました。後でもう一度お試しください。');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/entries?type=${type}&id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('エントリが正常に削除されました！');
        // 任意のリダイレクトロジック（例：ホームページやエントリ一覧ページに戻る）
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert('エントリの削除中にエラーが発生しました。後でもう一度お試しください。');
    }
  };

  if (!entry) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>エントリの詳細</h2>
      <div>
        {/* エントリの詳細情報を表示 */}
        <h3>{entry.name}</h3>
        <p>CO2排出量: {entry.co2_emission}</p>
        {type === 'transport' && (
          <>
            <p>モード: {entry.mode}</p>
            <p>距離: {entry.distance} km</p>
          </>
        )}
      </div>

      {/* エントリの編集フォーム */}
      <EntryForm type={type as 'product' | 'meal' | 'transport'} onSubmit={handleUpdate} />

      {/* エントリの削除ボタン */}
      <button onClick={handleDelete}>削除</button>
    </div>
  );
};

export default EntryDetailPage;
