type Props = {
  children: JSX.Element | JSX.Element[];
};

const AdminPageWrapper = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen w-full bg-brand-black p-0 pt-3 max-lg:pt-0 lg:p-3">
      {children}
    </div>
  );
};

export default AdminPageWrapper;
