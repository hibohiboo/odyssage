import React, { FormEventHandler } from 'react';
import { useNavigate } from 'react-router';
import { userDisplayNameSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { changeNameAction } from '@odyssage/frontend/shared/auth/service/changeNameAction';
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

        <button className="button is-primary" type="submit">
          保存
        </button>
      </form>
    </div>
  );
};
