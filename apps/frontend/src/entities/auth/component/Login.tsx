import React from 'react';

export const Login: React.FC = () => (
  <div>
    <form>
      <div>
        <label htmlFor="displayName">ニックネーム(後から変更できます)</label>
        <input id="displayName" type="text" />
      </div>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input id="email" type="email" />
      </div>
      <div>
        <label htmlFor="password">パスワード</label>
        <input id="password" type="password" />
      </div>
      <button className="button is-primary" type="submit">
        ログイン
      </button>
    </form>
  </div>
);
