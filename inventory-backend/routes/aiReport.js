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

//   // Sanitize and validate each product to prevent prompt injection
//   const sanitizedProducts = products.map((product) => {
//     // Only allow objects with string/number/bool/null values, no nested objects/arrays or functions
//     if (typeof product !== 'object' || product === null || Array.isArray(product)) {
//       return null;
//     }
//     const sanitized = {};
//     for (const key in product) {
//       if (!Object.prototype.hasOwnProperty.call(product, key)) continue;
//       const value = product[key];
//       if (
//         typeof value === 'string' ||
//         typeof value === 'number' ||
//         typeof value === 'boolean' ||
//         value === null
//       ) {
//         // Escape any dangerous characters in strings
//         sanitized[key] = typeof value === 'string' ? value.replace(/[\n\r\t\f\b\v\0]/g, ' ') : value;
//       }
//     }
//     return sanitized;
//   }).filter(Boolean);
//   if (sanitizedProducts.length === 0) {
//     return res.status(400).json({ message: "Products array contains no valid product objects" });
//   }

//   try {
//     const prompt = `Generate a report summary for the following products:\n${JSON.stringify(
//       sanitizedProducts,
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
//   }

//   try {
//     const prompt = `Generate a report summary for the following products:\n${JSON.stringify(
//       sanitizedProducts,
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
