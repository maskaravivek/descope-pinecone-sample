// page.tsx

"use client";

import React, { useEffect, useRef, useState, FormEvent, useCallback } from "react";
import { Context } from "@/components/Context";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
import { useChat } from "ai/react";
import InstructionModal from "./components/InstructionModal";
import { AiFillGithub, AiOutlineInfoCircle } from "react-icons/ai";
import { Descope } from '@descope/nextjs-sdk';
import { useDescope, useSession, useUser } from '@descope/nextjs-sdk/client';

const Page: React.FC = () => {
  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async () => {
      setGotMessages(true);
    },
  });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch("/api/context", {
        method: "POST",
        body: JSON.stringify({
          messages,
        }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };
    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

  const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  // useUser retrieves the logged in user information
  const { user, isUserLoading } = useUser();
  // useDescope retrieves Descope SDK for further operations related to authentication
  // such as logout
  const sdk = useDescope();

  if (isSessionLoading || isUserLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Descope
        flowId="sign-up-or-in"
        onSuccess={(e) => console.log('Logged in!')}
        onError={(e) => console.log('Could not logged in!')}
        redirectAfterSuccess="/"
      // redirectAfterError="/error-page"
      />
    );
  }

  return (
    <div className="flex flex-col justify-between h-screen bg-gray-800 p-2 mx-auto max-w-full">
      <Header className="my-5" />
      <div className="flex w-full flex-grow overflow-hidden relative">
        <Chat
          input={input}
          handleInputChange={handleInputChange}
          handleMessageSubmit={handleMessageSubmit}
          messages={messages}
        />
        <div className="absolute transform translate-x-full transition-transform duration-500 ease-in-out right-0 w-2/3 h-full bg-gray-700 overflow-y-auto lg:static lg:translate-x-0 lg:w-2/5 lg:mx-2 rounded-lg">
          <Context className="" selected={context} />
        </div>
        <button
          type="button"
          className="absolute left-20 transform -translate-x-12 bg-gray-800 text-white rounded-l py-2 px-4 lg:hidden"
          onClick={(e) => {
            e.currentTarget.parentElement
              ?.querySelector(".transform")
              ?.classList.toggle("translate-x-full");
          }}
        >
          ☰
        </button>
      </div>
    </div>
  );
};

export default Page;
