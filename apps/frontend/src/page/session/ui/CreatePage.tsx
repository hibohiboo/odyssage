// filepath: d:\projects\odyssage\apps\frontend\src\page\session\ui\CreatePage.tsx

import { ArrowLeft } from '@odyssage/ui/icons';
import { FormEvent, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { useCreateSession } from '@odyssage/frontend/entities/session/hooks/useCreateSession';
import { StockedScenario } from '../api/stockedScenariosLoader';

/**
 * シナリオ選択コンポーネント
 * ストックされたシナリオの一覧から1つを選択するための機能を提供
 */
const ScenarioSelector = ({
  scenarios,
  selectedId,
  onSelectScenario,
}: {
  scenarios: StockedScenario[];
  selectedId: string;
  onSelectScenario: (id: string) => void;
}) => {
  if (scenarios.length === 0) {
    return (
      <div className="text-center py-10 text-stone-500 border border-dashed border-stone-300 rounded-md">
        <p>ストックしたシナリオがありません</p>
        <Link
          to="/gm/scenario/public"
          className="text-amber-700 hover:text-amber-800 mt-2 inline-block"
        >
          シナリオをストックする
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scenarios.map((scenario) => (
        <div
          key={scenario.id}
          className={`border rounded-md p-4 cursor-pointer transition-colors ${
            selectedId === scenario.id
              ? 'border-amber-500 bg-amber-50'
              : 'border-stone-200 hover:border-amber-300'
          }`}
          onClick={() => onSelectScenario(scenario.id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-amber-800">{scenario.title}</h3>
            <div className="flex items-center">
              <input
                type="radio"
                name="scenario"
                value={scenario.id}
                checked={selectedId === scenario.id}
                onChange={() => onSelectScenario(scenario.id)}
                className="h-4 w-4 text-amber-700 border-stone-300 focus:ring-amber-500"
              />
            </div>
          </div>
          {scenario.overview && (
            <p className="text-sm text-stone-600 mt-2 line-clamp-2">
              {scenario.overview}
            </p>
          )}
          <p className="text-xs text-stone-500 mt-2">
            最終更新: {new Date(scenario.stockedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

/**
 * セッション情報入力フォームコンポーネント
 * タイトル入力と送信ボタンを提供
 */
const SessionForm = ({
  title,
  onTitleChange,
  onSubmit,
  loading,
  success,
  error,
  formError,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  success: boolean;
  error: string;
  formError: string;
}) => (
  <form onSubmit={onSubmit}>
    {/* シナリオ選択ラベル */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-stone-700 mb-2">
        シナリオを選択
      </label>
      {/* ScenarioSelectorコンポーネントは呼び出し元で配置 */}
    </div>

    {/* セッションタイトル */}
    <div className="mb-6">
      <label
        htmlFor="title"
        className="block text-sm font-medium text-stone-700 mb-2"
      >
        セッションタイトル
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="セッションのタイトルを入力"
        className="input w-full"
        required
      />
      <p className="text-xs text-stone-500 mt-1">
        プレイヤーに表示される卓の名前です
      </p>
    </div>

    {/* エラーメッセージ */}
    {(formError || error) && (
      <div className="text-red-600 mb-4">{formError || error}</div>
    )}

    {/* 成功メッセージ */}
    {success && (
      <div className="text-green-600 mb-4">
        セッションが正常に作成されました
      </div>
    )}

    {/* 送信ボタン */}
    <div>
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? '作成中...' : 'セッションを作成'}
      </button>
    </div>
  </form>
);

/**
 * セッションサイドバーコンポーネント
 * 選択したシナリオ情報とヘルプを表示
 */
const SessionSidebar = ({
  selectedScenario,
}: {
  selectedScenario?: StockedScenario;
}) => (
  <div className="lg:col-span-1">
    <div className="card p-6 mb-6">
      <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
        選択したシナリオ
      </h2>
      {selectedScenario ? (
        <div>
          <h3 className="font-medium">{selectedScenario.title}</h3>
          {selectedScenario.overview && (
            <p className="text-sm text-stone-600 mt-2">
              {selectedScenario.overview}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-stone-500">シナリオを選択してください</p>
      )}
    </div>

    <div className="card p-6">
      <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
        ヘルプ
      </h2>
      <div className="text-sm text-stone-600 space-y-3">
        <p>✓ セッションはGMとしてシナリオを実行するための卓です</p>
        <p>✓ 作成したセッションにプレイヤーを招待できます</p>
        <p>✓ セッションの進行状況を管理できます</p>
      </div>
    </div>
  </div>
);

/**
 * セッション作成ページ
 * GMがストックしたシナリオを選択してセッションを作成するページ
 */
const CreatePage = () => {
  const navigate = useNavigate();
  const stockedScenarios = useLoaderData() as StockedScenario[];
  const { createNewSession, loading, success, error } = useCreateSession();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // 選択したシナリオの情報を取得
  const selectedScenario = stockedScenarios.find(
    (scenario) => scenario.id === selectedScenarioId,
  );

  /**
   * セッション作成フォームの送信ハンドラ
   * @param e フォームイベント
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    // バリデーション
    if (!selectedScenarioId) {
      setFormError('シナリオを選択してください');
      return;
    }

    if (!title.trim()) {
      setFormError('セッションタイトルを入力してください');
      return;
    }

    try {
      await createNewSession(selectedScenarioId, title);
      // 成功したらセッション一覧ページに遷移
      if (success) {
        navigate('/gm/sessions');
      }
    } catch (err) {
      console.error('セッション作成エラー:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 戻るリンク */}
      <Link
        to="/gm/scenario/public"
        className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        シナリオ一覧に戻る
      </Link>

      <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800 mb-6">
        セッション作成
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <SessionForm
              title={title}
              onTitleChange={setTitle}
              onSubmit={handleSubmit}
              loading={loading}
              success={success}
              error={error}
              formError={formError}
            />
            <div className="mt-6">
              <ScenarioSelector
                scenarios={stockedScenarios}
                selectedId={selectedScenarioId}
                onSelectScenario={setSelectedScenarioId}
              />
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <SessionSidebar selectedScenario={selectedScenario} />
      </div>
    </div>
  );
};

export default CreatePage;
