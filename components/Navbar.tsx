// eco-tracker\components\Navbar.tsx

import Link from 'next/link';
import { logout } from '../utils/auth';

const Navbar: React.FC = () => {
  const handleLogout = () => {
    logout();
    // 必要に応じてログアウト後のリダイレクトや通知を実装
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/">
          <a className="navbar-brand">エコトラッカー</a>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/">
                <a className="nav-link">ホーム</a>
              </Link>
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                ログアウト
              </button>
            </li>
            <li className="nav-item">
              <Link href="/analysis">
                <a className="nav-link">分析結果</a>
              </Link>
            </li>
            {/* 他のページへのリンクも追加できます */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
