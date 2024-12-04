"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://ton-hh-bangalore-24.vercel.app/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
};

export default Provider;
