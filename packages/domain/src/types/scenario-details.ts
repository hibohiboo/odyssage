/**
 * シナリオ詳細保存用の型定義
 */

export interface SceneDetailData {
  id: string;
  title: string;
  description?: string;
  sceneType: string;
  order: number;
  events: EventDetailData[];
}

export interface EventDetailData {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  order: number;
  trigger?: string;
  messages: MessageDetailData[];
}

export interface MessageDetailData {
  id: string;
  content: string;
  messageType: string;
  order: number;
  speaker?: string;
  metadata?: Record<string, unknown>;
}