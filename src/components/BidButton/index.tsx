import { getColor } from "@/lib/utils";

const BidButton = ({ poolId }: { poolId: number }) => {
  return (
    <button className={"p-3 animate-bounce " + getColor(poolId)}>
      <div>{poolId + 1}</div>
    </button>
  );
};

export default BidButton;
