// الرابط الخاص بجدول البيانات
const GAME_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8z8lCsfP1PjXUuYFSS00kHwxD5p_tOwMqnLwbK5QOZGw50UksSJDs0FtiJGMZbx8uioTl9OpHCjC8/pub?output=csv";

let allQuestions = [];
let currentQIndex = 0;
let userAnswers = []; 

async function openExams() {
    currentQIndex = 0;
    userAnswers = []; 
    
    // إخفاء الشاشة الرئيسية وإظهار صندوق الاختبار
    document.getElementById('dashboard-view').style.display = 'none';
    const container = document.getElementById('contact-box');
    container.style.display = 'block';
    
    container.innerHTML = `
        <div class="exams-container" style="text-align:center; padding: 50px;">
            <i class="fas fa-spinner fa-spin" style="font-size:3rem; color:var(--primary-red);"></i>
            <p style="margin-top:15px; font-family:'Tajawal';">جاري تحميل الأسئلة الذكية...</p>
        </div>`;

    try {
        const response = await fetch(GAME_CSV_URL);
        const text = await response.text();
        const rows = text.split('\n').slice(1); 

        allQuestions = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, '').trim());
            return {
                question: cols[0],
                options: [cols[1], cols[2], cols[3], cols[4]],
                correct: parseInt(cols[5]) 
            };
        }).filter(q => q.question);

        showQuestion();
    } catch (error) {
        container.innerHTML = "<div class='exams-container'><h3>حدث خطأ في تحميل الأسئلة.</h3></div>";
    }
}

function showQuestion() {
    const container = document.getElementById('contact-box');
    
    if (currentQIndex >= allQuestions.length) {
        showFinalTable();
        return;
    }

    const q = allQuestions[currentQIndex];
    let optionsHtml = "";
    
    q.options.forEach((opt, index) => {
        if(opt) {
            const isSelected = userAnswers[currentQIndex] === (index + 1) ? 'background-color: #eaddca; border: 2px solid var(--primary-red);' : '';
            optionsHtml += `
                <button class="exam-option-btn" style="${isSelected}" onclick="recordAnswer(${index + 1})">
                    <span class="opt-number">${index + 1}</span>
                    <span class="opt-text">${opt}</span>
                </button>`;
        }
    });

    container.innerHTML = `
        <div class="exams-container fade-in">
            <div class="exam-progress">سؤال ${currentQIndex + 1} من ${allQuestions.length}</div>
            <h2 class="exam-question-text">${q.question}</h2>
            <div class="options-grid">${optionsHtml}</div>
            
            <div class="quiz-nav-buttons" style="display: flex; justify-content: center; gap: 15px; margin-top: 25px;">
                <button onclick="prevQuestion()" class="back-btn-exams" style="padding: 10px 20px; border-radius:12px; ${currentQIndex === 0 ? 'opacity:0.5; cursor:not-allowed;' : ''}">
                    <i class="fas fa-arrow-right"></i> السابق
                </button>
                
                <button onclick="nextQuestion()" class="back-btn-exams" style="padding: 10px 20px; border-radius:12px; background: var(--primary-red); color: white;">
                    التالي <i class="fas fa-arrow-left"></i>
                </button>
            </div>

            <div style="text-align:center; margin-top:30px;">
                <button onclick="goHome()" style="background:#eee; border:none; padding:8px 20px; border-radius:50px; color:#666; cursor:pointer;">
                   <i class="fas fa-times"></i> إنهاء والعودة للرئيسية
                </button>
            </div>
        </div>`;
}

function recordAnswer(choice) {
    userAnswers[currentQIndex] = choice;
    setTimeout(() => {
        nextQuestion();
    }, 300);
}

function nextQuestion() {
    if (currentQIndex < allQuestions.length - 1) {
        currentQIndex++;
        showQuestion();
    } else {
        showFinalTable();
    }
}

function prevQuestion() {
    if (currentQIndex > 0) {
        currentQIndex--;
        showQuestion();
    }
}

function showFinalTable() {
    const container = document.getElementById('contact-box');
    let correctCount = 0;
    let tableRows = "";
    
    allQuestions.forEach((q, i) => {
        const studentChoice = userAnswers[i];
        const isCorrect = studentChoice === q.correct;
        if(isCorrect) correctCount++;

        const studentAnswerText = q.options[studentChoice - 1] || "لم يتم الإجابة";
        const correctAnswerText = q.options[q.correct - 1];

        tableRows += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding:15px; text-align:right;">${q.question}</td>
                <td style="padding:15px; color:${isCorrect ? '#27ae60' : '#e74c3c'}; font-weight:bold;">
                    ${studentAnswerText}
                </td>
                <td style="padding:15px; color:#27ae60; font-weight:bold;">
                    ${correctAnswerText}
                </td>
            </tr>`;
    });

    const finalResult = Math.round((correctCount / allQuestions.length) * 100);

    container.innerHTML = `
        <div class="exams-container" style="max-width:900px; max-height:85vh; overflow-y:auto;">
            <h2 style="text-align:center; color:var(--primary-red);">📊 تقرير النتيجة النهائي</h2>
            <div style="text-align:center; font-size:2.5rem; font-weight:bold; margin:20px 0; color:#333;">
                الدرجة: ${finalResult}%
            </div>
            
            <table style="width:100%; border-collapse: collapse; direction:rtl; text-align:right;">
                <thead style="background:#f9f9f9;">
                    <tr>
                        <th style="padding:15px;">السؤال</th>
                        <th style="padding:15px;">إجابتك</th>
                        <th style="padding:15px;">الإجابة الصحيحة</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>

            <div style="text-align:center; margin-top:30px;">
                <button onclick="goHome()" class="back-btn-exams" style="padding:15px 40px; border-radius:50px;">العودة للرئيسية 🏠</button>
            </div>
        </div>`;
}

// الدالة المعدلة لمنع الشاشة البيضاء
function goHome() {
    resetDisplay(); // تنظيف شامل (سيخفي الاختبارات والدروس وأي شيء آخر)
    document.getElementById('dashboard-view').style.display = 'grid';
    
    currentQIndex = 0;
    userAnswers = [];
    
    // تفعيل زر الرئيسية في الهيدر
    const navLinks = document.querySelectorAll('.nav-link');
    if(navLinks[0]) navLinks[0].classList.add('active');
}