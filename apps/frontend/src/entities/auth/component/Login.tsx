import { Button } from '@odyssage/ui/index';
import React, { FormEventHandler } from 'react';
import { Link, useNavigate } from 'react-router';
import { signinAction } from '@odyssage/frontend/shared/auth/service/signinAction';
import { useAppDispatch } from '@odyssage/frontend/shared/lib/store';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get('email') || '';
    const password = form.get('password') || '';

    const result = await dispatch(
      signinAction({
        email: `${email}`,
        password: `${password}`,
      }),
    );
    if (result.payload !== 'signin success') {
      alert(
        'ログインに失敗しました。サインアップがまだの場合はまずサインアップをお願いします。',
      );
      return;
    }
    navigate('/');
  };
  return (
    <div className="pl-4">
      <form onSubmit={handleSubmit}>
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
        <Button type="submit">ログイン</Button>
      </form>
      初回の方は
      <Link className=" underline ml-2" to="/signup">
        サインアップ
      </Link>
      をお願いします
    </div>
  );
};
