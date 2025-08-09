# 本番環境運用 (将来計画)

Odyssage の本番環境における**将来的な理想的運用体制**の設計

## ⚠️ 重要な注意

**このドキュメントは将来の理想的な運用状態を記載しています。**
- **現在実装済み**: [[current-deployment]] を参照
- **段階的改善計画**: [[production-roadmap]] を参照

## 📋 理想的な本番環境構成

### 完全自動化後の環境構成
- **CDN + フロントエンド**: Cloudflare Pages (自動デプロイ)
- **バックエンドAPI**: Cloudflare Workers (自動デプロイ)
- **データベース**: Neon PostgreSQL + Neo4j Aura (高セキュリティ設定)
- **認証基盤**: Firebase Authentication (強化セキュリティ)
- **監視**: 包括的監視・アラート・可観測性

## 🚀 デプロイ手順

### 自動デプロイパイプライン

#### GitHub Actions概要
```yaml
# .github/workflows/deploy.yml
name: Deploy Production
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
      - name: Setup Bun
      - name: Install Dependencies  
      - name: Run Tests
      - name: Build Frontend
      - name: Deploy to Cloudflare
```

#### ブランチ戦略
```
develop → CI Tests → Dev環境デプロイ
     ↓
release/X.X.X → Staging環境デプロイ → 手動承認
     ↓  
main → Production環境デプロイ + タグ付け
```

### 手動デプロイ（緊急時）

#### Cloudflare Pages
```bash
# フロントエンドビルド・デプロイ
cd apps/frontend
bun run build
npx wrangler pages deploy dist --project-name odyssage
```

#### Cloudflare Workers  
```bash
# バックエンドAPI デプロイ
cd apps/backend
bun run build
npx wrangler deploy
```

## ⚙️ 環境設定

### Cloudflare設定

#### Pages Environment Variables
```bash
# Production環境
VITE_API_BASE_URL=https://api.odyssage.com
VITE_FIREBASE_PROJECT_ID=odyssage-prod
VITE_NEO4J_URI=bolt+s://xxx.databases.neo4j.io:7687

# Build設定
Build command: bun run build
Build output directory: dist
Root directory: apps/frontend
```

#### Workers Environment Variables
```bash
# Secrets (wrangler secret put)
NEON_CONNECTION_STRING=postgresql://user:pass@host/db
NEO4J_PASSWORD=your-neo4j-password
FIREBASE_PRIVATE_KEY=your-firebase-key

# Variables (wrangler.toml)
NEO4J_URL=bolt+s://xxx.databases.neo4j.io:7687
NEO4J_USER=neo4j
FIREBASE_PROJECT_ID=odyssage-prod
```

### データベース設定

#### Neon PostgreSQL
```sql
-- 本番環境セキュリティ設定
CREATE USER odyssage_prod WITH PASSWORD 'secure-password';
GRANT CONNECT ON DATABASE odyssage_prod TO odyssage_prod;
GRANT USAGE ON SCHEMA public TO odyssage_prod;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO odyssage_prod;

-- 接続制限・IP制限
ALTER USER odyssage_prod CONNECTION LIMIT 10;
```

#### Neo4j Aura
```cypher
// ユーザー権限設定
CREATE USER odyssage_prod SET PASSWORD 'secure-password';
GRANT ROLE reader TO odyssage_prod;
GRANT ROLE publisher TO odyssage_prod;

// インデックス作成（パフォーマンス対策）
CREATE INDEX scenario_id_index FOR (s:Scenario) ON (s.id);
CREATE INDEX scene_id_index FOR (sc:Scene) ON (sc.id);
```

### Firebase Authentication

#### 本番設定
```json
{
  "projectId": "odyssage-prod",
  "authDomain": "odyssage-prod.firebaseapp.com",
  "apiKey": "your-api-key",
  "appId": "your-app-id"
}
```

#### セキュリティルール
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザー認証必須
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 管理者のみ
    match /admin/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 📊 監視・可観測性

