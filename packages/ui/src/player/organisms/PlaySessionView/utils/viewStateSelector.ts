import type { PlaySessionViewProps } from '../types';

export type ViewState = 
  | { type: 'loading'; className: string }
  | { type: 'error'; error: string; className: string }
  | { type: 'noData'; className: string }
  | { type: 'content'; props: PlaySessionViewProps };

export function selectViewState(props: PlaySessionViewProps): ViewState {
  const { loading, error, currentScene, currentEvent, className = '' } = props;

  if (loading) {
    return { type: 'loading', className };
  }

  if (error) {
    return { type: 'error', error, className };
  }

  if (!currentScene || !currentEvent) {
    return { type: 'noData', className };
  }

  return { type: 'content', props };
}