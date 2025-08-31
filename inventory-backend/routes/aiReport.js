// import express from "express";
// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();

// if (!process.env.OPENAI_API_KEY) {
//   console.error("⚠️ OPENAI_API_KEY is missing in .env");
// }

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// router.post("/ai-report", async (req, res) => {
//   const { products } = req.body;

//   if (!products || !Array.isArray(products) || products.length === 0) {
//     return res.status(400).json({ message: "Products array is required" });
//   }

//   try {
//     const prompt = `Generate a report summary for the following products:\n${JSON.stringify(
//       products,
//       null,
//       2
//     )}`;

//     const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",  // ← use this if you don’t have GPT-4 access
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.7,
//         max_tokens: 500,
//       });
      

//     const report = response.choices[0].message.content;
//     res.json({ report });
//   } catch (error) {
//     console.error("❌ AI report generation failed:", error.message);
//     res.status(500).json({ message: "AI report generation failed" });
//   }
// });

// export default router;
