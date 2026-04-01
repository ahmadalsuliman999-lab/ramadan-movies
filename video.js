// بيانات الربط (تأكدي من صحتها)
const VIDEO_FOLDER_ID = '1Ov772z-ZkrFhOsUmHuClkIN0cgdwGxFY';
const VIDEO_API_KEY = 'AIzaSyDujGRtJBrAsca9biIgCKYpIcY1B33QeVo'; 

// هذه هي الدالة التي يستدعيها الكرت الخارجي
async function openVideos() {
    console.log("تم الضغط على كرت الفيديوهات"); // للتأكد من الاستجابة في وحدة التحكم

    // 1. إخفاء العناصر الأخرى (تأكدي أن دالة resetDisplay موجودة في script.js)
    if (typeof resetDisplay === "function") {
        resetDisplay();
    } else {
        // إذا لم تكن موجودة، سنخفي الأقسام يدوياً
        const sections = document.querySelectorAll('.content-section, #contact-box');
        sections.forEach(s => s.style.display = 'none');
    }
    
    const container = document.getElementById('contact-box');
    if (!container) {
        alert("لم يتم العثور على حاوية عرض المحتوى (contact-box)");
        return;
    }

    // 2. إظهار واجهة مكتبة الفيديوهات
    container.style.display = 'block';
    container.innerHTML = `
        <div class="video-container fade-in">
            <div class="video-header" style="text-align:center; margin-bottom:30px;">
                <i class="fas fa-play-circle" style="font-size: 3rem; color: #d32f2f;"></i>
                <h2 style="margin-top:10px;">مكتبة الفيديوهات التعليمية</h2>
            </div>
            <div id="dynamic-video-grid" class="video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                <p style="text-align:center; grid-column: 1/-1;">جاري جلب الفيديوهات من المجلد...</p>
            </div>
            <div style="text-align:center; margin-top:40px;">
                <button onclick="goHome(0)" style="background:#d32f2f; color:white; border:none; padding:12px 40px; border-radius:50px; cursor:pointer; font-family:inherit;">العودة للرئيسية</button>
            </div>
        </div>
    `;

    // 3. استدعاء جلب الفيديوهات
    fetchProtectedVideos();
}

async function fetchProtectedVideos() {
    const grid = document.getElementById('dynamic-video-grid');
    const url = `https://www.googleapis.com/drive/v3/files?q='${VIDEO_FOLDER_ID}'+in+parents+and+trashed=false&fields=files(id,name,thumbnailLink)&key=${VIDEO_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.files && data.files.length > 0) {
            grid.innerHTML = ''; 
            data.files.forEach(file => {
                let parts = file.name.split('-'); 
                let videoTitle = parts[0].trim();
                let videoPass = parts[1] ? parts[1].trim() : null;
                let thumb = file.thumbnailLink ? file.thumbnailLink.replace('s220', 's640') : 'https://via.placeholder.com/640x360?text=Locked';

                grid.innerHTML += `
                    <div class="video-card-item" style="background:#fff; border-radius:15px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                        <div style="position:relative; padding-bottom:56.25%; height:0; background:#000;">
                            <img src="${thumb}" style="position:absolute; width:100%; height:100%; object-fit:cover; filter: blur(2px) brightness(0.6);">
                            <div id="overlay-${file.id}" onclick="unlockVideo('${file.id}', '${videoPass}')" 
                                 style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:rgba(0,0,0,0.3); z-index:2;">
                                <i class="fas fa-lock" style="font-size:2rem; color:#fff;"></i>
                                <span style="color:#fff; font-size:0.8rem; margin-top:5px;">اضغطي للفتح</span>
                            </div>
                            <iframe id="iframe-${file.id}" src="" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none; display:none; z-index:1;" allowfullscreen></iframe>
                        </div>
                        <div style="padding:10px; text-align:center;"><h3>${videoTitle}</h3></div>
                    </div>`;
            });
        }
    } catch (e) { grid.innerHTML = "حدث خطأ في الاتصال."; }
}
function unlockVideo(fileId, correctPass) {
    // 1. إذا لم يكن هناك رمز، افتحي الفيديو فوراً
    if (!correctPass || correctPass === "undefined" || correctPass === "null") {
        showVideo(fileId);
        return;
    }

    // 2. تنظيف الرمز المطلوب (حذف المسافات)
    let cleanCorrectPass = correctPass.trim();

    // 3. طلب الرمز من الطالب
    let userPass = prompt("هذا الفيديو محمي. يرجى إدخال الرمز الصحيح:");

    // إذا ضغط إلغاء، نخرج من الدالة
    if (userPass === null) return;

    // 4. التحقق من المطابقة
    if (userPass.trim() === cleanCorrectPass) {
        // الرمز صحيح -> استدعاء دالة الإظهار
        showVideo(fileId);
    } else {
        // الرمز خطأ -> تنبيه وإعادة محاولة (استدعاء الدالة لنفسها)
        alert("الرمز غير صحيح! حاول مرة أخرى.");
        unlockVideo(fileId, correctPass); 
    }
}

function showVideo(fileId) {
    // البحث عن العناصر
    const overlay = document.getElementById(`overlay-${fileId}`);
    const iframe = document.getElementById(`iframe-${fileId}`);

    if (overlay && iframe) {
        // إخفاء القفل والصورة المصغرة
        overlay.style.setProperty('display', 'none', 'important');
        
        // إظهار مشغل الفيديو
        iframe.style.display = 'block';
        
        // تشغيل الفيديو من الرابط
        iframe.src = `https://drive.google.com/file/d/${fileId}/preview?autoplay=1`;
        
        console.log("تم فتح الفيديو بنجاح: " + fileId);
    } else {
        console.error("لم يتم العثور على عناصر الفيديو في الصفحة");
    }
}