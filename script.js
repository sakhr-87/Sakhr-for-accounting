let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let lastSubjectKey = "";
let lastChapterIndex = -1;
let quizState = 'main';
let userAnswers = [];

function handleBack(e) {
    if(e) e.preventDefault();
    if (quizState === 'review') {
        showFinalResultScreen();
    } else if (quizState === 'result' || quizState === 'quiz') {
        if (lastSubjectKey && quizzes[lastSubjectKey].isChapters) {
            showChaptersList(lastSubjectKey);
        } else {
            window.location.href = 'index.html';
        }
    } else if (quizState === 'chapters') {
        window.location.href = 'index.html';
    } else {
        window.location.href = 'index.html';
    }
}

function searchFiles() {
    var input = document.getElementById('search-input');
    if (!input) return;
    var filter = input.value.toLowerCase();
    var fileRows = document.querySelectorAll('.file-row');
    var body = document.body;
    var sections = document.querySelectorAll('.subject-section');
    if (filter.length > 0) {
        if(body.classList) body.classList.add('archive-mode');
        if(document.getElementById('no-selection-msg')) document.getElementById('no-selection-msg').style.display = 'none';
        sections.forEach(s => s.style.display = 'block');
        fileRows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(filter) ? "flex" : "none";
        });
    } else {
        showSection();
    }
}

function showSection() {
    var sections = document.querySelectorAll('.subject-section');
    if (sections.length > 0) {
        var hash = window.location.hash.substring(1);
        var body = document.body;
        var searchContainer = document.querySelector('.search-container');
        body.classList.remove('archive-mode');
        if (searchContainer) searchContainer.style.display = 'none';
        if(document.getElementById('search-input')) document.getElementById('search-input').value = '';
        if (hash === 'all') {
            if (searchContainer) searchContainer.style.display = 'block';
            body.classList.add('archive-mode');
            sections.forEach(s => s.style.display = 'block');
            document.querySelectorAll('.file-row').forEach(r => r.style.display = "flex");
            if(document.getElementById('no-selection-msg')) document.getElementById('no-selection-msg').style.display = 'none';
        } 
        else if (hash && document.getElementById(hash)) {
            sections.forEach(s => s.style.display = 'none');
            document.getElementById(hash).style.display = 'block';
            document.getElementById(hash).querySelectorAll('.file-row').forEach(r => r.style.display = "flex");
            if(document.getElementById('no-selection-msg')) document.getElementById('no-selection-msg').style.display = 'none';
        } 
        else {
            sections.forEach(s => s.style.display = 'none');
            if(document.getElementById('no-selection-msg')) document.getElementById('no-selection-msg').style.display = 'block';
        }
    }
    if (window.location.pathname.includes('selftest.html')) {
        var hash = window.location.hash.substring(1);
        if (hash && quizzes[hash]) {
            lastSubjectKey = hash;
            if (quizzes[hash].isChapters) {
                showChaptersList(hash);
            } else {
                startQuiz(hash);
            }
        } else {
            quizState = 'main';
            document.getElementById('start-screen').style.display = 'block';
            document.getElementById('quiz-screen').style.display = 'none';
            document.getElementById('result-screen').style.display = 'none';
            document.getElementById('review-screen').style.display = 'none';
            if(document.getElementById('chapters-list-screen')) document.getElementById('chapters-list-screen').style.display = 'none';
        }
    }
}

