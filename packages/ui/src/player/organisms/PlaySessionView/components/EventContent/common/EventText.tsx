interface EventTextProps {
  text: string;
  allowLineBreaks?: boolean;
}

/**
 * Event内容テキスト表示コンポーネント
 * 共通のスタイリングを適用
 */
export function EventText({ text, allowLineBreaks = false }: EventTextProps) {
  return (
    <div className="prose prose-gray max-w-none">
      <p 
        className={`text-gray-800 leading-relaxed font-serif text-lg ${
          allowLineBreaks ? 'whitespace-pre-line' : ''
        }`}
      >
        {text}
      </p>
    </div>
  );
}