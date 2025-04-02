import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../../components/Button';

interface CreateFormProps {
  readonly sessionName: string;
  readonly description: string;
}
export function FormInput({ sessionName, description }: CreateFormProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/gm/scenarios"
        className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        シナリオ一覧に戻る
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">
          新しい卓を立てる
        </h1>

        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          卓を作成する
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <div className="mb-4">
              <label
                htmlFor="sessionName"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                卓の名前
              </label>
              <input
                id="sessionName"
                name="sessionName"
                type="text"
                defaultValue={sessionName}
                placeholder="卓の名前を入力してください"
                className="input w-full"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                卓の説明（プレイヤー向け）
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={description}
                placeholder="プレイヤーに向けた卓の説明や注意事項を入力してください"
                className="textarea w-full"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
