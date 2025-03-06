import Link from 'next/link';
import { Compass, Map, BookOpen, Users, ArrowRight } from 'lucide-react';

// Component for feature cards
const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="card p-6 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-amber-700" />
    </div>
    <h3 className="text-xl font-serif font-bold text-amber-800 mb-2">
      {title}
    </h3>
    <p className="text-stone-600">{description}</p>
  </div>
);

// Component for CTA buttons
const CtaButton = ({
  href,
  variant = 'primary',
  children,
}: {
  href: string;
  variant?: 'primary' | 'outline';
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'}`}
  >
    {children}
  </Link>
);

export default function Home() {
  const currentYear = new Date().getFullYear();

  // Feature data for reusability
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
        <div className="absolute -bottom-16 -left-16 w-32 h-32 opacity-10 rotate-12">
          <Compass className="w-full h-full text-amber-900" />
        </div>
        <div className="absolute -top-8 -right-8 w-24 h-24 opacity-10 -rotate-12">
          <Map className="w-full h-full text-amber-900" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-amber-800 mb-12">
            Odyssageの特徴
          </h2>

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
      <footer className="py-8 bg-stone-800 text-stone-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Compass className="h-5 w-5" />
              <span className="font-serif font-bold">Odyssage</span>
            </div>
            <div className="text-sm">
              &copy; {currentYear} Odyssage -
              未知を辿る、非同期型ゲームブック風TRPG
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
