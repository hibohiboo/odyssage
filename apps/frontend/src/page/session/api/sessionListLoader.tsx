/**
 * セッション一覧の読み込みを行う関数
 * GET /api/sessions APIを呼び出しセッションデータを取得する
 */
export async function sessionListLoader() {
  try {
    const response = await fetch('/api/sessions');

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
}
