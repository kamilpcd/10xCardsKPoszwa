import React from "react";
import { FlashcardProposalItem } from "./FlashcardProposalItem";
import { type FlashcardProposalViewModel } from "./FlashcardGenerateView";

interface FlashcardProposalsListProps {
  flashcards: FlashcardProposalViewModel[];
  onAccept: (index: number) => void;
  onEdit: (index: number, front: string, back: string) => void;
  onReject: (index: number) => void;
}

export const FlashcardProposalsList = ({ flashcards, onAccept, onEdit, onReject }: FlashcardProposalsListProps) => {
  if (!flashcards.length) {
    return null;
  }

  const acceptedCount = flashcards.filter((card) => card.accepted).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Wygenerowane propozycje fiszek</h2>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Zaakceptowano: {acceptedCount}/{flashcards.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((flashcard, index) => (
          <FlashcardProposalItem
            key={index}
            flashcard={flashcard}
            index={index}
            onAccept={onAccept}
            onEdit={onEdit}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
};
