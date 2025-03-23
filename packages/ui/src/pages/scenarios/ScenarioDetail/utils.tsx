import { FileEdit, Eye } from 'lucide-react';
import { ScenarioStatus } from './types';

const privateState = {
  label: '作成中',
  bgColor: 'bg-amber-100',
  textColor: 'text-amber-800',
  icon: <FileEdit className="h-4 w-4 mr-1" />,
};
// ステータスに応じたスタイルとラベルを取得するユーティリティ
export const getStatusStyles = (status: ScenarioStatus) => {
  switch (status) {
    case 'private':
      return privateState;
    case 'public':
      return {
        label: '公開中',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: <Eye className="h-4 w-4 mr-1" />,
      };
    default:
      return privateState;
  }
};
