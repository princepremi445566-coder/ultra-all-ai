"use client";

import { useEffect, useRef } from "react";

export function AdBanner() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        initialized.current = true;
      } catch (e) {
        // Ad blockers or script loading issues
      }
    }
  }, []);

  return (
    <div className="my-8 w-full flex justify-center overflow-hidden min-h-[100px] bg-muted/10 rounded-xl items-center border border-dashed border-primary/20">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", textAlign: "center" }}
        data-ad-client="ca-pub-8786660437030626"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
