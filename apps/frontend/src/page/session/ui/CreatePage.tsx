import { ArrowLeft } from '@odyssage/ui/icons';
import {
  ScenarioSelector,
  SessionForm,
  SessionSidebar,
} from '@odyssage/ui/index';
import { Link, useLoaderData } from 'react-router';
import { StockedScenario } from '../api/stockedScenariosLoader';
import { useSessionForm } from '../hooks/useSessionForm';

/**
 * セッション作成ページ
 * GMがストックしたシナリオを選択してセッションを作成するページ
 */
const CreatePage = () => {
  const stockedScenarios = useLoaderData() as StockedScenario[];
  const {
    selectedScenarioId,
    setSelectedScenarioId,
    title,
    setTitle,
    formError,
    selectedScenario,
    handleSubmit,
    loading,
    success,
    error,
  } = useSessionForm(stockedScenarios);

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
            >
              <div className="mt-6">
                <ScenarioSelector
                  scenarios={stockedScenarios}
                  selectedId={selectedScenarioId}
                  onSelectScenario={setSelectedScenarioId}
                />
              </div>
            </SessionForm>
          </div>
        </div>

        {/* サイドバー */}
        <SessionSidebar selectedScenario={selectedScenario} />
      </div>
    </div>
  );
};

export default CreatePage;
