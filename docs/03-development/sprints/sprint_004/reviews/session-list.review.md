docs\02-architecture\player-context\screens\session-list.md のレビューを行います

### 読み込み・応答性

```typescript
interface PerformanceSpec {
  loading_strategy: {
    initial_load: '3秒以内での初期表示完了';
    skeleton_display: '読み込み中のスケルトン表示';
    lazy_loading: '画像の遅延読み込み対応';
  };

  data_management: {
    pagination: '大量セッション対応（仮想スクロール）';
    caching: 'セッション情報の適切なキャッシュ';
    refresh: 'リアルタイム状態更新（WebSocket or ポーリング）';
  };

  responsive_behavior: {
    breakpoint_switching: '300ms以内でのレイアウト切り替え';
    touch_response: 'タッチ操作への即座の視覚フィードバック';
    loading_states: '全ての非同期操作に対する適切な状態表示';
  };
}
```

下記 はMVPでは不要です。
data_management.pagination
data_management.refresh
responsive_behavior.breakpoint_switching
