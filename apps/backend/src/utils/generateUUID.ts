// filepath: d:\projects\odyssage\apps\backend\src\utils\generateUUID.ts

/**
 * UUIDを生成する関数
 * @returns 生成されたUUID
 */
export function generateUUID(): string {
  // UUIDのバージョン4に準拠した実装
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
