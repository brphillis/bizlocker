import background from "../../../assets/banners/banner-login.jpg";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const AuthPageWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex h-full min-h-[calc(100vh-64px)] w-full items-center justify-center">
      <div
        style={{
          backgroundImage: `url(${background})`,
        }}
        className="absolute top-0 z-0 h-full w-full bg-cover brightness-75"
      />
      {children}
    </div>
  );
};

export default AuthPageWrapper;
