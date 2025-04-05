import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// コンポーネントをアンマウントするためにテスト後にクリーンアップを実行
afterEach(() => {
  cleanup();
});
