const SUPABASE_URL = 'https://inguzihjfpqnptbitwyj.supabase.co/rest/v1/wishes';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_oFT9K4OvFjGqtPzQnuXOow_zynUZsQI';

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim();
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Ambil daftar ucapan dari Supabase
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${SUPABASE_URL}?select=*&order=created_at.desc&limit=300`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
      }

      const wishes = await response.json();
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res.status(200).json({ success: true, count: wishes.length, data: wishes });
    } catch (err) {
      console.error('GET error:', err);
      return res.status(500).json({ success: false, error: 'Gagal mengambil ucapan' });
    }
  }

  // POST: Simpan ucapan ke Supabase
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (_) {
          return res.status(400).json({ success: false, error: 'Format data tidak valid' });
        }
      }

      body = body || {};
      const name = sanitize(body.name).slice(0, 60);
      const message = sanitize(body.message).slice(0, 600);
      const allowedAttendance = ['Hadir', 'Tidak Hadir', 'Ragu-ragu'];
      const attendance = allowedAttendance.includes(body.attendance) ? body.attendance : 'Hadir';

      if (!name || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Nama lengkap dan doa/ucapan wajib diisi.' 
        });
      }

      const now = new Date();
      const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const formattedDate = `${dateFormatter.format(now).replace(/\./g, ':')} WIB`;

      const insertRes = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name,
          attendance,
          message,
          date: formattedDate
        })
      });

      if (!insertRes.ok) {
        throw new Error(`Supabase insert failed: ${insertRes.status}`);
      }

      const data = await insertRes.json();
      const newWish = Array.isArray(data) ? data[0] : data;

      return res.status(201).json({
        success: true,
        newWish
      });
    } catch (err) {
      console.error('POST error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Terjadi kendala saat menyimpan ucapan. Silakan coba lagi.' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};
