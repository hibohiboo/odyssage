import React from 'react';

export function Layout({
  navigation,
  children,
}: {
  navigation: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-stone-100 text-stone-800 min-h-screen`}>
      {navigation}
      <main className="pt-16">{children}</main>
    </div>
  );
}

export default Layout;
