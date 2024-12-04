"use client";

import AutoRefresher from "@/components/refresher/AutoRefresher";
import { VOL_DIVIDER } from "@/constants";
import Tokens from "@/junk/memecoins";
import { getVolumes } from "@/services/coingecko/volume";
import Image from "next/image";
import { useState } from "react";
import Horse from "/public/spirit-pixel.gif";

export default function Home() {
  const [pools, setPools] = useState(
    Object.values(Tokens).reduce((acc, contract, idx) => {
      const mod = idx % 4;
      if (acc[mod]) {
        acc[mod] = [...acc[mod], contract];
      } else {
        acc[mod] = [contract];
      }
      return acc;
    }, {} as Record<number, string[]>)
  );
  const [poolVol, setPoolVol] = useState(
    Object.values(Tokens).reduce((acc, _, idx) => {
      const mod = idx % 4;
      return {
        ...acc,
        [mod]: Math.random() * 100 * VOL_DIVIDER,
      };
    }, {} as Record<number, number>)
  );
  console.log(poolVol);
  const [volumes, setVolumes] = useState(
    Object.values(Tokens).reduce((acc, contract) => {
      return { ...acc, [contract]: 0 };
    }, {})
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const volumeRefresher = async () => {
    setIsLoading(true);
    const contracts = Object.values(Tokens);
    setIsLoading(true);
    const data = await getVolumes(contracts);
    if (data) {
      const avgPoolVolumes: Record<number, number> = Object.values(
        Tokens
      ).reduce((acc, _, idx) => {
        const mod = idx % 4;
        return {
          ...acc,
          [mod]: 0,
        };
      }, {} as Record<number, number>);
      setVolumes((prev) => {
        const newVolumes: Record<string, number> = { ...prev, ...data };
        Object.entries(pools).forEach(([idx, contracts]) => {
          contracts.forEach((contract) => {
            const contractVolume = newVolumes[contract] || 0;
            avgPoolVolumes[Number(idx)] += contractVolume;
          });
        });
        return newVolumes;
      });
      setPoolVol(avgPoolVolumes);
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   volumeRefresher();
  // }, []);

  console.log({ volumes });

  return (
    <div className="w-screen h-screen bg-black">
      <AutoRefresher
        timeInterval={120}
        disableQuotesRefresh={false}
        refreshQuotes={volumeRefresher}
        isLoading={isLoading}
      />
      <div className="h-1/4"></div>
      <div className="flex flex-col relative w-full h-3/4 gap-10">
        {Object.values(poolVol).map((avgPoolVolume, idx) => {
          const avgSpeed = (avgPoolVolume / VOL_DIVIDER).toFixed(2);
          // const avgSpeed = avgPoolVolume.toFixed(2);
          return (
            <div
              key={idx}
              className={"relative transition-all duration-1000"}
              style={{
                width: `${
                  Number(avgSpeed) < 85 ? (Number(avgSpeed)) + 15 : 90
                }%`,
              }}
            >
              <div className="w-fit h-fit ml-auto">
                <div className="absolute p-1 text-nowrap -top-[24px] text-sm font-thin -right-[30px] bg-white text-center align-middle border-dashed border-gray-200">
                  {avgSpeed} kmph
                </div>
                <Image
                  src={Horse}
                  className="w-10 h-10"
                  width={20}
                  height={20}
                  alt="racer"
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* <Image
        src={Horse}
        className="w-10 h-10"
        width={20}
        height={20}
        alt="racer"
      /> */}
    </div>
  );
}
