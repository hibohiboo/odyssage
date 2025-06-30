import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { mockReactRouter } from './mocks/react-router';

// コンポーネントをアンマウントするためにテスト後にクリーンアップを実行
afterEach(() => {
  cleanup();
});

// react-routerの共通モック設定
vi.mock('react-router', () => mockReactRouter());