function showChaptersList(subjectKey) {
    quizState = 'chapters';
    var subjectData = quizzes[subjectKey];
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'none';
    document.getElementById('quiz-title').innerText = "اختر الفصل";
    var container = document.getElementById('chapters-list-screen');
    if (!container) {
        container = document.createElement('div');
        container.id = 'chapters-list-screen';
        container.className = 'quiz-wrapper';
        container.style.flexDirection = 'column';
        container.style.gap = '15px';
        document.querySelector('.quiz-wrapper').appendChild(container);
    }
    container.innerHTML = "";
    container.style.display = 'flex';
    subjectData.chapters.forEach((chapter, index) => {
        var card = document.createElement('div');
        card.className = 'quiz-card';
        card.style.textAlign = 'right';
        card.style.cursor = 'pointer';
        card.style.border = '1px solid #444';
        card.style.transition = '0.2s';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; color:#fff; font-size:16px;">${chapter.title}</h3>
            </div>
            <p style="color:#aaa; font-size:12px; margin-top:5px; margin-right:5px;">${chapter.description}</p>
        `;
        card.onclick = function() { startChapterQuiz(subjectKey, index); };
        card.onmouseover = function(){ this.style.borderColor = '#f39c12'; };
        card.onmouseout = function(){ this.style.borderColor = '#444'; };
        container.appendChild(card);
    });
}

function startChapterQuiz(subjectKey, chapterIndex) {
    var chapterData = quizzes[subjectKey].chapters[chapterIndex];
    if (chapterData.questions.length === 0) {
        alert("عذراً، أسئلة هذا الشابتر قيد التجهيز.");
        return;
    }
    lastSubjectKey = subjectKey;
    lastChapterIndex = chapterIndex;
    currentQuiz = shuffleArray([...chapterData.questions]);
    setupQuizUI(chapterData.title);
}

function startQuiz(subjectKey) {
    lastSubjectKey = subjectKey;
    lastChapterIndex = -1;
    currentQuiz = shuffleArray([...quizzes[subjectKey]]);
    setupQuizUI(subjectKey.toUpperCase());
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupQuizUI(titleText) {
    quizState = 'quiz';
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = new Array(currentQuiz.length).fill(null);
    if(document.getElementById('chapters-list-screen')) document.getElementById('chapters-list-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    document.getElementById('quiz-title').innerText = titleText;
    showQuestion();
}

function showQuestion() {
    let q = currentQuiz[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('question-count').innerText = `سؤال ${currentQuestionIndex + 1} من ${currentQuiz.length}`;
    let progress = ((currentQuestionIndex) / currentQuiz.length) * 100;
    document.getElementById('progress-fill').style.width = progress + "%";
    let optsDiv = document.getElementById('options-container');
    optsDiv.innerHTML = "";
    document.getElementById('next-btn').style.display = "none";
    q.options.forEach((opt, index) => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectOption(index, btn);
        optsDiv.appendChild(btn);
    });
}

function selectOption(selectedIndex, btn) {
    let options = document.querySelectorAll('.option-btn');
    options.forEach(opt => opt.classList.remove('selected'));
    btn.classList.add('selected');
    userAnswers[currentQuestionIndex] = selectedIndex;
    let nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = "block";
    if (currentQuestionIndex === currentQuiz.length - 1) {
        nextBtn.innerText = "إنهاء الاختبار";
        nextBtn.onclick = finishQuiz;
    } else {
        nextBtn.innerText = "السؤال التالي";
        nextBtn.onclick = () => {
            currentQuestionIndex++;
            showQuestion();
        };
    }
}

function finishQuiz() {
    score = 0;
    userAnswers.forEach((ans, index) => {
        if (ans === currentQuiz[index].correct) {
            score++;
        }
    });
    showFinalResultScreen();
}

function showFinalResultScreen() {
    quizState = 'result';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('quiz-title').innerText = "نتيجة الاختبار";
    let percentage = Math.round((score / currentQuiz.length) * 100);
    document.getElementById('final-score').innerText = `%${percentage}`;
    let title = document.getElementById('result-title');
    let msg = document.getElementById('result-message');
    let circle = document.querySelector('.score-circle');
    if (percentage >= 50) {
        title.innerText = "ناجح";
        title.style.color = "#2ecc71";
        msg.innerText = "لقد اجتزت الاختبار بنجاح.";
        circle.style.borderColor = "#2ecc71";
    } else {
        title.innerText = "راسب";
        title.style.color = "#e74c3c";
        msg.innerText = "حاول مرة أخرى لتحسين مستواك.";
        circle.style.borderColor = "#e74c3c";
    }
}

function reviewMistakes() {
    quizState = 'review';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('review-screen').style.display = 'block';
    let container = document.getElementById('review-list');
    container.innerHTML = "";
    currentQuiz.forEach((q, index) => {
        let userAnsIndex = userAnswers[index];
        let correctIndex = q.correct;
        let item = document.createElement('div');
        item.className = 'review-item';
        let html = `<div class="review-q">س${index+1}: ${q.question}</div>`;
        q.options.forEach((opt, optIndex) => {
            let className = 'review-a';
            let status = '';
            if (optIndex === correctIndex) {
                className += ' correct';
                status = ' (إجابة صحيحة)';
            }
            if (optIndex === userAnsIndex && userAnsIndex !== correctIndex) {
                className += ' wrong';
                status = ' (إجابتك)';
            }
            if (optIndex === userAnsIndex && userAnsIndex === correctIndex) {
                status = ' (إجابتك)';
            }
            html += `<div class="${className}">${opt}${status}</div>`;
        });
        item.innerHTML = html;
        container.appendChild(item);
    });
}

function restartCurrentQuiz() {
    if (lastSubjectKey !== "") {
        if (lastChapterIndex !== -1) {
            startChapterQuiz(lastSubjectKey, lastChapterIndex);
        } else {
            startQuiz(lastSubjectKey);
        }
    } else {
        window.location.reload();
    }
}

window.onload = showSection;
window.onhashchange = showSection;
