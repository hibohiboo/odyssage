import { LoadingView, ErrorView, NoDataView, MainContent } from './components/StateViews';
import { selectViewState } from './utils/viewStateSelector';
import type { PlaySessionViewProps } from './types';


export type { PlaySessionViewProps, AutoSaveStatus, SessionInfo } from './types';

/**
 * プレイ画面のメインコンポーネント
 * 
 * play-session.md設計に基づく没入的プレイ体験を提供する。
 * Event処理・シーン進行管理を統合したOrganismレベルコンポーネント。
 * 
 * @param props - PlaySessionViewProps
 * @returns JSX.Element
 */
export function PlaySessionView(props: PlaySessionViewProps) {
  const viewState = selectViewState(props);

  switch (viewState.type) {
    case 'loading':
      return (
        <div className={`w-full min-h-screen bg-gray-50 ${viewState.className}`}>
          <LoadingView />
        </div>
      );
    case 'error':
      return <ErrorView error={viewState.error} className={viewState.className} />;
    case 'noData':
      return <NoDataView className={viewState.className} />;
    case 'content':
      return (
        <MainContent
          currentScene={viewState.props.currentScene!}
          currentEvent={viewState.props.currentEvent!}
          sessionInfo={viewState.props.sessionInfo}
          autoSaveStatus={viewState.props.autoSaveStatus}
          onMenuAccess={viewState.props.onMenuAccess}
          onExitSession={viewState.props.onExitSession}
          onChoiceSelect={viewState.props.onChoiceSelect}
          onContinue={viewState.props.onContinue}
          className={viewState.props.className || ''}
        />
      );
    default:
      return <NoDataView className={props.className || ''} />;
  }
}