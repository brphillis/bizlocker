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
        <a className="link-hover link">About us</a>
        <a className="link-hover link">Contact</a>
        <a className="link-hover link">Jobs</a>
        <a className="link-hover link">Press kit</a>
      </div>
      <div className="text-brand-white">
        <span className="footer-title">Legal</span>
        <a className="link-hover link">Terms of use</a>
        <a className="link-hover link">Privacy policy</a>
        <a className="link-hover link">Cookie policy</a>
      </div>
    </footer>
  );
};

export default Footer;
