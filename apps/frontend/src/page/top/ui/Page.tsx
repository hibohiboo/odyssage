import { TopDecoration, OdyssageSummary, Footer } from '@odyssage/ui/top';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

export const Page = () => {
  const uid = useAppSelector(uidSelector);
  if (!uid) {
    return <></>;
  }

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

        <OdyssageSummary />
      </section>

      {/* CTA Section */}

      {/* Footer */}
      <Footer />
    </div>
  );
};
