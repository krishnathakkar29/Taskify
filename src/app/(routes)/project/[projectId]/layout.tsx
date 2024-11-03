import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto">
      <Suspense fallback={<span>Loading......</span>}>
        {children}
      </Suspense>
    </div>
  );
}
