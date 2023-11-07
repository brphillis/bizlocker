type Props = {
  children: JSX.Element | JSX.Element[];
};

const AdminPageWrapper = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen w-full bg-brand-black p-0">
      {children}
    </div>
  );
};

export default AdminPageWrapper;
