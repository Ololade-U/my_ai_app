import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   message: string;
   type: 'user' | 'bot';
};

type message = {
   messages: Message[];
};

const ChatMessages = ({ messages }: message) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);
   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col gap-2">
         {messages?.map((message, index) => (
            <div
               key={index}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               onCopy={onCopyMessage}
               className={`px-2 py-1 max-w-md ${message.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'} rounded-lg `}
            >
               <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;
