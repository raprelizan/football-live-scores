import { useEffect } from "react";

interface AdSpaceProps {
  position: "top" | "sidebar" | "bottom" | "inline";
  pageType?: string;
  className?: string;
}

export default function AdSpace({
  position,
  pageType,
  className = "",
}: AdSpaceProps) {
  useEffect(() => {
    // Initialize Google AdSense if available
    if ((window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
          google_ad_client: "ca-pub-xxxxxxxxxxxxxxxx", // Replace with your AdSense ID
          enable_page_level_ads: true,
        });
      } catch (e) {
        console.log("AdSense not loaded yet");
      }
    }
  }, []);

  const heightMap = {
    top: "h-24",
    sidebar: "h-96",
    bottom: "h-24",
    inline: "h-32",
  };

  const widthMap = {
    top: "w-full",
    sidebar: "w-full",
    bottom: "w-full",
    inline: "w-full",
  };

  return (
    <div
      id={`ad-${position}-${pageType || "general"}`}
      className={`bg-muted border border-border rounded-lg flex items-center justify-center text-muted-foreground text-center p-4 ${heightMap[position]} ${widthMap[position]} ${className}`}
    >
      {/* Google AdSense Ad Unit */}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot="xxxxxxxxxx"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* Fallback Text */}
      <span className="text-xs">إعلان - Google AdSense</span>
    </div>
  );
}
