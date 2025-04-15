import React from "react";
import type { ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput = ({ value, onChange }: TextInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const isTextTooShort = value.length > 0 && value.length < 1000;
  const isTextTooLong = value.length > 10000;
  const isTextValid = value.length >= 1000 && value.length <= 10000;

  return (
    <div className="space-y-2">
      <label htmlFor="source-text" className="text-sm font-medium">
        Tekst źródłowy
      </label>
      <Textarea
        id="source-text"
        placeholder="Wprowadź tekst, minimum 1000 znaków, maksimum 10000 znaków"
        className={`min-h-[200px] ${
          isTextTooShort || isTextTooLong ? "border-red-400" : isTextValid ? "border-green-400" : ""
        }`}
        value={value}
        onChange={handleChange}
      />
      {isTextTooShort && <p className="text-sm text-red-500">Tekst musi zawierać co najmniej 1000 znaków.</p>}
      {isTextTooLong && <p className="text-sm text-red-500">Tekst nie może przekraczać 10000 znaków.</p>}
    </div>
  );
};
