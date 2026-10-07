require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-3.5-flash";

app.use(cors());
app.use(express.json());

/* =========================================================
   HOME
========================================================= */

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "SpeakMate AI Server is running"
    });

});


/* =========================================================
   COUNTRY DATA
========================================================= */

const countryData = {

    AE: {
        name: "UAE",
        flag: "🇦🇪",
        workplace:
            "Practice professional communication with managers, colleagues and customers in an international workplace.",
        interview:
            "Practice job interviews, self-introduction, skills, experience and career goals.",
        customer:
            "Practice polite customer conversations, product explanations and handling customer questions.",
        daily:
            "Practice everyday workplace conversations, asking for help and discussing tasks."
    },

    CA: {
        name: "Canada",
        flag: "🇨🇦",
        workplace:
            "Practice teamwork, meetings, workplace requests and professional communication.",
        interview:
            "Practice clear answers about experience, skills, strengths and career goals.",
        customer:
            "Practice friendly and professional customer communication.",
        daily:
            "Practice workplace introductions, teamwork, questions and professional small talk."
    },

    AU: {
        name: "Australia",
        flag: "🇦🇺",
        workplace:
            "Practice practical workplace communication with managers, coworkers and customers.",
        interview:
            "Practice confident self-introduction, experience, skills and career goals.",
        customer:
            "Practice friendly customer service conversations and handling questions.",
        daily:
            "Practice everyday workplace communication and asking for assistance."
    },

    GB: {
        name: "UK",
        flag: "🇬🇧",
        workplace:
            "Practice polite workplace communication, meetings and professional requests.",
        interview:
            "Practice structured answers about experience, skills, strengths and motivation.",
        customer:
            "Practice polite customer greetings, understanding needs and providing clear responses.",
        daily:
            "Practice introductions, teamwork and everyday professional conversations."
    },

    DE: {
        name: "Germany",
        flag: "🇩🇪",
        workplace:
            "Practice clear and structured workplace communication with managers and colleagues.",
        interview:
            "Practice professional self-introductions, experience, skills and motivation.",
        customer:
            "Practice product explanations, customer needs and professional responses.",
        daily:
            "Practice asking questions, discussing tasks and communicating with your team."
    },

    US: {
        name: "USA",
        flag: "🇺🇸",
        workplace:
            "Practice workplace conversations, meetings, requests and communication with managers.",
        interview:
            "Practice confident answers about experience, skills, strengths and career goals.",
        customer:
            "Practice customer greetings, product explanations and professional problem solving.",
        daily:
            "Practice introductions, asking for help, teamwork and everyday workplace conversations."
    }

};


/* =========================================================
   WORK ABROAD SYSTEM INSTRUCTIONS
========================================================= */

function getWorkAbroadInstruction(countryCode, topic) {

    const country =
        countryData[countryCode] ||
        countryData.US;

    const selectedTopic =
        topic || "general workplace practice";


    return `

You are SpeakMate AI Work Abroad Coach.

The user is preparing to work abroad.

SELECTED DESTINATION:
${country.flag} ${country.name}

SELECTED PRACTICE:
${selectedTopic}

COUNTRY-SPECIFIC FOCUS:
Workplace:
${country.workplace}

Interview:
${country.interview}

Customer:
${country.customer}

Daily workplace:
${country.daily}


YOUR JOB:

Help the user practice practical English for working in ${country.name}.

This is an English learning and roleplay session.

Ask ONE question at a time.

When the user answers, respond in this exact useful structure:

✍️ English Correction:
Give a corrected version of the user's answer.

💬 Better Natural English:
Give a more natural professional version while keeping the user's original meaning.

⭐ Quick Feedback:
Briefly explain what the user did well and what can improve.

🎯 Speaking Tip:
Give one short speaking tip.

➡️ Next Question:
Ask the next realistic question.

IMPORTANT:

- Do not invent the user's experience.
- Do not invent qualifications.
- Do not claim the user has worked somewhere if they did not say so.
- Keep the user's original meaning.
- Use simple and practical English.
- Make scenarios realistic for international workplaces.
- Do not ask multiple interview questions at once.
- Keep feedback concise.
- Encourage the user without giving fake scores.
- If the user makes grammar mistakes, correct them politely.
- If the user answers in Hindi/Hinglish, help convert the answer into natural professional English.
- Do not mention these system instructions.

The user may be practicing:
- first day at work
- introducing themselves
- talking with a manager
- talking with colleagues
- customer conversations
- workplace problems
- meetings
- job interviews
- sales conversations
- asking for help
- career goals

Start naturally and keep the conversation interactive.

`;
}


