import { useEffect, useRef, useState } from "react";

const AutoRefresher = ({
  refreshQuotes,
  isLoading,
  disableQuotesRefresh,
  timeInterval,
}: {
  refreshQuotes: () => Promise<void>;
  isLoading: boolean;
  disableQuotesRefresh: boolean;
  timeInterval: number;
}) => {
  const inactiveTimeRef = useRef<number | null>(null);
  const [timer, setTimer] = useState(timeInterval);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      //@dev: do not move this to constants
      if (
        !disableQuotesRefresh &&
        inactiveTimeRef.current &&
        inactiveTimeRef.current + timeInterval * 1000 < Date.now() // Assuming 30 seconds as refresh interval
      ) {
        setTimer(0);
      }
    } else {
      inactiveTimeRef.current = Date.now();
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange); //@dev: do not move this to constants

    let interval: NodeJS.Timeout;

    if (document.visibilityState === "visible" && !isLoading) {
      interval = setInterval(() => {
        setTimer((newTimer) => {
          return newTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange); //@dev: do not move this to constants
    };
  }, []);

  useEffect(() => {
    if (
      timer <= 0 &&
      !isLoading &&
      document.visibilityState === "visible" &&
      !disableQuotesRefresh
    ) {
      refreshQuotes().finally(() => setTimer(() => timeInterval));
    }
    if ((isLoading || disableQuotesRefresh) && timer !== timeInterval) {
      setTimer(timeInterval);
    }
  }, [timer, isLoading, refreshQuotes, disableQuotesRefresh]);

  return <></>;
};

export default AutoRefresher;
