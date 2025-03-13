import { Compass } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
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
  );
};

export default Footer;
