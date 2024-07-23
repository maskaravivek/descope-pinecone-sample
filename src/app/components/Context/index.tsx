import React, { ChangeEvent, useEffect, useState } from "react";
import UrlButton from "./UrlButton";
import { Card, ICard } from "./Card";
import { clearIndex, crawlDocument, getRelations } from "./utils";

import { Button } from "./Button";
import { useUser } from "@descope/nextjs-sdk/client";
interface ContextProps {
  className: string;
  selected: string[] | null;
}

export const Context: React.FC<ContextProps> = ({ className, selected }) => {
  const [entries, setEntries] = useState([]);
  const [cards, setCards] = useState<ICard[]>([]);

  const { user, isUserLoading } = useUser();
  const [documentUrl, setDocumentUrl] = useState("");

  const [splittingMethod, setSplittingMethod] = useState("markdown");
  const [chunkSize, setChunkSize] = useState(256);
  const [overlap, setOverlap] = useState(1);

  // Scroll to selected card
  useEffect(() => {
    const element = selected && document.getElementById(selected[0]);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  useEffect(() => {
    fetchRelations();
  }, [user, isUserLoading]);

  const fetchRelations = async () => {
    if (user && !isUserLoading) {
      const relations = await getRelations(user.userId);

      if (relations) {
        const urls = relations.data.filter((relation: any) => relation.resource && relation.resource.startsWith("http"))
          .map((relation: any) => ({
            url: relation.resource,
            title: relation.resource,
            seeded: false,
            loading: false,
          }));

        setEntries(urls);
      }
    }
  }

  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-white p-2 font-bold">
      {children}
    </label>
  );

  const buttons = entries.map((entry, key) => (
    <div className="" key={`${key}-${entry.loading}`}>
      <UrlButton
        entry={entry}
        onClick={() =>
          crawlDocument(
            entry.url,
            user?.userId || "",
            setEntries,
            setCards,
            splittingMethod,
            chunkSize,
            overlap
          )
        }
      />
    </div>
  ));

  return (
    <div
      className={`flex flex-col border-2 overflow-y-auto rounded-lg border-gray-500 w-full ${className}`}
    >
      <div className="flex flex-wrap w-full">{buttons}</div>

      <div className="flex flex-col items-start sticky top-0 w-full">
        <div className="text-left w-full flex flex-col rounded-b-lg bg-gray-600 p-3 subpixel-antialiased">
          <DropdownLabel htmlFor="splittingMethod">
            Splitting Method:
          </DropdownLabel>
          <div className="relative w-full">
            <select
              id="splittingMethod"
              value={splittingMethod}
              className="p-2 bg-gray-700 rounded text-white w-full appearance-none hover:cursor-pointer"
              onChange={(e) => setSplittingMethod(e.target.value)}
            >
              <option value="recursive">Recursive Text Splitting</option>
              <option value="markdown">Markdown Splitting</option>
            </select>
          </div>
          {splittingMethod === "recursive" && (
            <div className="my-4 flex flex-col">
              <div className="flex flex-col w-full">
                <DropdownLabel htmlFor="chunkSize">
                  Chunk Size: {chunkSize}
                </DropdownLabel>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="chunkSize"
                  min={1}
                  max={2048}
                  onChange={(e) => setChunkSize(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col w-full">
                <DropdownLabel htmlFor="overlap">
                  Overlap: {overlap}
                </DropdownLabel>
                <input
                  className="p-2 bg-gray-700"
                  type="range"
                  id="overlap"
                  min={1}
                  max={200}
                  onChange={(e) => setOverlap(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          <DropdownLabel htmlFor="documentUrl">Document URL:</DropdownLabel>

          <input
            className="p-2 bg-gray-700 w-full"
            type="text"
            placeholder="https://example.com"
            value={documentUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDocumentUrl(e.target.value)
            }
          />
          <Button
            className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
            style={{
              backgroundColor: "#4f6574",
              color: "white",
            }}
            onClick={() =>
              crawlDocument(
                documentUrl,
                user?.userId || "",
                setEntries,
                setCards,
                splittingMethod,
                chunkSize,
                overlap
              )
            }
          >
            Index Document
          </Button>
          <Button
            className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
            style={{
              backgroundColor: "#4f6574",
              color: "white",
            }}
            onClick={() => clearIndex(setEntries, setCards)}
          >
            Clear Index
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        {cards &&
          cards.map((card, key) => (
            <Card key={key} card={card} selected={selected} />
          ))}
      </div>
    </div>
  );
};
