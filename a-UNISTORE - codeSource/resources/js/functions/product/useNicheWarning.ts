import { useState, useEffect } from "react";

export const useNicheWarning = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const sessionDismissed = sessionStorage.getItem("niche_warning_dismissed");

    if (!sessionDismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const dismiss = (dontShowAgain = false) => {
    if (dontShowAgain) {
      sessionStorage.setItem("niche_warning_dismissed", "true");
    }
    setIsVisible(false);
    setIsDismissed(true);
  };

  return { isVisible, isDismissed, dismiss };
};
