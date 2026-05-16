/**
 * Trai Inc — WhatsApp Chat Bridge Server
 * 
 * Architecture:
 *   Website Chatbot  <—WebSocket—>  This Server  <—REST/Webhook—>  WhatsApp Cloud API
 *
 * Setup:
 *   1. npm install
 *   2. Copy .env.example to .env and fill in your values
 *   3. node server.js
 *   4. Expose port 3001 via ngrok: ngrok http 3001
 *   5. Set the ngrok URL as your Meta Webhook URL
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ─── Config ────────────────────────────────────────────────────────────────
const PORT           = process.env.PORT || 3001;
const VERIFY_TOKEN   = process.env.WHATSAPP_VERIFY_TOKEN;   // any string you pick
const WA_TOKEN       = process.env.WHATSAPP_API_TOKEN;      // from Meta dev console
const PHONE_ID       = process.env.WHATSAPP_PHONE_NUMBER_ID; // e.g. 173000262573577
const YOUR_WA_NUMBER = process.env.YOUR_WHATSAPP_NUMBER;    // e.g. 917905495478

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('.'));   // serve the website files too

// ─── WebSocket Server ───────────────────────────────────────────────────────
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`[WS] Client connected. Total: ${clients.size}`);

    // Send welcome message immediately
    ws.send(JSON.stringify({
        type: 'bot',
        text: "Hi there! 👋 How can we help you today? Send us a message and we'll reply from WhatsApp.",
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }));

    ws.on('close', () => {
        clients.delete(ws);
        console.log(`[WS] Client disconnected. Total: ${clients.size}`);
    });

    ws.on('message', async (raw) => {
        try {
            const msg = JSON.parse(raw);
            if (msg.type === 'user' && msg.text?.trim()) {
                console.log(`[WS→WA] User says: "${msg.text}"`);
                await sendToWhatsApp(msg.text);
            }
        } catch (err) {
            console.error('[WS] Parse error:', err.message);
        }
    });
});

// Broadcast to all connected website chatbot clients
function broadcast(payload) {
    const data = JSON.stringify(payload);
    clients.forEach(ws => {
        if (ws.readyState === 1) ws.send(data);
    });
}

// ─── Send to YOUR WhatsApp via Cloud API ────────────────────────────────────
async function sendToWhatsApp(text) {
    try {
        await axios.post(
            `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to: YOUR_WA_NUMBER,
                type: 'text',
                text: { body: `💬 Website visitor:\n\n${text}` }
            },
            {
                headers: {
                    Authorization: `Bearer ${WA_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`[WA] Delivered to your WhatsApp ✓`);
    } catch (err) {
        console.error('[WA] Send error:', err.response?.data || err.message);
    }
}

// ─── REST: Chatbot sends message ─────────────────────────────────────────────
app.post('/api/chat/send', async (req, res) => {
    const { text, sessionId } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

    // Relay to your WhatsApp
    await sendToWhatsApp(text);

    // Acknowledge to frontend
    res.json({ ok: true, message: 'Message sent to WhatsApp' });
});

// ─── META WEBHOOK: Receive your replies from WhatsApp ────────────────────────

// Verification handshake
app.get('/webhook', (req, res) => {
    const mode      = req.query['hub.mode'];
    const token     = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('[Webhook] Meta verification successful ✓');
        res.status(200).send(challenge);
    } else {
        console.warn('[Webhook] Verification failed — token mismatch');
        res.sendStatus(403);
    }
});

// Incoming messages from WhatsApp
app.post('/webhook', (req, res) => {
    const body = req.body;
    res.sendStatus(200); // always ACK fast

    try {
        const entry   = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value   = changes?.value;
        const msgs    = value?.messages;

        if (!msgs?.length) return;

        msgs.forEach(msg => {
            if (msg.type === 'text') {
                const text = msg.text.body;
                console.log(`[WA→WS] You replied: "${text}"`);

                // Push your reply to the website chatbot
                broadcast({
                    type: 'reply',
                    text,
                    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                });
            }
        });
    } catch (err) {
        console.error('[Webhook] Processing error:', err.message);
    }
});

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', clients: clients.size }));

// ─── Start ──────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`\n✅ Trai Chat Bridge running on http://localhost:${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}`);
    console.log(`   Webhook:   http://localhost:${PORT}/webhook`);
    console.log(`\n👉 Next: run "ngrok http ${PORT}" and paste the HTTPS URL in Meta console\n`);
});
