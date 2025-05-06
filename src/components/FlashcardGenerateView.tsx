import React, { useState } from "react";
import { TextInput } from "./TextInput";
import { CharacterCounter } from "./CharacterCounter";
import { GenerateButton } from "./GenerateButton";
import { SkeletonLoader } from "./SkeletonLoader";
import { FlashcardProposalsList } from "./FlashcardProposalsList";
import { BulkSaveButton } from "./BulkSaveButton";
import { ErrorNotification } from "./ErrorNotification";
import { type CreateGenerationCommandDTO, type GenerationResponseDTO, type FlashcardProposalDTO } from "../types";

export interface FlashcardProposalViewModel extends FlashcardProposalDTO {
  accepted: boolean;
  edited: boolean;
}

const FlashcardGenerateView = () => {
  const [textValue, setTextValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardProposalViewModel[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);

  const handleTextChange = (value: string) => {
    setTextValue(value);
    setErrorMessage(null);
  };

  const validateText = (): boolean => {
    if (textValue.length < 1000) {
      setErrorMessage("Tekst jest zbyt krótki. Wymagane minimum 1000 znaków.");
      return false;
    }
    if (textValue.length > 10000) {
      setErrorMessage("Tekst jest zbyt długi. Maksimum to 10000 znaków.");
      return false;
    }
    return true;
  };

  const handleGenerateFlashcards = async () => {
    if (!validateText()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_text: textValue } as CreateGenerationCommandDTO),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Wystąpił błąd podczas generowania fiszek");
      }

      const data = (await response.json()) as GenerationResponseDTO;

      // Rozszerzenie propozycji o pola accepted i edited
      const flashcardsWithState = data.flashcards_proposals.map(
        (flashcard): FlashcardProposalViewModel => ({
          ...flashcard,
          accepted: false,
          edited: false,
        })
      );

      setFlashcards(flashcardsWithState);
      setGenerationId(data.generation_id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Wystąpił nieznany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptFlashcard = (index: number) => {
    setFlashcards((prevFlashcards) => {
      const updatedFlashcards = [...prevFlashcards];
      updatedFlashcards[index] = {
        ...updatedFlashcards[index],
        accepted: !updatedFlashcards[index].accepted,
      };
      return updatedFlashcards;
    });
  };

  const handleEditFlashcard = (index: number, front: string, back: string) => {
    setFlashcards((prevFlashcards) => {
      const updatedFlashcards = [...prevFlashcards];
      updatedFlashcards[index] = {
        ...updatedFlashcards[index],
        front,
        back,
        edited: true,
        accepted: true, // Automatycznie akceptujemy edytowaną fiszkę
      };
      return updatedFlashcards;
    });
  };

  const handleRejectFlashcard = (index: number) => {
    setFlashcards((prevFlashcards) => prevFlashcards.filter((_, i) => i !== index));
  };

  const resetState = () => {
    setFlashcards([]);
    setGenerationId(null);
    setTextValue("");
    setIsLoading(false);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <TextInput value={textValue} onChange={handleTextChange} />
        <div className="flex justify-between items-center mt-4">
          <CharacterCounter count={textValue.length} />
          <GenerateButton
            onClick={handleGenerateFlashcards}
            disabled={isLoading || textValue.length < 1000 || textValue.length > 10000}
            isLoading={isLoading}
          />
        </div>
      </div>

      {errorMessage && <ErrorNotification message={errorMessage} />}

      {isLoading && <SkeletonLoader />}

      {!isLoading && flashcards.length > 0 && (
        <>
          <FlashcardProposalsList
            flashcards={flashcards}
            onAccept={handleAcceptFlashcard}
            onEdit={handleEditFlashcard}
            onReject={handleRejectFlashcard}
          />

          <BulkSaveButton
            generationId={generationId ?? 0}
            flashcards={flashcards}
            disabled={flashcards.length === 0 || generationId === null}
            onSaveComplete={resetState}
          />
        </>
      )}
    </div>
  );
};

export default FlashcardGenerateView;
