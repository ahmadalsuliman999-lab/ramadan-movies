const API_KEY = 'AIzaSyDujGRtJBrAsca9biIgCKYpIcY1B33QeVo';
const MAIN_FOLDER_ID = '1bA3qu0KzniD6e_JL72ofjVHCMzgPlfWE';
let navigationHistory = []; 

// 1. فتح واجهة الدروس
function openLessons() {
    navigationHistory = []; 
    document.getElementById('dashboard-view').style.display = 'none';
    const contentViewer = document.getElementById('content-viewer');
    contentViewer.style.display = 'block';

    // بناء الصفحة: العنوان -> المربعات -> الزر في الأسفل
    contentViewer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 id="folder-title" style="font-family:'Tajawal'; color:var(--primary-red);">المكتبة التعليمية</h2>
        </div>

        <ul id="file-list" class="lessons-grid"></ul>

        <div class="bottom-nav">
            <button onclick="handleBackAction()" class="back-btn-pulse">
                عودة <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;

    loadFiles(MAIN_FOLDER_ID, "المكتبة التعليمية");
}

// 2. دالة العودة الذكية
function handleBackAction() {
    if (navigationHistory.length > 0) {
        const prevFolder = navigationHistory.pop();
        loadFiles(prevFolder.id, prevFolder.name);
    } else {
        goHomeFromLessons();
    }
}

// 3. جلب الملفات وبناء الكروت
async function loadFiles(fId, folderName) {
    const list = document.getElementById('file-list');
    const folderTitle = document.getElementById('folder-title');
    
    if(folderTitle) folderTitle.innerText = folderName;
    list.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:50px;"><i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--primary-red);"></i></div>';

    try {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files?q='${fId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType)&key=${API_KEY}`);
        const data = await res.json();
        list.innerHTML = '';

        if (data.files && data.files.length > 0) {
            data.files.forEach(file => {
                const isFolder = file.mimeType.includes('folder');
                const icon = isFolder ? 'fa-folder-open' : 'fa-file-pdf';
                
                const li = document.createElement('li');
                li.className = 'file-item';
                li.innerHTML = `<i class="fas ${icon}"></i><span>${file.name}</span>`;
                
                li.onclick = () => {
                    if (isFolder) {
                        navigationHistory.push({id: fId, name: folderName});
                        loadFiles(file.id, file.name);
                    } else {
                        openFileFullScreen(file.id, file.name);
                    }
                };
                list.appendChild(li);
            });
        } else {
            list.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">لا توجد ملفات حالياً.</p>';
        }
    } catch (e) {
        list.innerHTML = '<p>خطأ في جلب البيانات</p>';
    }
}

// 4. عرض الملف بملء الشاشة
function openFileFullScreen(id, name) {
    const fullViewer = document.getElementById('full-viewer');
    const iframe = document.getElementById('file-iframe');
    const title = document.getElementById('viewing-file-name');
    
    if (fullViewer && iframe) {
        title.innerText = name;
        iframe.src = `https://drive.google.com/file/d/${id}/preview`;
        fullViewer.style.display = 'flex';
    }
}

// 5. إغلاق العرض والعودة للرئيسية
function closeFullScreen() {
    document.getElementById('file-iframe').src = "";
    document.getElementById('full-viewer').style.display = 'none';
}

function goHomeFromLessons() {
    document.getElementById('content-viewer').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'grid';
}