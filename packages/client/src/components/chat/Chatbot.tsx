import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;
const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

const Chatbot = () => {
   const chatId = useRef(crypto.randomUUID());
   const [isBotTyping, setBotTyping] = useState(false);
   const [error, setError] = useState('');
   const [messages, setMessages] = useState<Message[]>([]);

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setMessages((prev) => [...prev, { message: prompt, type: 'user' }]);
         setBotTyping(true);
         setError('');
         popAudio.play();

         const { data } = await axios.post('/api/chat', {
            prompt,
            conversationId: chatId.current,
         });
         setMessages((prev) => [
            ...prev,
            { message: data.message, type: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.error(error);
         setError('Something went wrong. Please try again.');
      } finally {
         setBotTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-2 mb-8 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {<div className="text-red-500">{error}</div>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default Chatbot;
