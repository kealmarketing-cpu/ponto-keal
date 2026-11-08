// Lista as vozes da conta do ElevenLabs (a padrão vem de ELEVEN_VOICE_ID).
export default async function handler(req, res) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return res.status(200).json({ voices: [] });
  const r = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': key } });
  if (!r.ok) return res.status(200).json({ voices: [] });
  const d = await r.json();
  res.setHeader('Cache-Control', 's-maxage=300');
  res.json({
    default: process.env.ELEVEN_VOICE_ID || '',
    voices: (d.voices || []).map(v => ({ id: v.voice_id, name: v.name }))
  });
}
