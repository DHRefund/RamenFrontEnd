import type { ReactNode } from "react";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerFooter } from "./CustomerFooter";

interface CustomerLayoutProps {
  children: ReactNode;
}

export const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
};
