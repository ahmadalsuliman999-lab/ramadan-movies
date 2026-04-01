
// تنظيف الشاشة
function resetDisplay() {
    // قائمة بكل المعرفات (IDs) الموجودة في ملف HTML الخاص بكِ
    const ids = ['dashboard-view', 'content-viewer', 'contact-box', 'quiz-section', 'full-viewer'];
    
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            // تنظيف أي ملف مفتوح في الخلفية
            if (id === 'full-viewer') {
                const iframe = document.getElementById('file-iframe');
                if (iframe) iframe.src = "";
            }
        }
    });

    // إعادة التمرير للوضع الطبيعي ومنع التداخل
    document.body.style.overflow = 'auto';

    // إزالة اللون الأحمر من أزرار التنقل العلوية
    document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));
}

function setActive(index) {
    const btns = document.querySelectorAll('.nav-link');
    if (btns[index]) btns[index].classList.add('active');
}

// العودة للرئيسية
function goHome(index) {
    resetDisplay();
    setActive(index);
    document.getElementById('dashboard-view').style.display = 'grid';
}

// فتح الدروس
function openLessons() {
    resetDisplay();
    document.getElementById('content-viewer').style.display = 'flex';
    document.getElementById('main-viewer').style.display = 'block';
    loadFiles(FOLDER_ID);
}



// صفحة التواصل
// ابحث عن هذه الدالة في ملف script.js وقم بتعديل ما بين علامات ``
function showContact(index) {
    resetDisplay();
    setActive(index);
    const box = document.getElementById('contact-box');
    box.style.display = 'grid';
    box.innerHTML = `
        <div class="dash-card about-card" style="grid-column: 1/-1;">
            <div class="card-icon"><i class="fas fa-envelope-open-text"></i></div>
            <h2>تواصل معي مباشرة</h2>
            <p>يسعدني استقبال استفساراتكم عبر الوسائل التالية:</p>
            
            <div style="display:flex; gap:30px; margin-top:20px; font-size:1.5rem;">
                <a href="https://wa.me/966500000000" target="_blank" style="color:#25D366">
                    <i class="fab fa-whatsapp"></i>
                </a>
                
                <a href="mailto:monira@example.com" style="color:#d32f2f">
                    <i class="fas fa-at"></i>
                </a>

                <a href="https://t.me/YourUsername" target="_blank" style="color:#0088cc">
                    <i class="fab fa-telegram"></i>
                </a>
            </div>
        </div>
    `;}

function showAboutMe(index) {
    resetDisplay();
    setActive(index);
    
    let aboutBox = document.getElementById('contact-box');
    if (!aboutBox) {
        aboutBox = document.createElement('div');
        aboutBox.id = 'contact-box';
        aboutBox.className = 'dashboard-grid';
        document.querySelector('.app-content').appendChild(aboutBox);
    }
    
    aboutBox.style.display = 'grid';
    aboutBox.innerHTML = `
        <div style="grid-column: 1/-1; background: var(--white); padding: 40px; border-radius: 20px; border: 4px solid #eaddca; text-align: right; cursor: default; box-shadow: var(--shadow); max-width: 800px; margin: 0 auto;">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 3.5rem; color: var(--primary-red); margin-bottom: 15px;"><i class="fas fa-user-graduate"></i></div>
                <h2 style="font-size: 2rem; color: var(--text-dark); border-bottom: 2px solid #eaddca; display: inline-block; padding-bottom: 10px;">المعلمة منيرة عاصي</h2>
            </div>

            <div style="display: grid; gap: 20px;">
                <div style="line-height: 1.8;">
                    <p style="font-size: 1.2rem; color: var(--primary-red); font-weight: bold; margin-bottom: 5px;"><i class="fas fa-id-card"></i> نبذة تعريفية:</p>
                    <p style="color: var(--text-light);">مدرسة لغة إنجليزية متخصصة، أؤمن بأن التعليم رسالة سامية تهدف لبناء جيل مثقف ومتمكن لغوياً.</p>
                </div>

                <div style="line-height: 1.8;">
                    <p style="font-size: 1.2rem; color: var(--primary-red); font-weight: bold; margin-bottom: 5px;"><i class="fas fa-star"></i> الخبرات المهنية:</p>
                    <p style="color: var(--text-light);">• خبيرة في تبسيط القواعد وتطوير مهارات المحادثة بأساليب تفاعلية مبتكرة.<br>• تقديم دورات تقوية متخصصة لرفع كفاءة الطلاب الأكاديمية.</p>
                </div>
                   <div style="line-height: 1.8;">
                    <p style="font-size: 1.2rem; color: var(--primary-red); font-weight: bold; margin-bottom: 5px;"><i class="fas fa-star"></i> الخبرات المهنية:</p>
                    <p style="color: var(--text-light);">• خبيرة في تبسيط القواعد وتطوير مهارات المحادثة بأساليب تفاعلية مبتكرة.<br>• تقديم دورات تقوية متخصصة لرفع كفاءة الطلاب الأكاديمية.</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 40px;">
                <button onclick="goHome(0)" 
                    onmouseover="this.style.backgroundColor='var(--dark-red)'; this.style.transform='scale(1.1)';" 
                    onmouseout="this.style.backgroundColor='var(--primary-red)'; this.style.transform='scale(1)';"
                    style="cursor: pointer; padding: 12px 40px; border-radius: 50px; border: none; font-family: inherit; font-size: 1.1rem; transition: 0.3s; background-color: var(--primary-red); color: white; display: inline-flex; align-items: center; gap: 10px; font-weight: bold;">
                    <i class="fas fa-arrow-right"></i> عودة للرئيسية
                </button>
            </div>
        </div>
    `;
}


window.onload = () => goHome(0);