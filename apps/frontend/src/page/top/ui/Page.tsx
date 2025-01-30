import { Link } from 'react-router';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

export const Page = () => {
  const uid = useAppSelector(uidSelector);
  if (!uid) {
    return <></>;
  }
  return (
    <div>
      <ul>
        <li>
          <Link to="/scenario/create">シナリオ作成</Link>
        </li>
        <li>
          <Link to="/scenario/list">シナリオ一覧</Link>
        </li>
      </ul>
    </div>
  );
};
