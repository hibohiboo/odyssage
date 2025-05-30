import { Save, X, Tag, ArrowLeft, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router';
import { FormInput } from './FormInput';
import { FormSection } from './FormSection';
import { FormTextArea } from './FormTextArea';
import type React from 'react';

export interface ScenarioEditProps {
  readonly pageTitle?: string;
  // State props
  readonly title?: string;
  readonly description?: string;
  readonly tags?: string[];
  readonly newTag?: string;
  readonly visibility?: 'private' | 'public';
  readonly loading?: boolean;

  // Handler props
  readonly onTitleChange?: (value: string) => void;
  readonly onDescriptionChange?: (value: string) => void;
  readonly onNewTagChange?: (value: string) => void;
  readonly onVisibilityChange?: (value: 'private' | 'public') => void;
  readonly onAddTag?: () => void;
  readonly onRemoveTag?: (tagToRemove: string) => void;
  readonly onSave?: () => void;

  // Additional settings props
  readonly difficulty?: string;
  readonly onDifficultyChange?: (value: string) => void;
  readonly playerCount?: string;
  readonly onPlayerCountChange?: (value: string) => void;
  readonly playtime?: string;
  readonly onPlaytimeChange?: (value: string) => void;

  // Option
  readonly isViewSidebar?: boolean;
  readonly isViewTags?: boolean;
}

// eslint-disable-next-line complexity
export default function ScenarioEdit({
  title,
  description,
  tags,
  newTag,
  visibility,
  onTitleChange,
  onDescriptionChange,
  onNewTagChange,
  onVisibilityChange,
  onAddTag,
  onRemoveTag,
  onSave,
  difficulty,
  onDifficultyChange,
  playerCount,
  onPlayerCountChange,
  playtime,
  onPlaytimeChange,
  isViewSidebar,
  isViewTags,
  loading,
  pageTitle,
}: ScenarioEditProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddTag?.();
    }
  };

  // Safe handlers that check for undefined
  const handleTitleChange = (value: string) => onTitleChange?.(value);
  const handleDescriptionChange = (value: string) =>
    onDescriptionChange?.(value);
  const handleNewTagChange = (value: string) => onNewTagChange?.(value);
  const handleVisibilityChange = (value: 'private' | 'public') =>
    onVisibilityChange?.(value);
  const handleAddTag = () => onAddTag?.();
  const handleRemoveTag = (tag: string) => onRemoveTag?.(tag);
  const handleSave = () => onSave?.();
  const handleDifficultyChange = (value: string) => onDifficultyChange?.(value);
  const handlePlayerCountChange = (value: string) =>
    onPlayerCountChange?.(value);
  const handlePlaytimeChange = (value: string) => onPlaytimeChange?.(value);

  // Use actual values or fallbacks when rendering
  const actualTags = tags || [];
  const actualVisibility = visibility || 'private';
  const actualDifficulty = difficulty || 'normal';
  const actualPlayerCount = playerCount || '4-5';
  const actualPlaytime = playtime || 'medium';
  const shouldViewSidebar = isViewSidebar || false;
  const shouldViewTags = isViewTags || false;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/creator/scenario/list"
        className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        シナリオ一覧に戻る
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">
          {pageTitle ?? '新規シナリオ作成'}
        </h1>

        <div
          className={`${!shouldViewSidebar ? 'md:mr-auto lg:mr-[calc(33.333333%-1rem)]' : ''}`}
        >
          <button
            className="flex cursor-pointer"
            onClick={handleSave}
            type="submit"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Creating...' : '保存する'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          <FormSection>
            <FormInput
              id="title"
              label="シナリオタイトル"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="冒険の名前を入力してください"
              required
            />

            <FormTextArea
              id="overview"
              label="シナリオ概要"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="シナリオの概要や背景を入力してください"
              rows={5}
              required
            />
          </FormSection>
          {shouldViewTags && (
            <FormSection title="タグ">
              <div className="flex flex-wrap gap-2 mb-4">
                {actualTags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-amber-500 hover:text-amber-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {actualTags.length === 0 && (
                  <p className="text-sm text-stone-500">
                    タグを追加してシナリオを分類しましょう
                  </p>
                )}
              </div>

              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => handleNewTagChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="新しいタグを追加"
                  className="input flex-1 mr-2"
                />
                <button onClick={handleAddTag} className="btn btn-outline">
                  <Tag className="mr-2 h-4 w-4" />
                  追加
                </button>
              </div>
            </FormSection>
          )}

          <FormSection title="公開設定">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="private"
                    type="radio"
                    name="visibility"
                    checked={actualVisibility === 'private'}
                    onChange={() => handleVisibilityChange('private')}
                    className="h-4 w-4 text-amber-700 border-stone-300 focus:ring-amber-500"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="private"
                    className="font-medium text-stone-700 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    非公開（下書き）
                  </label>
                  <p className="text-stone-500 text-sm">
                    シナリオは保存されますが、GMには表示されません。編集が完了するまで非公開にしておきます。
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="public"
                    type="radio"
                    name="visibility"
                    checked={actualVisibility === 'public'}
                    onChange={() => handleVisibilityChange('public')}
                    className="h-4 w-4 text-amber-700 border-stone-300 focus:ring-amber-500"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="public"
                    className="font-medium text-stone-700 flex items-center"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    公開
                  </label>
                  <p className="text-stone-500 text-sm">
                    シナリオを公開し、GMが卓を立てられるようにします。公開後も編集は可能です。
                  </p>
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {shouldViewSidebar && (
            <>
              <div className="card p-6 mb-6">
                <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
                  シナリオ設定
                </h2>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="difficulty"
                      className="block text-sm font-medium text-stone-700 mb-1"
                    >
                      難易度
                    </label>
                    <select
                      id="difficulty"
                      className="input w-full"
                      value={actualDifficulty}
                      onChange={(e) => handleDifficultyChange(e.target.value)}
                    >
                      <option value="easy">簡単</option>
                      <option value="normal">普通</option>
                      <option value="hard">難しい</option>
                      <option value="very-hard">非常に難しい</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="players"
                      className="block text-sm font-medium text-stone-700 mb-1"
                    >
                      推奨プレイヤー数
                    </label>
                    <select
                      id="players"
                      className="input w-full"
                      value={actualPlayerCount}
                      onChange={(e) => handlePlayerCountChange(e.target.value)}
                    >
                      <option value="1">1人</option>
                      <option value="2-3">2〜3人</option>
                      <option value="4-5">4〜5人</option>
                      <option value="6+">6人以上</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="playtime"
                      className="block text-sm font-medium text-stone-700 mb-1"
                    >
                      想定プレイ時間
                    </label>
                    <select
                      id="playtime"
                      className="input w-full"
                      value={actualPlaytime}
                      onChange={(e) => handlePlaytimeChange(e.target.value)}
                    >
                      <option value="short">短め（〜30分）</option>
                      <option value="medium">普通（30分〜1時間）</option>
                      <option value="long">長め（1時間〜2時間）</option>
                      <option value="very-long">非常に長い（2時間以上）</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
                  ヒント
                </h2>

                <div className="text-sm text-stone-600 space-y-3">
                  <p>
                    ✓ シナリオのタイトルは魅力的で記憶に残るものにしましょう
                  </p>
                  <p>
                    ✓
                    概要は簡潔に、GMとプレイヤーの興味を引く内容を心がけましょう
                  </p>
                  <p>✓ タグを追加すると、シナリオが検索されやすくなります</p>
                  <p>
                    ✓
                    シナリオを保存した後、フローチャートエディタでストーリーの分岐を作成できます
                  </p>
                  <p>✓ 公開前に必ずプレビューで確認しましょう</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
