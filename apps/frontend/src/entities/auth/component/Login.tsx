import React from 'react';
import { useLogin } from '../model/useLogin';

export const Login: React.FC = () => {
  const vm = useLogin();
  return (
    <div className="pl-4">
      <form onSubmit={vm.handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="displayName">
            ニックネーム(後から変更できます)
          </label>
          <input required id="displayName" name="displayName" type="text" />
        </div>
        <div className="field">
          <label className="label" htmlFor="email">
            メールアドレス
          </label>
          <input required id="email" name="email" type="email" />
        </div>
        <div className="field">
          <label className="label" htmlFor="password">
            パスワード
          </label>
          <input required id="password" name="password" type="password" />
        </div>
        <button className="button is-primary" type="submit">
          サインアップ
        </button>
      </form>
    </div>
  );
};
