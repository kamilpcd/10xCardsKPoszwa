import React from "react";

interface CharacterCounterProps {
  count: number;
}

export const CharacterCounter = ({ count }: CharacterCounterProps) => {
  const getCounterColor = (): string => {
    if (count === 0) return "text-gray-500";
    if (count < 1000) return "text-red-500";
    if (count > 10000) return "text-red-500";
    return "text-green-500";
  };

  return (
    <div className={`text-sm font-medium ${getCounterColor()}`}>
      {count} / 10000 znaków
      {count < 1000 && count > 0 && <span className="ml-2">(potrzeba jeszcze {1000 - count} znaków)</span>}
    </div>
  );
};
