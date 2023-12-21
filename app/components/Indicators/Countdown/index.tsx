import React, { useState, useEffect, useCallback } from "react";
import { ClientOnly } from "~/components/Client/ClientOnly";

type Props = {
  targetDate: Date;
  tickerBackgroundColor?: string;
  tickerTextColor?: string;
};

const CountDown = ({
  targetDate,
  tickerBackgroundColor,
  tickerTextColor,
}: Props) => {
  const calculateTimeRemaining = useCallback(() => {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }, [targetDate]);

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, calculateTimeRemaining]);

  const constructTimeAttribute = (number: number): React.CSSProperties => {
    return { "--value": number } as React.CSSProperties;
  };

  const tickerBgColor = tickerBackgroundColor || "bg-brand-black/75";
  const tickerTxtColor = tickerTextColor || "text-brand-white";

  return (
    <ClientOnly
      fallback={
        <div className="flex select-none items-center gap-1 text-center">
          <div className="skeleton h-[32px] w-[42px] !rounded-sm"></div>
          <div className="skeleton h-[32px] w-[42px] !rounded-sm"></div>
          <div className="skeleton h-[32px] w-[42px] !rounded-sm"></div>
          <div className="skeleton h-[32px] w-[42px] !rounded-sm"></div>
        </div>
      }
    >
      {() => (
        <>
          <div className="flex select-none items-center gap-1 text-center">
            <div
              className={`flex items-center gap-1 rounded-sm p-2 ${tickerBgColor} ${tickerTxtColor}`}
            >
              <span className="font-mono countdown">
                <span style={constructTimeAttribute(timeRemaining.days)}>
                  {timeRemaining.days}
                </span>
              </span>
              <span className="text-xs">D</span>
            </div>
            <div
              className={`flex items-center gap-1 rounded-sm p-2 ${tickerBgColor} ${tickerTxtColor}`}
            >
              <span className="font-mono countdown">
                <span style={constructTimeAttribute(timeRemaining.hours)}>
                  {timeRemaining.hours}
                </span>
              </span>
              <span className="text-xs">H</span>
            </div>
            <div
              className={`flex items-center gap-1 rounded-sm p-2 ${tickerBgColor} ${tickerTxtColor}`}
            >
              <span className="font-mono countdown">
                <span style={constructTimeAttribute(timeRemaining.minutes)}>
                  {timeRemaining.minutes}
                </span>
              </span>
              <span className="text-xs">M</span>
            </div>
            <div
              className={`flex items-center gap-1 rounded-sm p-2 ${tickerBgColor} ${tickerTxtColor}`}
            >
              <span className="font-mono countdown">
                <span style={constructTimeAttribute(timeRemaining.seconds)}>
                  {timeRemaining.seconds}
                </span>
              </span>
              <span className="text-xs">S</span>
            </div>
          </div>
        </>
      )}
    </ClientOnly>
  );
};

export default CountDown;
