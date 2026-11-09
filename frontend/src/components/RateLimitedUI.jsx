import { ZapIcon } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8">
      <div role="alert" className="alert alert-vertical sm:alert-horizontal bg-base-100">
        <ZapIcon className="size-5 text-primary" />
        <div>
          <h3 className="font-semibold">Too many requests</h3>
          <p className="text-base-content/70">Wait a few seconds, then refresh the page.</p>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;
