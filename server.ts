import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;

// Lazy GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      appName: "CampusPulse AI - Smart Android Student Companion API",
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Assistant Chat & Queries
  app.post("/api/ai/assistant", async (req, res) => {
    try {
      const { message, context, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGenAI();
      if (!ai) {
        // Fallback intelligent response if GEMINI_API_KEY is not configured
        const fallback = generateIntelligentFallback(message, context);
        return res.json({
          reply: fallback,
          source: "offline_assistant",
        });
      }

      const systemPrompt = `You are "CampusPulse AI", an advanced, friendly, and knowledgeable AI Academic Assistant and Campus Companion for college students.
You assist university students with:
1. Campus schedules, events, deadlines, and timetable queries.
2. Explaining complex academic topics (Computer Science, Mathematics, Electronics, Engineering, Science, Business, etc.) with intuitive analogies, step-by-step breakdowns, and code examples (especially Kotlin, Java, Python, C++).
3. Creating personalized exam study plans, revision schedules, and time management strategies.
4. Answering questions about pending assignments, exam prep tips, and lecture notes.
5. Drafting emails to professors, debugging code snippets, and solving math/algorithmic problems.

Student Information Context:
${context ? JSON.stringify(context, null, 2) : "Standard undergraduate student"}

Style Guidelines:
- Format your response using clean Markdown with bold headings, bullet points, and code blocks with syntax highlighting.
- Be encouraging, concise, highly educational, and practical.
- If asked about events or assignments, refer to the provided context when applicable.`;

      let contentsPayload: any = message;
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        const historyText = conversationHistory
          .slice(-6)
          .map((msg: any) => `${msg.sender === "user" ? "Student" : "CampusPulse AI"}: ${msg.text}`)
          .join("\n\n");
        contentsPayload = `Conversation history:\n${historyText}\n\nCurrent Student Query: ${message}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contentsPayload,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I processed your request, but could not generate text.";
      return res.json({
        reply: replyText,
        source: "gemini-3.7-flash",
      });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      // Fallback graceful degradation
      const fallback = generateIntelligentFallback(req.body.message, req.body.context);
      return res.json({
        reply: `${fallback}\n\n*(Note: Generated via smart offline campus engine due to network limits)*`,
        source: "offline_assistant",
      });
    }
  });

  // AI Concept Explainer
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { concept, difficulty = "intermediate", subject = "Computer Science" } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          explanation: `### Overview of ${concept}\n\n**Key Concept**: ${concept} is a fundamental topic in ${subject}.\n\n- **Definition**: Core principles that define how components interact.\n- **Real-World Analogy**: Think of it like a coordinated university library distribution system.\n- **Best Practices**: Practice active coding, modular design, and edge-case testing.`,
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Explain "${concept}" in the context of ${subject} for a ${difficulty} level college student. Include:
1. 💡 Simple 1-sentence Definition
2. 🚗 Intuitive Real-World Analogy
3. 📐 Technical Breakdown & Mathematical/Code Example (prefer Kotlin/Python if programming)
4. ⚠️ Common Mistakes & Exam Pitfalls
5. 🧪 2 Quick Self-Check Practice Questions with answers`,
      });

      return res.json({ explanation: response.text });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // AI Study Plan Generator
  app.post("/api/ai/study-plan", async (req, res) => {
    try {
      const { subject, daysLeft = 5, targetScore = "A+", hoursPerDay = 3, topics = [] } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          plan: `### 🗓️ ${daysLeft}-Day Accelerated Study Plan: ${subject}\n\n- **Target**: ${targetScore} (${hoursPerDay} hrs/day)\n- **Day 1**: Core Architecture & Theory foundations\n- **Day 2**: Practice problems & Algorithms\n- **Day 3**: Previous Year Questions & Lab review\n- **Day 4**: Mock test under timed conditions\n- **Day 5**: Formula sheet review and quick flashcards`,
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Create a structured ${daysLeft}-day study plan for the college course "${subject}" targeting a grade of ${targetScore}. 
Available time: ${hoursPerDay} hours per day.
Key Topics: ${topics.length > 0 ? topics.join(", ") : "Complete syllabus core modules"}.
Format with daily milestones, morning/evening study blocks, active recall methods, and practical review checklist.`,
      });

      return res.json({ plan: response.text });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusPulse Server running on http://localhost:${PORT}`);
  });
}

