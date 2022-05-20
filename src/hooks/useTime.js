import * as React from "react";

export function useTime(shouldPause = false) {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    if (shouldPause) {
      return;
    }
    const timer = setInterval(() => {
      setTime(new Date());
    }, 200);
    return () => {
      clearInterval(timer);
    };
  }, [shouldPause]);

  return time;
}
