// Gera o áudio da frase na voz do ElevenLabs. A chave fica só no Vercel (ELEVENLABS_API_KEY).
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  const text = String(req.query.text || '').slice(0, 400);
  const voice = String(req.query.voice || process.env.ELEVEN_VOICE_ID || '').replace(/[^A-Za-z0-9]/g, '');
  if (!key || !text || !voice) return res.status(400).send('faltou chave, texto ou voz');
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: process.env.ELEVEN_MODEL || 'eleven_multilingual_v2',
      language_code: 'pt',
      voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true }
    })
  });
  if (!r.ok) return res.status(502).send(await r.text());
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, s-maxage=31536000, immutable'); // mesma frase não gasta crédito de novo
  res.send(Buffer.from(await r.arrayBuffer()));
}
