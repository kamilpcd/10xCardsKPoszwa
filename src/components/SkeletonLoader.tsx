import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonLoader = () => {
  // Tworzymy trzy zaślepki kart fiszek
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Generowanie fiszek...</div>

      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="w-full">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="w-full">
              <Skeleton className="h-5 w-2/3 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
