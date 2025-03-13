import { Map, BookOpen, Users, ArrowRight } from '@odyssage/ui/icons';
import { CtaButton, FeatureCard } from '@odyssage/ui/index';
import { TopDecoration, Footer } from '@odyssage/ui/top';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

export const Page = () => {
  const uid = useAppSelector(uidSelector);
  if (!uid) {
    return <></>;
  }
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden map-texture">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-amber-800 mb-4">
              未知を辿る、非同期型ゲームブック風TRPG
            </h1>
            <p className="text-lg md:text-xl text-stone-700 mb-8">
              Odyssageで、あなただけの冒険を創り出し、共有しましょう。
              プレイヤーは自由に物語を進め、GMは非同期でシナリオを管理できます。
            </p>
            <CtaButton href="/create">
              シナリオを作成する
              <ArrowRight className="ml-2 h-5 w-5" />
            </CtaButton>
          </div>
        </div>

        {/* Decorative elements */}
        <TopDecoration />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-amber-800 mb-12">
            Odyssageの特徴
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={`${feature.title}-${index}`}
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-50 paper-texture">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-800 mb-4">
            あなたの物語を始めましょう
          </h2>
          <p className="text-lg text-stone-700 mb-8 max-w-2xl mx-auto">
            Odyssageで、プレイヤーを魅了するシナリオを作成し、
            共有しましょう。新しい冒険があなたを待っています。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CtaButton href="/create">シナリオを作成する</CtaButton>
            <CtaButton href="/dashboard" variant="outline">
              シナリオ一覧を見る
            </CtaButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
