import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.services';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, { message: 'Prompt cannot be empty' })
      .max(1000, { message: 'Prompt cannot exceed 1000 characters' }),
   conversationId: z.uuid(),
});

export const chatController = {
   sendMessage: async (req: Request, res: Response) => {
      const validationResult = chatSchema.safeParse(req.body);
      if (!validationResult.success) {
         res.status(400).json({ error: validationResult.error.format() });
         return;
      }

      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);
         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({
            error: 'An error occurred while processing your request.',
         });
      }
   },
};
