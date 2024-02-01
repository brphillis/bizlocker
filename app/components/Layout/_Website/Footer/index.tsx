import { Link } from "@remix-run/react";

const Footer = () => {
  return (
    <footer className="h-max w-screen bg-brand-black">
      <div className="footer mt-[-1px] p-10 text-base-content">
        <div className="flex flex-col items-start gap-3 text-brand-white">
          <h1 className="select-none text-center text-3xl font-bold tracking-wide text-brand-white/90">
            CLUTCH.
          </h1>
          <p className="ml-3">Clothing Co.</p>
          {/* <div className="text-xs">Sign Up to our Newsletter</div>
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
          </div> */}
        </div>

        <div className="text-brand-white">
          <span className="footer-title">Company</span>
          <Link className="link-hover link" to="/faq">
            FAQ
          </Link>
          <Link className="link-hover link" to="/about-us">
            About us
          </Link>
        </div>
        <div className="text-brand-white">
          <span className="footer-title">Legal</span>
          <Link className="link-hover link" to="/terms-conditions">
            Terms of use
          </Link>
          <Link className="link-hover link" to="/privacy-policy">
            Privacy policy
          </Link>
          <Link className="link-hover link" to="/cookie-policy">
            Cookie policy
          </Link>
        </div>
      </div>

      <div className="divider !m-0 w-full !p-0 before:bg-brand-white/10 after:bg-brand-white/10" />

      <div className="px-10 py-6">{/* MORE CONTENT */}</div>
    </footer>
  );
};

export default Footer;