### メトリクス監視

#### Cloudflare Analytics
- **リクエスト数**: 時間別・エンドポイント別
- **レスポンス時間**: P50・P95・P99パーセンタイル
- **エラー率**: HTTP 4xx・5xx別集計
- **地理的分散**: リクエスト元の地域分析

#### カスタムメトリクス
```typescript
// Workers Analytics Engine 活用
export default {
  async fetch(request: Request, env: Env) {
    const start = Date.now();
    
    try {
      const response = await handleRequest(request, env);
      
      // 成功メトリクス記録
      env.ANALYTICS_ENGINE.writeDataPoint({
        'blobs': [request.url, 'success'],
        'doubles': [Date.now() - start],
        'indexes': [new Date().getDate()]
      });
      
      return response;
    } catch (error) {
      // エラーメトリクス記録
      env.ANALYTICS_ENGINE.writeDataPoint({
        'blobs': [request.url, 'error', error.message],
        'doubles': [Date.now() - start],
        'indexes': [new Date().getDate()]
      });
      
      throw error;
    }
  }
}
```

### ログ管理

#### 構造化ログ
```typescript
// 統一ログフォーマット
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: 'frontend' | 'backend' | 'database';
  userId?: string;
  action: string;
  details: Record<string, any>;
  requestId: string;
}

// ログ出力例
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'INFO',
  service: 'backend',
  userId: user.id,
  action: 'scenario_created',
  details: { scenarioId, title },
  requestId: request.headers.get('cf-request-id')
}));
```

#### ログ保持・分析
- **Cloudflare Logpush**: S3・BigQuery等への長期保存
- **Real-time Logs**: リアルタイムログストリーミング
- **Log Explorer**: クエリベースのログ検索・分析

### アラート設定

#### 重要アラート
```yaml
# 緊急レベル (即座対応)
High Error Rate:
  condition: error_rate > 5%
  window: 5 minutes
  notification: PagerDuty + Slack

Database Connection Failure:
  condition: db_connection_errors > 0
  window: 1 minute
  notification: PagerDuty + Email

# 警告レベル (営業時間内対応)  
High Response Time:
  condition: p95_response_time > 2000ms
  window: 15 minutes
  notification: Slack

Memory Usage High:
  condition: memory_usage > 80%
  window: 30 minutes
  notification: Email
```

## 🔐 セキュリティ運用

### アクセス制御

#### Cloudflare WAF
```yaml
# カスタムルール設定
Rate Limiting:
  - path: /api/auth/login
    limit: 5 requests/minute
    
  - path: /api/*
    limit: 100 requests/minute per IP

Security Rules:
  - block: SQL injection patterns
  - block: XSS patterns  
  - challenge: suspicious user agents
  - allow: known good IP ranges
```

#### API セキュリティ
```typescript
// JWT検証・ユーザー認証
export async function authenticateRequest(request: Request): Promise<User | null> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) return null;
  
  try {
    // Firebase Admin SDK で JWT検証
    const decodedToken = await admin.auth().verifyIdToken(token);
    return await getUser(decodedToken.uid);
  } catch (error) {
    console.error('Authentication failed:', error);
    return null;
  }
}

// レート制限
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(clientIP: string, limit: number = 100): boolean {
  const now = Date.now();
  const requests = rateLimiter.get(clientIP) || [];
  
  // 1分以内のリクエスト数をカウント
  const recentRequests = requests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= limit) {
    return false; // レート制限超過
  }
  
  recentRequests.push(now);
  rateLimiter.set(clientIP, recentRequests);
  return true;
}
```

### 定期セキュリティ監査

#### 脆弱性スキャン
```bash
# 依存関係脆弱性チェック（週次）
bun audit
npm audit fix

# コード品質・セキュリティチェック
bunx eslint . --ext .ts,.tsx
bunx tsc --noEmit
```

#### ペネトレーションテスト
- **頻度**: 四半期1回
- **範囲**: 全エンドポイント・認証フロー
- **外部業者**: セキュリティ専門会社に依頼

