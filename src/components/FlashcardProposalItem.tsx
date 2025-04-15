import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { type FlashcardProposalViewModel } from "./FlashcardGenerateView";

interface FlashcardProposalItemProps {
  flashcard: FlashcardProposalViewModel;
  index: number;
  onAccept: (index: number) => void;
  onEdit: (index: number, front: string, back: string) => void;
  onReject: (index: number) => void;
}

export const FlashcardProposalItem = ({ flashcard, index, onAccept, onEdit, onReject }: FlashcardProposalItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFront, setEditedFront] = useState(flashcard.front);
  const [editedBack, setEditedBack] = useState(flashcard.back);
  const [frontError, setFrontError] = useState("");
  const [backError, setBackError] = useState("");

  useEffect(() => {
    setEditedFront(flashcard.front);
    setEditedBack(flashcard.back);
  }, [flashcard]);

  const validateEdit = (): boolean => {
    let isValid = true;

    if (editedFront.length === 0) {
      setFrontError("Przód fiszki nie może być pusty");
      isValid = false;
    } else if (editedFront.length > 200) {
      setFrontError(`Przód fiszki jest za długi (${editedFront.length}/200)`);
      isValid = false;
    } else {
      setFrontError("");
    }

    if (editedBack.length === 0) {
      setBackError("Tył fiszki nie może być pusty");
      isValid = false;
    } else if (editedBack.length > 500) {
      setBackError(`Tył fiszki jest za długi (${editedBack.length}/500)`);
      isValid = false;
    } else {
      setBackError("");
    }

    return isValid;
  };

  const handleSaveEdit = () => {
    if (validateEdit()) {
      onEdit(index, editedFront, editedBack);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedFront(flashcard.front);
    setEditedBack(flashcard.back);
    setFrontError("");
    setBackError("");
    setIsEditing(false);
  };

  const renderViewMode = () => (
    <>
      <CardHeader className="pb-2 pt-4 px-4 h-[120px]">
        <div className="flex flex-col h-full">
          <div className="flex justify-end items-center h-8 mb-1">
            <div className="flex space-x-2 shrink-0">
              {flashcard.accepted && <Badge className="bg-green-500">Zaakceptowana</Badge>}
              {flashcard.edited && <Badge className="bg-blue-500">Edytowana</Badge>}
            </div>
          </div>
          <div className="font-medium text-base flex-grow overflow-y-auto max-h-[70px] pb-6 break-words whitespace-normal">
            {flashcard.front}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-2 px-4 h-[160px]">
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-1 h-full">
          <p className="text-gray-700 dark:text-gray-300 text-sm max-h-[120px] overflow-y-auto break-words whitespace-normal">
            {flashcard.back}
          </p>
        </div>
      </CardContent>
    </>
  );

  const renderEditMode = () => (
    <>
      <CardHeader className="pb-2 pt-4 px-4 h-[150px]">
        <div className="space-y-2">
          <div className="font-medium text-sm">Przód fiszki (max. 200 znaków)</div>
          <Textarea
            value={editedFront}
            onChange={(e) => setEditedFront(e.target.value)}
            className={`${frontError ? "border-red-500" : ""} h-[80px] overflow-y-auto resize-none mb-4 whitespace-normal break-words`}
            placeholder="Wprowadź przód fiszki"
          />
          {frontError && <p className="text-red-500 text-xs">{frontError}</p>}
          <div className="text-xs text-right text-gray-500">{editedFront.length}/200 znaków</div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-2 px-4 h-[220px]">
        <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6 mt-1">
          <div className="font-medium text-sm">Tył fiszki (max. 500 znaków)</div>
          <Textarea
            value={editedBack}
            onChange={(e) => setEditedBack(e.target.value)}
            className={`${backError ? "border-red-500" : ""} h-[120px] overflow-y-auto resize-none whitespace-normal break-words`}
            placeholder="Wprowadź tył fiszki"
          />
          {backError && <p className="text-red-500 text-xs">{backError}</p>}
          <div className="text-xs text-right text-gray-500">{editedBack.length}/500 znaków</div>
        </div>
      </CardContent>
    </>
  );

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md flex flex-col h-[420px]">
      <div className="flex-grow overflow-auto">{isEditing ? renderEditMode() : renderViewMode()}</div>
      <CardFooter className="flex justify-end space-x-2 pt-2 pb-4 px-4 mt-auto border-t border-gray-200 dark:border-gray-700">
        {isEditing ? (
          <>
            <Button
              variant="default"
              onClick={handleSaveEdit}
              className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 h-auto"
            >
              Zapisz zmiany
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="border-gray-500 text-gray-500 text-xs px-3 py-1 h-auto"
            >
              Anuluj
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={flashcard.accepted ? "outline" : "default"}
              onClick={() => onAccept(index)}
              className={`${
                flashcard.accepted ? "border-green-500 text-green-500" : "bg-green-600 hover:bg-green-700"
              } text-xs px-2 py-1 h-auto`}
            >
              {flashcard.accepted ? "Cofnij akceptację" : "Zatwierdź"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-blue-500 text-blue-500 text-xs px-2 py-1 h-auto"
            >
              Edytuj
            </Button>
            <Button
              variant="outline"
              onClick={() => onReject(index)}
              className="border-red-500 text-red-500 text-xs px-2 py-1 h-auto"
            >
              Odrzuć
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
