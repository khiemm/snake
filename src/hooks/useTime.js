import * as React from 'react';

export function useTime(shoulddPause = false) {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    if (shoulddPause) {
      return;
    }
    const timer = setInterval(() => {
      setTime(new Date());
    }, 200);
    return () => {
      clearInterval(timer);
    }
  }, [shoulddPause]);

  return time;
}
