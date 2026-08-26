import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily for AI Chemistry Tutor
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Bangla 3D Virtual Chemistry Lab" });
});

// AI Chemistry Tutor Endpoint
app.post("/api/gemini/tutor", async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "প্রশ্ন প্রদান করা আবশ্যক" });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      // Return helpful offline response if no API key
      res.json({
        answer: generateFallbackResponse(question, context),
        source: "offline_engine",
      });
      return;
    }

    const systemInstruction = `তুমি একজন অত্যন্ত অভিজ্ঞ, বন্ধুত্বপূর্ণ এবং বিজ্ঞ বাংলাদেশ NCTB রসায়ন (Chemistry) শিক্ষক।
তোমার প্রধান লক্ষ্য শিক্ষার্থীদের রসায়ন সহজে, নির্ভুলভাবে এবং বৈজ্ঞানিক ব্যাখ্যার মাধ্যমে বাংলায় বোঝানো।
তোমার উত্তরের বৈশিষ্ট্য:
1. ভাষা হবে সহজ, সাবলীল বাংলা (প্রয়োজনে সাথে ইংরেজি বৈজ্ঞানিক পরিভাষা যেমন: Exothermic, Oxidation, Precipitate ইত্যাদি থাকবে)।
2. সমীকরণ থাকলে ব্যালেন্সড সমীকরণ (Balanced Equation) লিখবে।
3. বিক্রিয়ার কারণ (Mechanism/Concept), যেমন: সক্রিয়তার ক্রম, ইলেকট্রন স্থানান্তর, প্রোটন আদান-প্রদান বা দ্রবণীয়তার নিয়ম পরিষ্কারভাবে ব্যাখ্যা করবে।
4. ল্যাবরেটরি নিরাপত্তা (Safety) ও সতর্কবার্তা যুক্ত করবে।
5. শিক্ষার্থী যে বাস্তব বা কাল্পনিক পরীক্ষাটি ল্যাবে করছে তা প্রাসঙ্গিকভাবে বিবেচনা করবে।

বর্তমান ল্যাবরেটরি কনটেক্সট:
- ল্যাব বিকারের বর্তমান উপাদান: ${context?.beakerContents || "খালি বিকার"}
- বর্তমান তাপমাত্রা: ${context?.temperature || "25°C"}
- বর্তমান pH: ${context?.ph || "7.0"}
- চলমান বিক্রিয়া: ${context?.currentReaction || "কোনো চলমান বিক্রিয়া নেই"}
- নির্বাচিত ব্যবহারিক পরীক্ষা: ${context?.activePractical || "সাধারণ ভার্চুয়াল ল্যাব"}`;

    const prompt = `শিক্ষার্থীর প্রশ্ন: "${question}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const answer = response.text || generateFallbackResponse(question, context);
    res.json({ answer, source: "gemini_ai" });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.json({
      answer: generateFallbackResponse(req.body?.question || "", req.body?.context),
      source: "offline_fallback",
      note: "অফলাইন রসায়ন ডেটাবেস থেকে উত্তর তৈরি করা হয়েছে।",
    });
  }
});

// Offline rule-based tutor fallback
function generateFallbackResponse(question: string, context: any): string {
  const q = (question || "").toLowerCase();
  
  if (q.includes("hcl") && q.includes("naoh") || q.includes("প্রশমন") || q.includes("neutralization")) {
    return `### প্রশমন বিক্রিয়া (Neutralization Reaction)\n\n**সমীকরণ:**\n$$\\text{HCl(aq)} + \\text{NaOH(aq)} \\rightarrow \\text{NaCl(aq)} + \\text{H}_2\\text{O(l)} + \\text{তাপ}$$\n\n**ব্যাখ্যা:**\nহাইড্রোক্লোরিক এসিড ($\\text{HCl}$) এবং সোডিয়াম হাইড্রোক্সাইড ($\\text{NaOH}$) এর বিক্রিয়ায় এসিডের $\\text{H}^+$ আয়ন এবং ক্ষারের $\\text{OH}^-$ আয়ন একত্রিত হয়ে নিরপেক্ষ পানি ($\\text{H}_2\\text{O}$) এবং সোডিয়াম ক্লোরাইড লবণ তৈরি করে। এটি একটি **তাপ উৎপাদী (Exothermic)** বিক্রিয়া, তাই বিকারের তাপমাত্রা সামান্য বৃদ্ধি পায়।\n\n**pH পরিবর্তন:** এসিডের pH < 7 ও ক্ষারের pH > 14 থেকে বিক্রিয়া শেষে পূর্ণ প্রশমনে pH প্রায় 7 (নিরপেক্ষ) হয়।`;
  }

  if (q.includes("cuso4") || q.includes("fe") || q.includes("লোহা") || q.includes("প্রতিস্থাপন") || q.includes("displacement")) {
    return `### এক-প্রতিস্থাপন বিক্রিয়া (Single Displacement Reaction)\n\n**সমীকরণ:**\n$$\\text{Fe(s)} + \\text{CuSO}_4\\text{(aq)} \\rightarrow \\text{FeSO}_4\\text{(aq)} + \\text{Cu(s)}$$\n\n**ব্যাখ্যা:**\nধাতুর সক্রিয়তার সিরিজে লোহা ($\\text{Fe}$) কপারের ($\\text{Cu}$) উপরে অবস্থিত। ফলে লোহা বেশি সক্রিয় হওয়ায় তা কপার সালফেটের নীল দ্রবণ থেকে কপারকে স্থানচ্যুত করে এবং হালকা সবুজ বর্ণের ফেরাস সালফেট ($\\text{FeSO}_4$) তৈরি করে। পাত্রের তলায় লালচে-বাদামী তামার স্তর জমা হয়।\n\n**জারণ-বিজারণ:** এটি একটি রেডক্স বিক্রিয়া। এখানে $\\text{Fe}$ জারিত হয় ($\\text{Fe} \\rightarrow \\text{Fe}^{2+} + 2e^-$) এবং $\\text{Cu}^{2+}$ বিজারিত হয়।`;
  }

  if (q.includes("zn") || q.includes("হাইড্রোজেন") || q.includes("gas") || q.includes("পপ")) {
    return `### জিংক ও এসিডের বিক্রিয়া ও হাইড্রোজেন গ্যাস প্রস্তুতি\n\n**সমীকরণ:**\n$$\\text{Zn(s)} + 2\\text{HCl(aq)} \\rightarrow \\text{ZnCl}_2\\text{(aq)} + \\text{H}_2\\text{(g)}\\uparrow$$\n\n**ব্যাখ্যা:**\nজিংক একটি সক্রিয় ধাতু। এটি লঘু হাইড্রোক্লোরিক এসিডের সাথে দ্রুত বিক্রিয়া করে বর্ণহীন, গন্ধহীন হাইড্রোজেন গ্যাস তৈরি করে যা বুদবুদ আকারে নির্গত হয়।\n\n**পপ টেস্ট (Pop Test):** হাইড্রোজেন গ্যাসের মুখে একটি জ্বলন্ত কাঠি ধরলে মৃদু 'পপ' (Pop) শব্দ করে নীল শিখায় জ্বলে ওঠে।`;
  }

  if (q.includes("ph") || q.includes("পিএইচ")) {
    return `### pH এর ধারণা\n\n**সংজ্ঞা:** কোনো দ্রবণের হাইড্রোজেন আয়ন কনসেন্ট্রেশনের ঋণাত্মক লগারিদমকে pH বলে ($\\text{pH} = -\\log[\\text{H}^+]$)।\n- **pH < 7:** অম্লীয় (Acidic দ্রবণ, যেমন: $\\text{HCl, } \\text{H}_2\\text{SO}_4$)\n- **pH = 7:** নিরপেক্ষ (Neutral, যেমন: বিশুদ্ধ পানি, $\\text{NaCl}$ দ্রবণ)\n- **pH > 7:** ক্ষারীয় (Basic দ্রবণ, যেমন: $\\text{NaOH, } \\text{KOH}$)\n\nলিটমাস কাগজের রঙ দেখে অথবা ডিজিটাল pH মিটারের সাহায্যে নিখুঁত মান নির্ণয় করা যায়।`;
  }

  return `### ভার্চুয়াল কেমিস্ট্রি শিক্ষক প্রতিক্রিয়া\n\nআপনার প্রশ্ন: "${question}"\n\n**বর্তমান ল্যাব পর্যবেক্ষণ:**\nবিকারটিতে বর্তমানে ${context?.beakerContents || "উপাদান যুক্ত আছে"}।\n\nরসায়নে যেকোনো বিক্রিয়া মূলত পরমাণু ও আয়নগুলির ইলেকট্রন পুনর্বিন্যাস, রাসায়নিক বন্ধন ভাঙা ও নতুন বন্ধন গঠনের মাধ্যমে ঘটে। আপনি বিকারের বিভিন্ন কেমিক্যাল নির্বাচন করে "বিকারে ঢালুন" বাটনে ক্লিক করে বাস্তবসম্মত বিক্রিয়া ও বর্ণ পরিবর্তন পর্যবেক্ষণ করতে পারেন!`;
}

// Vite middleware setup
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
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bangla Virtual Chemistry Lab Server running on port ${PORT}`);
  });
}

startServer();
