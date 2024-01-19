import background from "../../../../assets/banners/banner-login.jpg";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const AuthPageWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex h-[100dvh] min-h-[calc(100dvh-64px)] w-full flex-col items-center justify-center">
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
