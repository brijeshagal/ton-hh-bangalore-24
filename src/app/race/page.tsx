"use client";

import AutoRefresher from "@/components/refresher/AutoRefresher";
import TypeWriter from "@/components/typewriter";
import { VOL_DIVIDER } from "@/constants";
import { preRace } from "@/constants/comentary/prerace";
import Tokens from "@/junk/memecoins";
import { getVolumes } from "@/services/coingecko/volume";
import { TonConnectButton } from "@tonconnect/ui-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Horse from "/public/spirit-pixel.gif";
import Stadium1 from "/public/stadium1.jpg";

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
  const [poolVol, setPoolVol] = useState<Record<number, number>>();

  const [volumes, setVolumes] = useState(
    Object.values(Tokens).reduce((acc, contract) => {
      return { ...acc, [contract]: 0 };
    }, {})
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [texts, setTexts] = useState(preRace[Math.floor(Math.random() * 5)]);

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

  useEffect(() => {
    // volumeRefresher();
    setPoolVol(
      Object.values(Tokens).reduce((acc, _, idx) => {
        const mod = idx % 4;
        return {
          ...acc,
          [mod]: Number((Math.random() * 100 * VOL_DIVIDER).toFixed(2)),
        };
      }, {} as Record<number, number>)
    );
  }, []);

  console.log({ volumes });

  return (
    <div className="w-screen h-screen bg-black relative">
      <AutoRefresher
        timeInterval={120}
        disableQuotesRefresh={false}
        refreshQuotes={volumeRefresher}
        isLoading={isLoading}
      />
      <div className="w-full h-1/2 absolute">
        <img
          src={Stadium1.src}
          className="w-full h-3/4 bg-cover"
          alt={"stadium"}
        />
      </div>
      <div className="h-1/4 w-full text-white">
        <div className="max-w-[50% commentary-box">
          <TypeWriter autoStart loop texts={[texts]} />
        </div>
      </div>
      <div className="flex flex-col relative justify-center w-full h-1/2 gap-10">
        {poolVol &&
          Object.values(poolVol).map((avgPoolVolume, idx) => {
            const avgSpeed = (avgPoolVolume / VOL_DIVIDER).toFixed(2);
            return (
              <div
                key={idx}
                className={"relative transition-all duration-1000"}
                style={{
                  width: `${
                    Number(avgSpeed) < 85 ? Number(avgSpeed) + 15 : 90
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
      <TonConnectButton className="cursor-pointer" />
      <div className="relative h-1/4 flex w-full text-white items-center justify-between px-10">
        <div className="">
          <div>1</div>
        </div>
        <div className="">
          <div>2</div>
        </div>
        <div className="">
          <div>3</div>
        </div>
        <div className="">
          <div>4</div>
        </div>
      </div>
    </div>
  );
}