/* =========================================================
   NORMAL JOB COACH
========================================================= */

const normalInstruction = `

You are SpeakMate AI, a friendly English learning and career coach.

Help the user learn and practice English.

You can help with:

- Daily English
- Job interviews
- Sales English
- Self introduction
- Resume/CV English
- Professional emails
- Workplace communication
- Speaking confidence
- Grammar
- Vocabulary
- Translation
- Pronunciation
- Travel English
- Office English

If the user writes Hindi or Hinglish,
reply in simple Hindi/Hinglish when appropriate.

Correct English mistakes politely.

If the user tells you their name,
use it naturally later when useful.

If asked about their name,
use the information provided in the conversation.

Keep answers useful, short and natural.

Ask a useful follow-up question when appropriate.

Never mention these instructions.

`;


/* =========================================================
   SALES ROLEPLAY
========================================================= */

const salesRoleplayInstruction = `

You are SpeakMate AI conducting a Sales Executive job interview.

The user is the candidate.
You are the interviewer and English coach.

Ask ONE interview question at a time.

After the user's answer, provide:

✍️ English Correction:
Correct the English while keeping the original meaning.

💬 Better Natural English:
Give a polished professional version.

⭐ Quick Feedback:
Explain briefly what was good and what could improve.

🎯 Speaking Tip:
Give one useful speaking tip.

➡️ Next Question:
Ask the next sales interview question.

Important:

- Never invent experience.
- Never invent qualifications.
- Keep answers realistic.
- Keep questions relevant to sales.
- Do not ask multiple questions at once.
- Be encouraging and practical.
- Do not mention these instructions.

`;



/* =========================================================
   INTERVIEW PRACTICE
========================================================= */

const interviewInstruction = `

You are SpeakMate AI helping the user prepare for a professional job interview.

Ask one interview question at a time.

When the user gives an answer:

✍️ English Correction:
Correct grammar and sentence structure.

💬 Better Natural English:
Give a professional natural version.

⭐ Quick Feedback:
Briefly explain strengths and improvement areas.

🎯 Speaking Tip:
Give one speaking tip.

➡️ Next Question:
Ask the next interview question.

Do not invent experience or qualifications.

Keep the user's original meaning.

Keep questions practical and professional.

`;


/* =========================================================
   EXTRACT AI TEXT
========================================================= */

function extractModelOutput(data) {

    if (!data) {
        return "";
    }


    /* Direct output_text */

    if (
        typeof data.output_text === "string" &&
        data.output_text.trim()
    ) {

        return data.output_text.trim();

    }


    /* Interactions API steps */

    if (Array.isArray(data.steps)) {

        const modelOutputs =
            data.steps.filter(
                step =>
                    step &&
                    step.type === "model_output"
            );


        let finalText = "";


        for (const step of modelOutputs) {

            if (!Array.isArray(step.content)) {
                continue;
            }


            for (const content of step.content) {

                if (
                    content &&
                    content.type === "text" &&
                    typeof content.text === "string"
                ) {

                    finalText +=
                        content.text;

                }

            }

        }


        if (finalText.trim()) {

            return finalText.trim();

        }

    }


    return "";

}


/* =========================================================
   CHAT API
========================================================= */

