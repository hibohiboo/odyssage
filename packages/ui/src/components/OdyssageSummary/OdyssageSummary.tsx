import React from 'react';
import { Compass, Map, BookOpen, Users, ArrowRight } from 'lucide-react';
import FeatureCard from '../FeatureCard';

export const OdyssageSummary = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'ゲームブック風TRPG',
      description:
        '選択肢によって物語が分岐するゲームブックの形式を取り入れた、 新しいスタイルのTRPGを体験できます。',
    },
    {
      icon: Users,
      title: '非同期プレイ',
      description:
        '時間や場所を選ばず、プレイヤーとGMが自分のペースで ゲームを進行できる非同期型のプレイスタイルです。',
    },
    {
      icon: Map,
      title: 'シナリオ管理',
      description:
        '直感的なインターフェースでシナリオを作成・管理。フローチャートでストーリーの分岐を視覚的に把握できます。',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className={index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}
        >
          <FeatureCard
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        </div>
      ))}
    </div>
  );
};

export default OdyssageSummary;
