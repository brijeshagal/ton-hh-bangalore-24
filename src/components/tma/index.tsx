"use client";

import { SDKProvider } from "@tma.js/sdk-react";
import { PropsWithChildren } from "react";

export function TmaSDKProvider({ children }: PropsWithChildren) {
  return (
    <SDKProvider acceptCustomStyles debug>
      {children}
    </SDKProvider>
  );
}
