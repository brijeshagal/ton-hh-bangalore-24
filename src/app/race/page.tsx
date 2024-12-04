"use client";

import BidButton from "@/components/BidButton";
import AutoRefresher from "@/components/refresher/AutoRefresher";
import TypeWriter from "@/components/typewriter";
import { VOL_DIVIDER } from "@/constants";
import { preRace } from "@/constants/comentary/prerace";
import Tokens from "@/junk/memecoins";
import { getColor } from "@/lib/utils";
import { getVolumes } from "@/services/coingecko/volume";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Fence from "/public/fence.png";
import Horse from "/public/spirit-pixel.gif";
import Stadium1 from "/public/stadium1.jpg";

export default function Home() {
  const [tonConnectUI] = useTonConnectUI();
  const [selectPoolId, setSelectPoolId] = useState<number | undefined>();

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
    <div className="w-screen h-screen bg-black z-0 overflow-y-hidden">
      <AutoRefresher
        timeInterval={120}
        disableQuotesRefresh={false}
        refreshQuotes={volumeRefresher}
        isLoading={isLoading}
      />
      <div className="z-[40] flex justify-between px-2 items-center pt-4">
        <div className="text-white capitalize text-3xl">Coin Race</div>
        <TonConnectButton />
      </div>
      <div
        className="commentary-box w-[50%] !absolute top-32 z-[40]"
        style={{ left: `${Math.floor(Math.random() * (56 - 30 + 1)) + 30}%` }}
      >
        <TypeWriter autoStart loop texts={[texts]} />
      </div>
      <div className="w-full h-1/3 relative">
        <img src={Stadium1.src} className="w-full h-full" alt={"stadium"} />
      </div>

      <div className="flex flex-col relative justify-center w-full gap-1 bg-yellow-600 z-[40]">
        {poolVol &&
          Object.entries(poolVol).map(([idx, avgPoolVolume]) => {
            const avgSpeed = (avgPoolVolume / VOL_DIVIDER).toFixed(2);
            const numberIdx = Number(idx);
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectPoolId(numberIdx);
                }}
                className={"relative w-full"}
              >
                <div
                  className={
                    "absolute p-2 rounded top-[50%] right-0 text-white " +
                    getColor(numberIdx)
                  }
                >
                  {numberIdx + 1}
                </div>
                <div
                  className={"transition-all duration-100"}
                  style={{
                    width: `${
                      Number(avgSpeed) < 85 ? Number(avgSpeed) + 15 : 90
                    }%`,
                  }}
                >
                  <div className="w-fit h-fit ml-auto relative">
                    <div className="absolute animate-pulse p-1 text-nowrap text-sm font-thin -right-[20px] bg-white text-center align-middle border-dashed border-gray-200">
                      {avgSpeed} kmph
                    </div>
                    <Image
                      src={Horse}
                      className="w-20 h-20"
                      width={60}
                      height={60}
                      alt="racer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="relative flex w-full text-white items-center justify-between pb-5">
        <img
          src={Fence.src}
          className="absolute -top-16 left-0 h-[350px] object-fit z-0"
        />
        <div className="z-[40] mt-5 w-full h-full items-center flex justify-between px-10">
          <BidButton poolId={0} />
          <BidButton poolId={1} />
          <BidButton poolId={2} />
          <BidButton poolId={3} />
        </div>
      </div>
    </div>
  );
}
