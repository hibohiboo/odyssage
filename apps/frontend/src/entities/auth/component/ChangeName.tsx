import { Button } from '@odyssage/ui/index';
import React, { FormEventHandler } from 'react';
import { useNavigate } from 'react-router';
import { userDisplayNameSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { changeNameAction } from '@odyssage/frontend/shared/auth/service/changeNameAction';
import { logoutAction } from '@odyssage/frontend/shared/auth/service/logoutAction';
import {
  useAppDispatch,
  useAppSelector,
} from '@odyssage/frontend/shared/lib/store';

export const ChangeName: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const name = useAppSelector(userDisplayNameSelector);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const displayName = form.get('displayName') || '';

    await dispatch(
      changeNameAction({
        displayName: `${displayName}`,
      }),
    );
    navigate('/');
  };
  const logoutHandler = async () => {
    await dispatch(logoutAction());
    navigate('/login');
  };
  return (
    <div className="pl-4">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="displayName">
            ニックネーム
          </label>
          <input
            required
            id="displayName"
            name="displayName"
            defaultValue={name}
            type="text"
          />
        </div>

        <Button type="submit">保存</Button>
      </form>
      <div className="mt-4">
        <Button variant="secondary" type="button" onClick={logoutHandler}>
          ログアウト
        </Button>
      </div>
    </div>
  );
};
