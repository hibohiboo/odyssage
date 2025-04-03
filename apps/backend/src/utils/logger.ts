/**
 * アプリケーションのロギングを提供するユーティリティ
 * 環境に応じてログ出力を制御する
 */
export class Logger {
  /**
   * エラーログを出力する
   * テスト環境では出力を抑制する
   *
   * @param message ログメッセージ
   * @param error エラーオブジェクト（オプション）
   */
  static error(message: string, error?: unknown): void {
    // テスト環境ではログを出力しない
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }

    console.error(message, error);
  }

  /**
   * 情報ログを出力する
   * テスト環境では出力を抑制する
   *
   * @param message ログメッセージ
   * @param data 追加データ（オプション）
   */
  static info(message: string, data?: unknown): void {
    // テスト環境ではログを出力しない
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }

    console.log(message, data);
  }

  /**
   * デバッグログを出力する
   * テスト環境では出力を抑制する
   *
   * @param message ログメッセージ
   * @param data 追加データ（オプション）
   */
  static debug(message: string, data?: unknown): void {
    // テスト環境ではログを出力しない
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }

    console.debug(message, data);
  }

  /**
   * 警告ログを出力する
   * テスト環境では出力を抑制する
   *
   * @param message ログメッセージ
   * @param data 追加データ（オプション）
   */
  static warn(message: string, data?: unknown): void {
    // テスト環境ではログを出力しない
    if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
      return;
    }

    console.warn(message, data);
  }
}
