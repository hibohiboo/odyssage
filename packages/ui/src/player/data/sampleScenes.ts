// サンプルScene・Eventデータ - Event処理エンジンテスト用
import type { Scene, MVPEvent } from '../engine/EventEngine';

// サンプルEvent群
const sampleEvents: MVPEvent[] = [
  // Scene 1: 森の入り口
  {
    id: 'forest_entrance_start',
    type: 'narrative',
    title: '古い森への入り口',
    content:
      'あなたは古い森の入り口に立っています。深い霧が漂い、木々の向こうから不思議な音が聞こえてきます。',
    nextEventId: 'forest_entrance_choice',
    data: {
      narrativeText:
        'あなたは古い森の入り口に立っています。深い霧が漂い、木々の向こうから不思議な音が聞こえてきます。',
    },
  },
  {
    id: 'forest_entrance_choice',
    type: 'choice',
    title: '進路の選択',
    content: 'どの道を進みますか？',
    data: {
      choices: [
        {
          id: 'choice_left_path',
          text: '左の小道を進む',
          description: '苔むした石が並ぶ小道。静寂に包まれている。',
          nextEventId: 'left_path_exploration',
          type: 'action',
          isAvailable: true,
        },
        {
          id: 'choice_right_path',
          text: '右の大きな道を進む',
          description: '馬車の轍が残る広い道。遠くに光が見える。',
          nextEventId: 'right_path_dialogue',
          type: 'action',
          isAvailable: true,
        },
        {
          id: 'choice_observe',
          text: 'もう少し周りを観察する',
          description: '慎重に状況を把握してから行動したい。',
          nextEventId: 'forest_observation',
          type: 'strategic',
          isAvailable: true,
        },
      ],
    },
  },
  {
    id: 'left_path_exploration',
    type: 'exploration',
    title: '小道の探索',
    content: '小道を進むと、古い石碑を発見しました。',
    nextEventId: 'stone_monument_scene',
    data: {
      targetName: '古い石碑',
      resultText:
        '石碑には古代文字が刻まれており、微かに光を放っています。触れてみますか？',
    },
  },
  {
    id: 'right_path_dialogue',
    type: 'dialogue',
    title: '旅人との出会い',
    content: '道の途中で年老いた旅人に出会いました。',
    nextEventId: 'traveler_conversation',
    data: {
      npcName: '年老いた旅人',
      npcText:
        'おお、若者よ。この森は危険だ。古の魔法が残っているのだ。気をつけるがよい。',
    },
  },
  {
    id: 'forest_observation',
    type: 'narrative',
    title: '森の観察',
    content:
      '周りを慎重に観察すると、森の奥深くから青い光が漏れているのが見えました。',
    nextEventId: 'scene_transition_depths',
    data: {
      narrativeText:
        '周りを慎重に観察すると、森の奥深くから青い光が漏れているのが見えました。光の方向へ向かいますか？',
    },
  },
  {
    id: 'scene_transition_depths',
    type: 'scene_transition',
    title: '森の深部へ',
    content: '青い光に導かれて、森の深部へと向かいます。',
    data: {
      targetSceneId: 'forest_depths',
      transitionText: '光に包まれながら、あなたは森の深部へと足を向けました...',
    },
  },
  // Scene 2: 森の深部
  {
    id: 'forest_depths_start',
    type: 'narrative',
    title: '森の心臓部',
    content:
      '森の最深部に到着しました。ここは魔法のエネルギーが渦巻く神秘的な場所です。',
    nextEventId: 'depths_magic_choice',
    data: {
      narrativeText:
        '森の最深部に到着しました。ここは魔法のエネルギーが渦巻く神秘的な場所です。中央には古い祭壇があります。',
    },
  },
  {
    id: 'depths_magic_choice',
    type: 'choice',
    title: '魔法の祭壇',
    content: '祭壇にはエネルギーが蓄えられています。どうしますか？',
    data: {
      choices: [
        {
          id: 'choice_touch_altar',
          text: '祭壇に触れる',
          description: '魔法のエネルギーを感じ取ろうとする。',
          nextEventId: 'altar_magic_result',
          type: 'creative',
          isAvailable: true,
        },
        {
          id: 'choice_study_altar',
          text: '祭壇を詳しく調べる',
          description: '慎重に祭壇の構造を分析する。',
          nextEventId: 'altar_study_result',
          type: 'strategic',
          isAvailable: true,
        },
        {
          id: 'choice_leave_altar',
          text: '祭壇から離れる',
          description: '危険を感じて元の場所に戻る。',
          nextEventId: 'scene_transition_return',
          type: 'action',
          isAvailable: true,
        },
      ],
    },
  },
  {
    id: 'altar_magic_result',
    type: 'narrative',
    title: '魔法の覚醒',
    content:
      '祭壇に触れると、温かいエネルギーがあなたの体を包みました。新しい力を得たようです。',
    data: {
      narrativeText:
        '祭壇に触れると、温かいエネルギーがあなたの体を包みました。新しい力を得たようです。',
    },
  },
  {
    id: 'altar_study_result',
    type: 'exploration',
    title: '祭壇の研究',
    content: '祭壇を詳しく調べました。',
    data: {
      targetName: '古代の祭壇',
      resultText:
        '祭壇の文様から、これが自然の力を増幅する装置だということがわかりました。',
    },
  },
  {
    id: 'scene_transition_return',
    type: 'scene_transition',
    title: '森の入り口に戻る',
    content: '元の場所に戻ることにしました。',
    data: {
      targetSceneId: 'forest_entrance',
      transitionText: '慎重に来た道を戻り、森の入り口へと向かいます...',
    },
  },
];

// Scene定義
export const sampleScenes: Scene[] = [
  {
    id: 'forest_entrance',
    title: '古い森の入り口',
    description: '霧に包まれた神秘的な森の入り口。冒険の始まりの場所。',
    backgroundImage:
      'https://dummyimage.com/1200x800/2d5016/ffffff?text=Forest+Entrance',
    startingEventId: 'forest_entrance_start',
    events: sampleEvents.filter((event) =>
      [
        'forest_entrance_start',
        'forest_entrance_choice',
        'left_path_exploration',
        'right_path_dialogue',
        'forest_observation',
        'scene_transition_depths',
      ].includes(event.id),
    ),
  },
  {
    id: 'forest_depths',
    title: '森の深部',
    description: '魔法のエネルギーが渦巻く森の最深部。古代の秘密が眠る場所。',
    backgroundImage:
      'https://dummyimage.com/1200x800/1a365d/ffffff?text=Forest+Depths',
    startingEventId: 'forest_depths_start',
    events: sampleEvents.filter((event) =>
      [
        'forest_depths_start',
        'depths_magic_choice',
        'altar_magic_result',
        'altar_study_result',
        'scene_transition_return',
      ].includes(event.id),
    ),
  },
];

// Event処理エンジンテスト用のセッション設定
export const sampleSessionConfig = {
  sessionId: 'test-session-001',
  startingSceneId: 'forest_entrance',
  title: 'Forest of Ancient Magic',
  description: 'A mystical journey through an enchanted forest',
  playerName: 'Adventurer',
};