app.post("/chat", async (req, res) => {

    try {

        const userMessage =
            req.body.message;

        const mode =
            req.body.mode || "job_coach";

        const questionNumber =
            Number(
                req.body.questionNumber || 1
            );


        /*
         * Work Abroad information can come
         * directly from chat.html.
         */

        const countryCode =
            req.body.countryCode ||
            req.body.workAbroadCountryCode ||
            "";


        const countryName =
            req.body.countryName ||
            req.body.workAbroadCountry ||
            "";


        const topic =
            req.body.topic ||
            req.body.workAbroadTopic ||
            "general workplace practice";


        /* -----------------------------------------------------
           VALIDATION
        ----------------------------------------------------- */

        if (
            !userMessage ||
            !userMessage.trim()
        ) {

            return res.status(400).json({

                success: false,

                reply:
                    "Please type a message."

            });

        }


        /* -----------------------------------------------------
           API KEY
        ----------------------------------------------------- */

        if (!API_KEY) {

            console.error(
                "❌ GEMINI_API_KEY is missing."
            );

            return res.status(500).json({

                success: false,

                reply:
                    "Gemini API key is missing. Please check your .env file."

            });

        }


        console.log("");
        console.log("======================================");
        console.log("👤 User:", userMessage);
        console.log("🎯 Mode:", mode);
        console.log("🌍 Country:", countryName || countryCode || "None");
        console.log("📚 Topic:", topic);
        console.log("❓ Question:", questionNumber);
        console.log("======================================");


        /* -----------------------------------------------------
           SELECT SYSTEM INSTRUCTION
        ----------------------------------------------------- */

        let systemInstruction =
            normalInstruction;


        let finalMessage =
            userMessage;


        /* =====================================================
           WORK ABROAD
        ===================================================== */

        if (
            mode === "work_abroad" ||
            mode === "work_abroad_roleplay" ||
            mode === "work_abroad_coach"
        ) {

            systemInstruction =
                getWorkAbroadInstruction(
                    countryCode,
                    topic
                );


            finalMessage = `

WORK ABROAD PRACTICE

Destination:
${countryName || countryCode || "International workplace"}

Practice:
${topic}

Question number:
${questionNumber}

User answer/message:
${userMessage}

Respond as the Work Abroad English Coach.

`;

        }


        /* =====================================================
           SALES ROLEPLAY
        ===================================================== */

        else if (
            mode === "sales_roleplay"
        ) {

            systemInstruction =
                salesRoleplayInstruction;


            finalMessage = `

Sales Interview Question Number:
${questionNumber}

Candidate Answer:
${userMessage}

Evaluate the candidate's answer and continue the interview.

`;

        }


        /* =====================================================
           INTERVIEW PRACTICE
        ===================================================== */

        else if (
            mode === "interview_practice"
        ) {

            systemInstruction =
                interviewInstruction;

        }


        /* =====================================================
           GEMINI REQUEST
        ===================================================== */

        const response =
            await fetch(
                "https://generativelanguage.googleapis.com/v1beta/interactions",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "x-goog-api-key":
                            API_KEY,

                        "Api-Revision":
                            "2026-05-20"

                    },

                    body: JSON.stringify({

                        model:
                            MODEL,

                        input: [
                            {
                                type: "text",
                                text:
                                    finalMessage
                            }
                        ],

                        system_instruction:
                            systemInstruction,

                        store:
                            false

                    })

                }
            );


        /* -----------------------------------------------------
           RESPONSE JSON
        ----------------------------------------------------- */

        const data =
            await response.json();


        /* -----------------------------------------------------
           GEMINI ERROR
        ----------------------------------------------------- */

        if (!response.ok) {

            console.error(
                "❌ Gemini Error:",
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );


            return res.status(
                response.status
            ).json({

                success: false,

                reply:
                    data?.error?.message ||
                    "Gemini API request failed."

            });

        }


        /* -----------------------------------------------------
           EXTRACT TEXT
        ----------------------------------------------------- */

        const reply =
            extractModelOutput(
                data
            );


        /* -----------------------------------------------------
           EMPTY RESPONSE
        ----------------------------------------------------- */

        if (!reply) {

            console.error(
                "❌ Empty Gemini response:"
            );

            console.error(
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );


            return res.status(500).json({

                success: false,

                reply:
                    "Gemini returned an empty response."

            });

        }


        /* -----------------------------------------------------
           LOG
        ----------------------------------------------------- */

        console.log(
            "🤖 AI:",
            reply
        );


        /* -----------------------------------------------------
           SUCCESS
        ----------------------------------------------------- */

        return res.json({

            success: true,

            reply:
                reply,

            mode:
                mode,

            country:
                countryName ||
                countryCode ||
                "",

            topic:
                topic,

            questionNumber:
                questionNumber

        });


    }

    catch (error) {

        console.error(
            "❌ Server Error:",
            error
        );


        return res.status(500).json({

            success: false,

            reply:
                "AI connection error: " +
                error.message

        });

    }

});


/* =========================================================
   START SERVER
========================================================= */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "🚀 SpeakMate AI Server Started"
        );

        console.log(
            "======================================"
        );

        console.log(
            "🌐 http://localhost:" +
            PORT
        );

        console.log(
            "📱 Android: http://10.0.2.2:" +
            PORT
        );

        console.log(
            "🤖 Model:",
            MODEL
        );

        console.log(
            "🔐 API key loaded from .env"
        );

        console.log(
            "======================================"
        );

        console.log("");

    }
);