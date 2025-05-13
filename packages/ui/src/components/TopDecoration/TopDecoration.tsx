import { Compass, Map } from 'lucide-react';

export const TopDecoration = () => (
    <>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 opacity-10 rotate-12">
        <Compass className="w-full h-full text-amber-900" />
      </div>
      <div className="absolute -top-8 -right-8 w-24 h-24 opacity-10 -rotate-12">
        <Map className="w-full h-full text-amber-900" />
      </div>
    </>
  );

export default TopDecoration;
