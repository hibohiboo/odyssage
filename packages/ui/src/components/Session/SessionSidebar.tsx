import { StockedScenarioBase } from './ScenarioSelector';

/**
 * セッションサイドバーコンポーネント
 * 選択したシナリオ情報とヘルプを表示
 */
export const SessionSidebar = <T extends StockedScenarioBase>({
  selectedScenario,
}: {
  selectedScenario?: T;
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
