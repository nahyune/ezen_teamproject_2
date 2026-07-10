import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";
import "./BrandLogo.css";

export default function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={className ? `brand-logo ${className}` : "brand-logo"}>
      <img src={logoW} alt="W" className="brand-logo__w" />
      <div className="brand-logo__dots">
        <i />
        <i />
        <i />
      </div>
      <img src={logoRun} alt="RUN" className="brand-logo__run" />
    </div>
  );
}
