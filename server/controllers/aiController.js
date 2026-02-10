
import { GoogleGenAI } from "@google/genai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from 'axios'
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js'
import { invalidateUserCache } from "../middlewares/auth.js";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);


export const generateArticle = async (req, res) => {

    try {
        const userId = req.userId;
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue" })
        }


        const fullPrompt = `Write an article about ${prompt} in ${length} words`;
        const result = await genAI.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: fullPrompt
        });
        const content = result.text;

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
            // Invalidate cache so next request gets fresh data
            invalidateUserCache(userId);
        }

        res.json({ success: true, content })




    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }

}



export const generateBlogTitle = async (req, res) => {

    try {
        const userId = req.userId;
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.json({ success: false, message: "Limit reached. Upgrade to continue" })
        }


        const result = await genAI.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        const content = result.text;

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            })
            // Invalidate cache so next request gets fresh data
            invalidateUserCache(userId);
        }

        res.json({ success: true, content })




    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }

}



export const generateImage = async (req, res) => {

    try {
        const userId = req.userId;
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }

        //using clipdrop api for creating the image
        const formData = new FormData()
        formData.append('prompt', prompt)
        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: { 'x-api-key': process.env.CLIPDROP_API_KEY, },
            responseType: 'arraybuffer',
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image)


        await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        res.json({ success: true, content: secure_url })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }

}



export const removeImageBackground = async (req, res) => {

    try {
        const userId = req.userId;
        const image = req.file;
        const plan = req.plan;


        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }


        //using cloudinary api for removing the background in image

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        })

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

        res.json({ success: true, content: secure_url })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }

}



export const removeImageObject = async (req, res) => {

    try {
        const userId = req.userId;
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;


        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }


        //using cloudinary api for removing the background in image

        const { public_id } = await cloudinary.uploader.upload(image.path)

        // const imageUrl = cloudinary.url(public_id, {
        //     secure: true,
        //     transformation: [{effect: `gen_remove:${object}`}],
        //     resource_type: 'image'
        // })

        const imageUrl = cloudinary.url(public_id, {
            secure: true,
            transformation: [{ effect: `gen_remove:${object}` }], // ✅ No underscore
            resource_type: "image",
        });

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},  ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({ success: true, content: imageUrl })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }

}


export const resumeReview = async (req, res) => {

    try {
        const userId = req.userId;
        const resume = req.file;
        const plan = req.plan;


        if (plan !== 'premium') {
            return res.json({ success: false, message: "This feature is only available for premium subscriptions" })
        }


        if (resume.size > 5 * 1024 * 1024) {
            return res.json({ success: false, message: "Resume file size exceeds allowed size (5MB)." })

        }

        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData = await pdf(dataBuffer)

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas of improvement. ResumeContent:\n\n${pdfData.text}`


        const result = await genAI.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        const content = result.text;

        await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId},  'Review the uploaded resume', ${content}, 'resume-review')`;

        res.json({ success: true, content })



    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }

}