type Props = {
  children: JSX.Element | JSX.Element[];
};

const AdminPageWrapper = ({ children }: Props) => {
  return (
    <div className="max-w-screen relative min-h-screen w-full p-0 pt-3 lg:p-3 lg:pt-3">
      {children}
    </div>
  );
};

export default AdminPageWrapper;
