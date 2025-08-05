// Backend/server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
// Import both middleware handlers from the Clerk SDK
const { ClerkExpressRequireAuth, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

// --- Express App & Middleware Setup ---
const app = express();
const port = 3001;
app.set('trust proxy', 1);
const corsOptions = { origin: 'http://localhost:5173', credentials: true };
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// --- Database Schemas & Models ---
const MessageSchema = new mongoose.Schema({
    chatId: { type: String, required: true, index: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const ChatSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'New Chat' },
    createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);
const Chat = mongoose.model('Chat', ChatSchema);


// --- Function to get the correct User ID (Clerk or Guest) ---
const getUserId = (req) => {
    // Prioritize the authenticated Clerk user ID from the middleware
    if (req.auth && req.auth.userId) {
        return req.auth.userId;
    }
    // Fallback to the guest cookie if no authenticated user
    return req.cookies.userId;
};

// --- Main Chat Endpoint ---
// Use ClerkExpressWithAuth to handle both guests and signed-in users
app.post('/chat', ClerkExpressWithAuth(), async (req, res) => {
    try {
        let { prompt, chatId } = req.body;
        let userId = getUserId(req);

        // If no user ID exists at all, create a new guest ID
        if (!userId) {
            userId = `guest-${uuidv4()}`;
            res.cookie('userId', userId, { maxAge: 31536000000, httpOnly: true, sameSite: 'lax' });
        }
        
        const isNewChat = !chatId;
        if (isNewChat) {
            chatId = uuidv4();
            const newChat = new Chat({ 
                chatId, 
                userId,
                title: prompt.substring(0, 50)
            });
            await newChat.save();
        }

        const userMessage = new Message({ chatId, sender: 'user', content: prompt });
        await userMessage.save();
        
        const n8nWebhookUrl = 'https://shivanshu-nsut.app.n8n.cloud/webhook/HRBOT';
        const history = req.body.history || [];
        const formattedHistory = history.map(msg => ({
            type: msg.sender === 'user' ? 'human' : 'ai',
            data: { content: msg.text }
        }));

        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, chatId, userId, history: formattedHistory })
        });

        if (!n8nResponse.ok) throw new Error(`n8n webhook failed`);

        const n8nData = await n8nResponse.json();
        const aiResponseText = n8nData.reply;

        if (!aiResponseText) throw new Error("Invalid response from n8n.");

        const botMessage = new Message({ chatId, sender: 'bot', content: aiResponseText });
        await botMessage.save();
        
        res.json({
            reply: aiResponseText,
            ...(isNewChat && { newChatId: chatId })
        });

    } catch (error) {
        console.error("Error in /chat endpoint:", error);
        res.status(500).json({ error: 'Failed to process chat request.' });
    }
});


// --- NEW ENDPOINT TO MERGE GUEST CHATS ---
// Use ClerkExpressRequireAuth to ensure only logged-in users can merge
app.post('/merge', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { guestId } = req.body;
        const clerkId = req.auth.userId;

        if (!guestId || !clerkId) {
            return res.status(400).json({ error: 'Guest ID and Clerk ID are required.' });
        }

        // Find all chats associated with the guest ID and update them to the Clerk ID
        const result = await Chat.updateMany(
            { userId: guestId },
            { $set: { userId: clerkId } }
        );

        console.log(`Merged ${result.nModified} chats from ${guestId} to ${clerkId}`);
        res.status(200).json({ success: true, message: 'Chats merged successfully.' });
    } catch (error) {
        console.error("Error in /merge endpoint:", error);
        res.status(500).json({ error: 'Failed to merge chats.' });
    }
});


// --- History and Session Endpoints ---
app.get('/history', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(200).json([]);
        const userChats = await Chat.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(userChats);
    } catch (error) {
        console.error("Error in /history endpoint:", error);
        res.status(500).json({ error: 'Failed to fetch chat history.' });
    }
});

app.get('/chat/:chatId', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

app.get('/session', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(200).json({ message: "No active session found." });
        
        const latestChat = await Chat.findOne({ userId }).sort({ createdAt: -1 });
        if (!latestChat) return res.status(200).json({ userId, message: "User exists but has no chats." });

        const chatHistory = await Message.find({ chatId: latestChat.chatId }).sort({ createdAt: 1 });
        res.status(200).json({ userId, chatId: latestChat.chatId, messages: chatHistory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restore session.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});