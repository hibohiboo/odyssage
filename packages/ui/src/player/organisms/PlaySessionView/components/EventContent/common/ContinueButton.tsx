import { EventButton } from '../../../../../atoms/EventButton';

interface ContinueButtonProps {
  onContinue: () => void;
}

/**
 * Event進行用の「続ける」ボタンコンポーネント
 * 共通のスタイリングとレイアウトを提供
 */
export function ContinueButton({ onContinue }: ContinueButtonProps) {
  return (
    <div className="flex justify-center">
      <EventButton
        onClick={onContinue}
        variant="continue"
        className="px-8 py-3"
        data-testid="continue-button"
      >
        続ける
      </EventButton>
    </div>
  );
}