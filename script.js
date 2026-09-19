// ==========================================================
// THE WEDDING OF DWI & ANNISA - JAVASCRIPT
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    initAndroidViewport();
    initGuestName();
    initCountdown();
    initWishes();
    initScrollSpy();
    initMusicAndCover();
});

// 0. DYNAMIC VIEWPORT HEIGHT FOR ALL ANDROID BROWSERS
function initAndroidViewport() {
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh, { passive: true });
    window.addEventListener('orientationchange', setVh, { passive: true });
}

// 1. DYNAMIC GUEST NAME FROM URL (?to=Nama+Tamu)
function initGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to') || urlParams.get('u');
    const guestElement = document.getElementById('guestName');
    
    if (guest && guestElement) {
        guestElement.textContent = decodeURIComponent(guest);
    }
}

// 2. MUSIC & COVER CONTROLLER
function initMusicAndCover() {
    const btnOpen = document.getElementById('btnOpen');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('mainContent');
    const musicToggle = document.getElementById('musicToggle');
    const bottomNav = document.getElementById('bottomNav');
    const bgMusic = document.getElementById('bgMusic');

    let isPlaying = false;

    // Open Invitation Handler
    const openInvitation = () => {
        cover.classList.add('opened');
        mainContent.classList.remove('locked');
        musicToggle.classList.remove('hide');
        bottomNav.classList.remove('hide');

        // Play audio (browser allows it after user interaction)
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.classList.remove('paused');
        }).catch((err) => {
            console.log('Audio autoplay prevented:', err);
            isPlaying = false;
            musicToggle.classList.add('paused');
        });

        // Scroll to first section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    btnOpen.addEventListener('click', openInvitation);
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', openInvitation);
        scrollIndicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openInvitation();
            }
        });
    }

    // Music Toggle Button
    const toggleMusic = () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.add('paused');
            isPlaying = false;
        } else {
            bgMusic.play();
            musicToggle.classList.remove('paused');
            isPlaying = true;
        }
    };
    musicToggle.addEventListener('click', toggleMusic);
    musicToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMusic();
        }
    });
}

// 3. COUNTDOWN TIMER
function initCountdown() {
    // Tanggal Pernikahan: Jum'at, 25 September 2026 08:00:00 WIB
    const targetDate = new Date('2026-09-25T08:00:00+07:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// 4. COPY TEXT TO CLIPBOARD
function copyText(text, btn) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Nomor rekening / alamat tersalin!');
            feedbackBtn(btn);
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Tersalin ke clipboard!');
            feedbackBtn(btn);
        } catch (e) {
            showToast('Gagal menyalin text.');
        }
        document.body.removeChild(textArea);
    }
}

function feedbackBtn(btn) {
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 2000);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// 5. LIGHTBOX MODAL
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = src;
    lightbox.classList.add('show');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('show');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Keyboard support for gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
});

// 6. UCAPAN & RSVP (LOCALSTORAGE)
const WISHES_STORAGE_KEY = 'wedding_wishes_v2';

function initWishes() {
    const form = document.getElementById('wishesForm');
    const wishesList = document.getElementById('wishesList');
    const wishesTotal = document.getElementById('wishesTotal');

    localStorage.removeItem('wedding_wishes_dwi_annisa');
    let wishes = JSON.parse(localStorage.getItem(WISHES_STORAGE_KEY)) || [];

    function render() {
        wishesTotal.textContent = wishes.length;
        wishesList.innerHTML = '';

        wishes.forEach(item => {
            const el = document.createElement('div');
            el.className = 'wish-item';

            let badgeClass = 'hadir';
            if (item.attendance === 'Tidak Hadir') badgeClass = 'tidak-hadir';
            if (item.attendance === 'Ragu-ragu') badgeClass = 'ragu';

            el.innerHTML = `
                <div class="wish-header">
                    <span class="wish-author">${escapeHtml(item.name)}</span>
                    <span class="wish-badge ${badgeClass}">${item.attendance}</span>
                </div>
                <p class="wish-msg">${escapeHtml(item.message)}</p>
                <span class="wish-time">${item.date}</span>
            `;
            wishesList.appendChild(el);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('senderName');
        const attendInput = document.getElementById('attendance');
        const msgInput = document.getElementById('wishesMessage');

        const newWish = {
            name: nameInput.value.trim(),
            attendance: attendInput.value,
            message: msgInput.value.trim(),
            date: 'Baru saja'
        };

        wishes.unshift(newWish);
        localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
        render();

        nameInput.value = '';
        msgInput.value = '';
        showToast('Terima kasih atas doa & ucapan Anda!');
    });

    render();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 7. SCROLL SPY FOR BOTTOM NAV
function initScrollSpy() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const sections = document.querySelectorAll('main section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 250;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}
