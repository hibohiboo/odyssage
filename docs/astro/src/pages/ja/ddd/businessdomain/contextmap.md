---
title: Context Map
description: 事業領域の定義 ユースケース
layout: ../../../../layouts/MainLayout.astro
---


<pre class="mermaid">
flowchart TD
    %% 文脈ノードの定義
    subgraph Domain["オデッサージュ"]
        CharacterContext["キャラクター文脈"]
        ScenarioContext["シナリオ文脈"]
        SessionContext["セッション文脈"]
        PartyContext["パーティ文脈"]
        NotificationContext["通知文脈"]
    end

    %% 文脈間の関係
    CharacterContext -->|参照| ScenarioContext
    CharacterContext -->|参加| SessionContext
    ScenarioContext -->|含む| SessionContext
    SessionContext -->|構成| PartyContext
    PartyContext -->|所属| CharacterContext
    ScenarioContext -->|通知送信| NotificationContext
    SessionContext -->|通知送信| NotificationContext
</pre>

