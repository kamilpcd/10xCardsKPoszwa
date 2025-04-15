import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { type FlashcardProposalViewModel } from "./FlashcardGenerateView";
import { ErrorNotification } from "./ErrorNotification";
import type { CreateFlashcardAIDTO, CreateFlashcardsDTO } from "../types";

interface BulkSaveButtonProps {
  flashcards: FlashcardProposalViewModel[];
  generationId: number;
  disabled: boolean;
  onSaveComplete?: () => void;
}

export const BulkSaveButton = ({ flashcards, generationId, disabled, onSaveComplete }: BulkSaveButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async (onlyAccepted: boolean) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // Filtruj fiszki w zależności od parametru onlyAccepted
      const flashcardsToSave = onlyAccepted ? flashcards.filter((f) => f.accepted) : flashcards;

      // Przygotuj dane do zapisania
      const flashcardsData: CreateFlashcardAIDTO[] = flashcardsToSave.map((flashcard) => ({
        front: flashcard.front,
        back: flashcard.back,
        source: flashcard.edited ? "ai-edited" : "ai-full",
        generation_id: generationId,
      }));

      const payload: CreateFlashcardsDTO = {
        flashcards: flashcardsData,
      };

      // Wyślij żądanie do API
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Wystąpił błąd podczas zapisywania fiszek");
      }

      setIsSaved(true);

      // Po 1.5 sekundy wywołaj onSaveComplete, aby zresetować widok
      if (onSaveComplete) {
        setTimeout(() => {
          onSaveComplete();
        }, 1500);
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Wystąpił nieznany błąd");
    } finally {
      setIsSaving(false);
    }
  };

  const saveButtonClass = "min-w-[180px]";

  if (isSaved) {
    return (
      <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Fiszki zostały pomyślnie zapisane!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-4">Zapisz fiszki</h3>

      {saveError && <ErrorNotification message={saveError} />}

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button
          onClick={() => handleSave(true)}
          disabled={disabled || isSaving || flashcards.filter((f) => f.accepted).length === 0}
          className={`bg-blue-600 hover:bg-blue-700 ${saveButtonClass}`}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Zapisywanie...
            </span>
          ) : (
            `Zapisz zaakceptowane (${flashcards.filter((f) => f.accepted).length})`
          )}
        </Button>

        <Button
          onClick={() => handleSave(false)}
          disabled={disabled || isSaving || flashcards.length === 0}
          variant="outline"
          className={`border-blue-500 text-blue-500 ${saveButtonClass}`}
        >
          {isSaving ? "Zapisywanie..." : `Zapisz wszystkie (${flashcards.length})`}
        </Button>
      </div>
    </div>
  );
};
