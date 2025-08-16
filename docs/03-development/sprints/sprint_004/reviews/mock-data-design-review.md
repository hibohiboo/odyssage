Scenario（シナリオ）データ構造

MVPでは不要と感じたもの

- category、difficulty
- playerCount.recommended もMVP段階では不要。
- backgroundImageUrl
- author.profile
- stats

## 2. Scene（シーン）データ構造

MVPでは不要と感じたもの

- mood
- bgm
- estimatedReadTime
- metadata.weather
- difficulty

使い方がよくわからないもの

- isStarting
- isEnding
- chapterIndex

### 3. Choice（選択肢）データ構造

MVPでは不要と感じたもの

- weight
- requirements
  検討したいもの
- consequences ... シーン中で選択肢を選ばなくてももらえるアイテムなどもあると思う。 シーンの下にイベントという概念を作るのはどうか。
- 選択肢の種類を増やす提案を、プレイヤーがGMに行えるようにしたい。これはMVPではないが、将来的に行いたいこととしてドキュメントにフィードバックしておいてほしい

### 4. Session（セッション）データ構造

MVPでは不要と感じたもの

- estimatedCompletionTime
- progress
- decisionTimeSeconds
- alternativesConsidered

### 5. PlayRecord（プレイ記録）データ構造

MVPでは不要と感じたもの

- finalScore
- statistics.difficultChoicesCount
- statistics.averageDecisionTime
  使い方がよくわからないもの
- statistics.uniqueScenesVisited
- statistics.backtrackCount
- timeSpentSeconds
- isFirstVisit

### データローダー設計

実装の領域に入っている。
データローダーの要件がレビュアーに伝わらない

### バリデーション・型安全性

全体的に、拡張性に乏しい。

たとえば、 `category: z.enum(['fantasy', 'scifi', 'mystery', 'horror', 'adventure', 'drama', 'comedy'])`でカテゴリの範囲を狭めてしまっている

### データ検証スクリプト

実装の領域に入っている。
要件がレビュアーに伝わらない

### Phase 1: MVP必須データ（今週完了目標）

2シナリオがあればMVPには十分。「失われた森の守護者」のケースと「薬草採取」のケースを用意する。
