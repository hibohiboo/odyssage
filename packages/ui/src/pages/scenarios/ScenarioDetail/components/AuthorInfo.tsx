import { User } from 'lucide-react';
import { Author } from '../types';

interface AuthorInfoProps {
  author: Author;
}

export const AuthorInfo = ({ author }: AuthorInfoProps) => (
  <div className="card p-6 mb-6">
    <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
      作成者情報
    </h2>

    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-3 overflow-hidden">
        {author.avatar ? (
          <img
            src={author.avatar || '/placeholder.svg'}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-6 w-6 text-amber-800" />
        )}
      </div>
      <div>
        <p className="font-medium">{author.name}</p>
        <p className="text-sm text-stone-500">シナリオ作成者</p>
      </div>
    </div>
  </div>
);
