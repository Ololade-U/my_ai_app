import { FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type FormData = {
   prompt: string;
};

type Message = {
   message: string;
   type: 'user' | 'bot';
};

const Chatbot = () => {
   const chatId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const [isBotTyping, setBotTyping] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { message: prompt, type: 'user' }]);
      setBotTyping(true);
      reset();
      const { data } = await axios.post('/api/chat', {
         prompt,
         conversationId: chatId.current,
      });
      setMessages((prev) => [...prev, { message: data.message, type: 'bot' }]);
      setBotTyping(false);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-2 mb-8">
            {messages?.map((message, index) => (
               <p
                  key={index}
                  className={`px-2 py-1 ${message.type === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'} rounded-lg `}
               >
                  <ReactMarkdown>{message.message}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className="flex self-start gap-1 p-3 bg-gray-200 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:.4s]"></div>
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything"
               maxLength={1000}
            ></textarea>
            <Button
               disabled={!formState.isValid}
               type="submit"
               className={'rounded-full w-9 h-9'}
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default Chatbot;
