interface MarketChartData {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

interface ContractVolumeData {
  [contract: string]: {
    marketData: MarketChartData | null;
    avgVolume: number | null;
  };
}

export async function getVolumes(
  contracts: string[]
): Promise<Record<string, number> | undefined> {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    const startTime = currentTime - 600; // Start time (10 minute ago)
    const endTime = currentTime; // End time (current time)

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": process.env.NEXT_PUBLIC_CG_API as string,
      },
    };

    // Build URLs dynamically for each contract
    const urls = contracts.map((contract) => {
      return `https://api.coingecko.com/api/v3/coins/ton/contract/${contract}/market_chart/range?vs_currency=usd&from=${startTime}&to=${endTime}&precision=6`;
    });

    const result: Record<string, number> = {};

    // Use Promise.allSettled to fetch all contracts without failing the entire operation
    const responses = await Promise.allSettled(
      urls.map(async (url, index) => {
        return fetch(url, options)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch data for URL: ${url}`);
            }
            return res.json();
          })
          .catch((error) => {
            // Handle individual contract errors
            console.error(
              `Error fetching data for contract ${contracts[index]}:`,
              error
            );
          });
      })
    );

    // Iterate over the responses and handle success and failure for each contract
    responses?.forEach((response, index) => {
      const contract = contracts[index];

      if (response.status === "fulfilled" && response.value.total_volumes) {
        // If the fetch was successful
        const marketData = response.value;
        const totalVolumes = marketData.total_volumes;

        // Calculate the average of total_volumes
        const avgVolume =
          totalVolumes.reduce(
            (acc: number, volume: number[]) => acc + volume[1],
            0
          ) / totalVolumes.length || 0;

        result[contract] = avgVolume;
      }
    });

    return result;
  } catch (e) {
    console.log({ e });
  }
}