function generateIntelligentFallback(query: string = "", context: any = {}): string {
  const q = query.toLowerCase();

  if (q.includes("event") || q.includes("happening") || q.includes("this week")) {
    return `### 📅 Campus Events This Week:\n
1. **🚀 HackCampus 2026 (Annual 36-hr Hackathon)**
   - **Date**: Friday, Oct 28 • 9:00 AM
   - **Venue**: Innovation Hub, Block C
   - **Status**: Registration Open (Free swag & prizes up to $5,000)

2. **🤖 AI & Robotics Symposium: Future of Autonomous Systems**
   - **Date**: Wednesday, Oct 26 • 2:30 PM
   - **Speaker**: Dr. Aris Thorne (Google DeepMind)
   - **Venue**: Main Auditorium & Live Stream

3. **🏆 Inter-Department Football Championship**
   - **Date**: Saturday, Oct 29 • 4:00 PM
   - **Venue**: University Sports Complex`;
  }

  if (q.includes("assignment") || q.includes("due") || q.includes("deadline")) {
    return `### ⏰ Pending Assignments & Upcoming Deadlines:\n
1. **Operating Systems Lab 4: Virtual Memory & Page Replacement**
   - **Course**: CS301 • **Due**: In 2 days (Oct 26, 11:59 PM)
   - **Weight**: 15% • **Status**: In Progress (65% done)

2. **Distributed Systems: Raft Consensus Protocol Implementation**
   - **Course**: CS402 • **Due**: In 5 days (Oct 29, 5:00 PM)
   - **Weight**: 20% • **Status**: Not Started

3. **Digital Signal Processing: FFT Frequency Analysis Report**
   - **Course**: EE304 • **Due**: In 7 days (Oct 31, 11:59 PM)
   - **Weight**: 10% • **Status**: Pending`;
  }

  if (q.includes("study plan") || q.includes("exam") || q.includes("schedule")) {
    return `### 📚 High-Impact 5-Day Exam Preparation Plan:\n
- **Day 1 (Theory & Core Pillars)**: Deep dive into Module 1 & 2 lecture notes. Create condensed one-page cheat sheets.
- **Day 2 (Problem Solving)**: Solve top 15 textbook problem sets and previous year mid-term questions.
- **Day 3 (Lab & Practical Code)**: Revisit implementation exercises, edge cases, and code traces.
- **Day 4 (Timed Mock Exam)**: Simulate 2-hour exam without notes. Identify weak spots.
- **Day 5 (Active Recall & Formula Drill)**: Flashcards, mnemonic review, and early sleep for cognitive recovery.`;
  }

  if (q.includes("concept") || q.includes("explain") || q.includes("help me understand")) {
    return `### 💡 Concept Breakdown\n
Understanding complex topics is best approached using the **Feynman Technique**:
1. **The Core Intuition**: Break the problem down into fundamental truths you can explain to a 10-year-old.
2. **Visual Mapping**: Draw state transitions or memory layouts on paper.
3. **Hands-on Verification**: Write minimal runnable Kotlin/Python scripts to test assumptions.

*Tip: Feel free to ask me to explain any specific topic, such as Dynamic Programming, Coroutines, MVVM Architecture, Graph Algorithms, or ACID database properties!*`;
  }

  return `Hello! I am **CampusPulse AI**, your smart academic assistant.
I'm ready to help you with:
- 🗓️ Checking your upcoming schedule, lectures, and campus events.
- 📝 Explaining difficult programming, math, or engineering concepts.
- 🎯 Generating targeted study plans and revision strategies.
- 📋 Tracking assignments, submissions, and exam countdowns.
- 💡 Providing code snippets and homework guidance.

What would you like to work on today?`;
}

startServer();
