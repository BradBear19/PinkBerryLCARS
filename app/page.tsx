"use client";

import LCARSApp from "./components/LCARSApp";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <LCARSApp>
      {children}
    </LCARSApp>
  );
}