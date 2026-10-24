import { localApiOnly } from './local-api-guard.mjs';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
app.use('/api', localApiOnly(() => PORT));
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/brand-bible', async (req, res) => {
    try {
      const { mission } = req.body;
      if (!mission) {
        return res.status(400).json({ error: 'Mission statement is required.' });
      }

      // Generate palette and typography
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `You are an expert brand designer. Based on this company mission: "${mission}", generate a comprehensive brand identity including a 5-color palette (with hex codes and usage notes), suggested Google Font pairings for headers and body text, and some secondary marks ideas.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              palette: {
                type: Type.ARRAY,
                description: 'A 5-color palette.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING, description: 'Hex code (e.g., #FFFFFF)' },
                    name: { type: Type.STRING, description: 'Color name' },
                    usage: { type: Type.STRING, description: 'Usage notes for this color' },
                  },
                  required: ['hex', 'name', 'usage'],
                },
              },
              fonts: {
                type: Type.OBJECT,
                properties: {
                  header: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: 'Google Font name' },
                      reason: { type: Type.STRING, description: 'Why this font works' },
                    },
                    required: ['name', 'reason'],
                  },
                  body: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: 'Google Font name' },
                      reason: { type: Type.STRING, description: 'Why this font works' },
                    },
                    required: ['name', 'reason'],
                  },
                },
                required: ['header', 'body'],
              },
              secondaryMarks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Ideas for secondary brand marks or icon treatments (e.g., "A simplified monogram").',
              },
            },
            required: ['palette', 'fonts', 'secondaryMarks'],
          },
        },
      });

      const brandData = JSON.parse(response.text || '{}');
      res.json(brandData);
    } catch (error) {
      console.error('Error generating brand data:', error);
      res.status(500).json({ error: 'Failed to generate brand identity.' });
    }
  });

  app.post('/api/generate-logo', async (req, res) => {
    try {
      const { mission, imageSize } = req.body;
      if (!mission) {
        return res.status(400).json({ error: 'Mission is required.' });
      }
      
      const size = imageSize || '1K';
      if (!['1K', '2K', '4K'].includes(size)) {
        return res.status(400).json({ error: 'Invalid size.' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [
            { text: `A clean, professional vector-style primary logo for a company with this mission: "${mission}". Solid white background, minimal and modern logo design.` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
            imageSize: size as "1K" | "2K" | "4K"
          }
        }
      });

      let logoUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          logoUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!logoUrl) {
        throw new Error('No image generated.');
      }

      res.json({ logoUrl });
    } catch (error) {
      console.error('Error generating logo:', error);
      res.status(500).json({ error: 'Failed to generate logo.' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, model } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      // Extract system instructions if needed, or just append it to the first user message.
      const selectedModel = model || 'gemini-3.1-pro-preview';
      
      // We will implement simple streaming response
      const response = await ai.models.generateContentStream({
        model: selectedModel,
        contents: messages,
        config: {
          systemInstruction: 'You are an expert brand strategist and designer chatbot. Assist the user with their brand identity questions.',
        },
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of response) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error('Error in chat:', error);
      res.status(500).json({ error: 'Failed to handle chat.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
