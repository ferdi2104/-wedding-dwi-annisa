const { put, list } = require('@vercel/blob');

const BLOB_NAME = 'wishes.json';

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip tags to prevent XSS
    .trim();
}

async function fetchCurrentWishes() {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    const target = blobs.find(b => b.pathname === BLOB_NAME);
    if (!target) return [];
    
    const res = await fetch(`${target.url}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error reading blob wishes:', err);
    return [];
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Ambil daftar ucapan publik
  if (req.method === 'GET') {
    try {
      const wishes = await fetchCurrentWishes();
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res.status(200).json({ success: true, count: wishes.length, data: wishes });
    } catch (err) {
      console.error('GET error:', err);
      return res.status(500).json({ success: false, error: 'Gagal mengambil ucapan' });
    }
  }

  // POST: Kirim ucapan baru ke publik
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

      // Format waktu zona WIB (Jakarta UTC+7)
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

      const newWish = {
        id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name,
        attendance,
        message,
        date: formattedDate
      };

      const currentWishes = await fetchCurrentWishes();
      currentWishes.unshift(newWish);

      // Batasi maksimal 300 ucapan terbaru untuk menjaga performa
      const trimmedWishes = currentWishes.slice(0, 300);

      await put(BLOB_NAME, JSON.stringify(trimmedWishes, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true
      });

      return res.status(201).json({
        success: true,
        newWish,
        data: trimmedWishes
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
