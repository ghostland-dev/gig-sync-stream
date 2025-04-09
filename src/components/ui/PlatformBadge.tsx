
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type PlatformType = "fiverr" | "upwork" | "malt" | "codeur";

interface PlatformBadgeProps {
  platform: PlatformType;
  className?: string;
}

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({ platform, className }) => {
  const getPlatformClasses = () => {
    switch (platform) {
      case "fiverr":
        return "platform-fiverr";
      case "upwork":
        return "platform-upwork";
      case "malt":
        return "platform-malt";
      case "codeur":
        return "platform-codeur";
      default:
        return "";
    }
  };

  const getPlatformLabel = () => {
    switch (platform) {
      case "fiverr":
        return "Fiverr";
      case "upwork":
        return "Upwork";
      case "malt":
        return "Malt";
      case "codeur":
        return "Codeur.fr";
      default:
        return "";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-normal border", getPlatformClasses(), className)}
    >
      {getPlatformLabel()}
    </Badge>
  );
};
