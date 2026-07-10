import logoW from "../assets/icons/logo-w.svg";
import logoRun from "../assets/icons/logo-run.svg";

export default function BrandLogo({ className }: { className?: string }) {
  const base = "flex items-center";
  return (
    <div className={className ? `${base} ${className}` : base}>
      <img src={logoW} alt="W" className="w-[17.1px] h-[21.4px]" />
      <div className="flex flex-col gap-[5.2px] mx-[4.5px] mt-[1px]">
        <i className="w-[4.4px] h-[3.6px] bg-primary-lime" />
        <i className="w-[4.4px] h-[3.6px] bg-primary-lime" />
        <i className="w-[4.4px] h-[3.6px] bg-primary-lime" />
      </div>
      <img src={logoRun} alt="RUN" className="w-[34.2px] h-[21.6px]" />
    </div>
  );
}
