const Footer = () => {
  return (
    <footer className="footer mt-[-1px] bg-brand-black p-10 text-base-content">
      <div>
        <h1 className="select-none pt-6 text-center text-3xl font-bold tracking-wide text-brand-white/90">
          CLUTCH.
        </h1>
        <p>
          Clutch Ltd.
          <br />
          Style. Fashion. Wow.
        </p>
      </div>
      <div className="text-brand-white">
        <span className="footer-title">Company</span>
        <p className="link-hover link">About us</p>
        <p className="link-hover link">Contact</p>
        <p className="link-hover link">Jobs</p>
        <p className="link-hover link">Press kit</p>
      </div>
      <div className="text-brand-white">
        <span className="footer-title">Legal</span>
        <p className="link-hover link">Terms of use</p>
        <p className="link-hover link">Privacy policy</p>
        <p className="link-hover link">Cookie policy</p>
      </div>
    </footer>
  );
};

export default Footer;
