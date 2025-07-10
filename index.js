const { default: makeWASocket, useSingleFileAuthState } = require("@adiwajshing/baileys");
const { state, saveState } = useSingleFileAuthState('./session.json');

const RULES = {
  maxActions: 3,
  const { default: makeWASocket, useSingleFileAuthState } = require("@adiwajshing/baileys");
const { state, saveState } = useSingleFileAuthState('./session.json');

const RULES = {
  maxActions: 3,
  requireIC: true
};

async function start() {
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const jid = msg.key.remoteJid;
    if (!body.includes('🎮ACTIONS🎮')) return;

    let errors = [];
    const actions = (body.match(/👊🏼:/g) || []).length;
    if (actions > RULES.maxActions) errors.push(`❌ Plus de ${RULES.maxActions} actions.`);
    if (RULES.requireIC && !body.includes('IC')) errors.push(`❌ IC manquant.`);
    const response = errors.length ? errors.join('\n') : `✅ Pavé RP validé.`;
    await sock.sendMessage(jid, { text: `Chat Jaune 🟡 :\n${response}` });
  });

  sock.ev.on('creds.update', saveState);
}

start();
