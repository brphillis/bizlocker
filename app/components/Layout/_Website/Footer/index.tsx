const Footer = () => {
  return (
    <footer className="h-max w-screen bg-brand-black">
      <div className="footer mt-[-1px] p-10 text-base-content">
        {/* <div className="text-center text-brand-white">
          <h1 className="select-none pt-6 text-center text-3xl font-bold tracking-wide text-brand-white/90">
            CLUTCH.
          </h1>
        </div> */}

        <div className="flex flex-col items-start gap-3 text-brand-white">
          <h1 className="select-none text-center text-3xl font-bold tracking-wide text-brand-white/90">
            CLUTCH.
          </h1>
          <div className="text-xs">Sign Up to our Newsletter</div>
          <div className="flex items-center gap-3">
            <input
              className="input input-bordered input-sm w-[215px] max-w-full text-brand-black/50"
              type="text"
              placeholder="Email"
            />
            <button
              type="submit"
              className="btn-primary !h-[41px] rounded-sm px-3"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="text-brand-white">
          <span className="footer-title">Company</span>
          <p className="link-hover link">Our Locations</p>
          <p className="link-hover link">About us</p>
        </div>
        <div className="text-brand-white">
          <span className="footer-title">Legal</span>
          <p className="link-hover link">Terms of use</p>
          <p className="link-hover link">Privacy policy</p>
          <p className="link-hover link">Cookie policy</p>
        </div>

        <div className="text-brand-white">
          <span className="footer-title">FAQ's & Support</span>
          <p className="link-hover link">Gift Cards</p>
          <p className="link-hover link">Size guide</p>
          <p className="link-hover link">Return policy</p>
        </div>
      </div>

      <div className="divider !m-0 w-full !p-0 before:bg-brand-white/10 after:bg-brand-white/10" />

      <div className="px-10 py-6">{/* MORE CONTENT */}</div>
    </footer>
  );
};

export default Footer;
