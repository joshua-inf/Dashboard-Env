import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files.length) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        // Ensure upload folder exists
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        const results = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Save file
            const filename = `${Date.now()}_${file.name}`;
            const filepath = path.join(uploadsDir, filename);
            await writeFile(filepath, buffer);

            const publicUrl = `/uploads/${filename}`;
            const imageBase64 = buffer.toString("base64");

            // Send to GPT for JSON extraction
            const prompt = `
You are an AI that extracts product information from images.

Return ONLY a valid JSON object with this shape:

{
  "name": string | null,
  "category": string | null,
  "price": number | null,
  "description": string | null
}

Rules:
- If you cannot determine a field, return null.
- Price must be a number or null.
- Category should be a simple classification: "Food", "Drinks", "Household", "Cosmetics", etc.
- Description: 1-2 sentences summarizing the product.
- Return ONLY JSON. No extra text.
`;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${file.type};base64,${imageBase64}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 500,
            });

            let text = completion.choices[0].message?.content || "";

            // Remove codeblocks if GPT adds them
            text = text.replace(/```json|```/g, "").trim();

            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                parsed = null;
            }

            results.push({
                imageUrl: publicUrl,
                ai: parsed,
            });
        }

        // console.log("result:", results)

        return NextResponse.json({ results });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: "OpenAI processing failed", details: String(error) },
            { status: 500 }
        );
    }
}