## 🔄 バックアップ・災害復旧

### データバックアップ

#### PostgreSQL (Neon)
```sql
-- 自動バックアップ設定（Neon Console）
-- Point-in-Time Recovery: 24時間
-- 完全バックアップ: 日次
-- 保持期間: 30日間

-- 手動バックアップ
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

#### Neo4j Aura
```cypher
// データエクスポート（定期実行）
CALL apoc.export.cypher.all("backup.cypher", {
  format: "cypher-shell",
  useOptimizations: {type: "UNWIND_BATCH", unwindBatchSize: 20}
});

// 週次フルバックアップをCloud Storageに保存
```

### 災害復旧計画

#### RTO/RPO目標
- **RTO** (Recovery Time Objective): 4時間以内
- **RPO** (Recovery Point Objective): 1時間以内

#### 復旧手順
```bash
# 1. システム状況確認
curl -f https://api.odyssage.com/health || echo "API DOWN"
curl -f https://odyssage.com || echo "Frontend DOWN"

# 2. データベース復旧
# Neon: Point-in-Time Recovery実行
# Neo4j: 最新バックアップから復元

# 3. アプリケーション復旧
# 前回正常バージョンにロールバック
git checkout $(git describe --tags --abbrev=0)
wrangler deploy

# 4. 動作確認・監視
# 全エンドポイント・主要機能のテスト実行
```

## 🛠️ トラブルシューティング

### よくある問題

#### API レスポンス遅延
```bash
# 1. Cloudflare Analytics確認
# レスポンス時間・エラー率の推移をチェック

# 2. データベース負荷確認
# Neon Dashboard でCPU・メモリ使用率確認
# Neo4j Console でクエリ実行時間確認

# 3. 一時的対策
# CDNキャッシュのTTL延長
# API レスポンスの一部キャッシュ化
```

#### データベース接続エラー
```typescript
// 接続プール・リトライ設定
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: env.NEON_CONNECTION_STRING,
  max: 20,              // 最大接続数
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// リトライ機能付きクエリ実行
async function executeWithRetry<T>(
  query: string, 
  params: any[] = [], 
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect();
      const result = await client.query(query, params);
      client.release();
      return result.rows;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

#### 認証問題
```typescript
// Firebase Auth トークン検証問題
async function debugAuthToken(token: string) {
  try {
    // トークンデコード（検証なし）
    const decoded = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', decoded);
    console.log('Expiry:', new Date(decoded.exp * 1000));
    
    // Firebase検証
    const verifiedToken = await admin.auth().verifyIdToken(token);
    console.log('Verified successfully:', verifiedToken.uid);
  } catch (error) {
    console.error('Token validation failed:', error);
  }
}
```

### 緊急対応手順

#### 1. 即座対応（5分以内）
- Cloudflare Dashboard で問題の特定
- 必要に応じてメンテナンスページ表示
- チーム通知（Slack・PagerDuty）

#### 2. 問題分析（15分以内）
- ログ・メトリクス分析
- 影響範囲・原因特定
- 応急処置実施

#### 3. 根本解決（1時間以内）
- 修正版デプロイ・設定変更
- 動作確認・テスト実行
- ユーザー影響の最小化

#### 4. 事後対応（24時間以内）
- インシデント報告書作成
- 再発防止策策定・実施
- 改善プロセス反映

---

## 📖 関連リソース

### 運用監視
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Firebase Console](https://console.firebase.google.com/)
- [Neon Console](https://console.neon.tech/)
- [Neo4j Aura Console](https://console.neo4j.io/)

### 設定・デプロイ
- [[local-environment]] - ローカル環境構築
- [[../02-architecture/environment-variables]] - 環境変数仕様
- `.github/workflows/` - CI/CDパイプライン設定

### 開発・品質
- [[../03-development/process]] - 開発プロセス・品質保証
- [[../03-development/testing-strategy]] - テスト戦略・E2Eテスト

#deployment #production #monitoring #operations