import { set } from 'zod';

const conversation = new Map<string, string>();

export const conversationRepository = {
   getPreviousResponseId: (conversationId: string) => {
      return conversation.get(conversationId);
   },
   setPreviousResponseId: (conversationId: string, responseId: string) => {
      conversation.set(conversationId, responseId);
   },
};
