import { Button } from '@odyssage/ui/index';
import React from 'react';
import { useSignup } from '../model/useSignup';

export const Signup: React.FC = () => {
  const vm = useSignup();
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
        <Button type="submit">サインアップ</Button>
      </form>
    </div>
  );
};
