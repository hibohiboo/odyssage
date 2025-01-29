import { Link } from 'react-router';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

export const Page = () => {
  const uid = useAppSelector(uidSelector);
  if (uid) {
    return (
      <div>
        <Link to="/scenario/create">シナリオ作成</Link>
      </div>
    );
  }
  return <></>;
};
