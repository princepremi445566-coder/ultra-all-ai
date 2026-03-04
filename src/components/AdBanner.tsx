"use client";

import { useEffect } from "react";

export function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silent error as ad blockers might prevent this
    }
  }, []);

  return (
    <div className="my-8 w-full flex justify-center overflow-hidden min-h-[100px] bg-muted/20 rounded-xl items-center border border-dashed">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8786660437030626"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
