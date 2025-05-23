import { FormEventHandler } from 'react';
import { useNavigate } from 'react-router';
import { signupAction } from '@odyssage/frontend/shared/auth/service/signUpAction';
import { useAppDispatch } from '@odyssage/frontend/shared/lib/store';

export const useSignup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const displayName = form.get('displayName') || '';
    const email = form.get('email') || '';
    const password = form.get('password') || '';
    await dispatch(
      signupAction({
        displayName: `${displayName}`,
        email: `${email}`,
        password: `${password}`,
      }),
    );
    navigate('/');
  };
  return { handleSubmit };
};
