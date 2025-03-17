export const Layout: React.FC<{
  navigation: React.ReactNode;
  children: React.ReactNode;
}> = ({ navigation, children }) => {
  return (
    <div className={`bg-stone-100 text-stone-800 min-h-screen`}>
      {navigation}
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
