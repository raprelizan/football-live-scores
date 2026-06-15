import { useEffect } from "react";

interface StructuredDataProps {
  type: "Organization" | "SportsEvent" | "BreadcrumbList";
  data: Record<string, any>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    
    let jsonLd: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": type,
    };

    if (type === "Organization") {
      jsonLd = {
        ...jsonLd,
        name: data.name || "كورة لايف",
        description: data.description || "موقع متابعة مباريات كرة القدم المباشرة",
        url: data.url || "https://footballlive.app",
        logo: data.logo || "https://footballlive.app/logo.png",
        sameAs: [
          "https://www.facebook.com/footballlive",
          "https://twitter.com/footballlive",
        ],
      };
    } else if (type === "SportsEvent") {
      jsonLd = {
        ...jsonLd,
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        eventStatus: data.eventStatus || "EventScheduled",
        location: {
          "@type": "Place",
          name: data.location || "Stadium",
        },
        competitor: data.competitors || [],
      };
    } else if (type === "BreadcrumbList") {
      jsonLd = {
        ...jsonLd,
        itemListElement: data.items?.map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })) || [],
      };
    }

    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
}
