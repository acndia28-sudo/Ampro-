import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini client to prevent startup crashes if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please check your Secrets in the settings panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Ensure proper error handling wrapper
const asyncHandler = (fn: any) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// API Route: AI Football Assistant / Chatbot
app.post("/api/chat", asyncHandler(async (req: express.Request, res: express.Response) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  try {
    const ai = getGeminiClient();
    
    // Format chat history for Gemini API
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: "You are 'Tactico', an ultra-knowledgeable, passionate, and witty football pundit and tactician. You have deep knowledge of football tactics, histories, players, transfer markets, leagues (Premier League, La Liga, Serie A, Champions League, etc.), and recent events. Answer questions with insight, tactical depth, and fun analogies, but keep responses relatively concise and punchy.",
      },
    });

    const reply = response.text || "Sorry, I couldn't formulate a response right now.";
    res.json({ content: reply });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Assistant." });
  }
}));

// API Route: Match analysis generator
app.post("/api/match/analyze", asyncHandler(async (req: express.Request, res: express.Response) => {
  const { homeTeam, awayTeam, score, events, stats } = req.body;

  if (!homeTeam || !awayTeam) {
    return res.status(400).json({ error: "Home and Away teams are required" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Perform a professional, tactical, and entertaining post-match analysis for this match:
    Match: ${homeTeam} vs ${awayTeam}
    Fulltime Score: ${score}
    Key Events: ${JSON.stringify(events)}
    Match Statistics: ${JSON.stringify(stats)}

    Structure the response into:
    1. "Tactical Breakdown" (How both teams setup, key tactical shifts)
    2. "Turning Point" (What specific event or tactical change decided the match)
    3. "Standout Performer" (Highlight who excelled and why)
    4. "Manager's Verdict" (What the managers did right or wrong)
    
    Keep the analysis sharp, professional (like Michael Cox or Jonathan Wilson), and insightful. Use bullet points or short paragraphs.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/match/analyze:", error);
    res.status(500).json({ error: error.message || "Failed to generate match analysis." });
  }
}));

// API Route: Transfer rumor evaluator
app.post("/api/rumor/analyze", asyncHandler(async (req: express.Request, res: express.Response) => {
  const { player, currentClub, targetClub, sourceValue, description } = req.body;

  if (!player || !targetClub) {
    return res.status(400).json({ error: "Player name and target club are required" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Analyze this football transfer rumor:
    Player Name: ${player}
    Current Club: ${currentClub || "Unknown"}
    Target Club: ${targetClub}
    Reported Source/Value: ${sourceValue || "General press"}
    Rumor Details: ${description || ""}

    Please provide:
    1. "Likelihood Score" (percentage between 0% and 100% and briefly why)
    2. "Squad Fit" (how the player fits into ${targetClub}'s tactical system, whose spot they might take)
    3. "Financial Verdict" (whether the reported fee makes sense)
    4. "Verdict Summary" (Hot, Warm, or Cold rumor rating)
    
    Format the response nicely in standard Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/rumor/analyze:", error);
    res.status(500).json({ error: error.message || "Failed to evaluate transfer rumor." });
  }
}));

// API Route: News summarizer
app.post("/api/news/summarize", asyncHandler(async (req: express.Request, res: express.Response) => {
  const { title, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "News content is required for summarization" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Summarize the following football news article concisely. 
    Title: "${title || "Football News Update"}"
    Content: "${content}"

    Provide:
    - A 2-sentence executive summary.
    - 3 key takeaways (bullet points) containing the main developments.
    - What this means for the teams involved (squad impact, morale, table standings, etc.) in 1 quick paragraph.
    
    Make it highly readable and professionally summarized.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/news/summarize:", error);
    res.status(500).json({ error: error.message || "Failed to summarize news." });
  }
}));

// Initialize Vite and setup routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled express error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
