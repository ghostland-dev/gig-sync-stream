
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
        return "border-fiverr-primary text-fiverr-primary";
      case "upwork":
        return "border-upwork-primary text-upwork-primary";
      case "malt":
        return "border-malt-primary text-malt-primary";
      case "codeur":
        return "border-codeur-primary text-codeur-primary";
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
