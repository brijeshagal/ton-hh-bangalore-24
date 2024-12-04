import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getColor = (idx: number) => {
  switch (idx) {
    case 0: {
      return "bg-red-400";
    }
    case 1: {
      return "bg-yellow-400";
    }
    case 2: {
      return "bg-green-400";
    }
    case 3: {
      return "bg-blue-400";
    }
  }
};
