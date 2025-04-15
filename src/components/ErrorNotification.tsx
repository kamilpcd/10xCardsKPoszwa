import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorNotificationProps {
  message: string;
}

export const ErrorNotification = ({ message }: ErrorNotificationProps) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800">
      <svg
        className="h-5 w-5 text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <AlertTitle className="text-red-800 dark:text-red-300 ml-2">Błąd</AlertTitle>
      <AlertDescription className="text-red-700 dark:text-red-200 ml-2">{message}</AlertDescription>
    </Alert>
  );
};
