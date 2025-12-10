/* وظيفة البحث الذكي */
function searchFiles() {
    var input = document.getElementById('search-input').value.toLowerCase();
    var fileRows = document.querySelectorAll('.file-row');
    var sections = document.querySelectorAll('.subject-section');
    var body = document.body;

    if (input.length > 0) {
        // تفعيل وضع الأرشيف للبحث في كل الأقسام
        body.classList.add('archive-mode');
        document.getElementById('no-selection-msg').style.display = 'none';
        
        // إظهار جميع الأقسام
        sections.forEach(function(section) {
            section.style.display = 'block';
        });

        // فلترة الملفات
        fileRows.forEach(function(row) {
            var text = row.innerText.toLowerCase();
            if (text.includes(input)) {
                row.style.display = "flex";
            } else {
                row.style.display = "none";
            }
        });
    } else {
        // إذا مسح البحث، يرجع للوضع الطبيعي
        showSection();
    }
}

/* وظيفة التنقل بين الأقسام (الراوتر) */
function showSection() {
    var sections = document.querySelectorAll('.subject-section');
    var hash = window.location.hash.substring(1);
    var body = document.body;
    var input = document.getElementById('search-input');

    // إذا كان هناك نص في البحث، لا تغير العرض
    if (input && input.value.length > 0) return;

    // إزالة وضع الأرشيف
    body.classList.remove('archive-mode');

    if (hash === 'all') {
        // وضع عرض الكل
        body.classList.add('archive-mode');
        sections.forEach(function(section) {
            section.style.display = 'block';
        });
        var fileRows = document.querySelectorAll('.file-row');
        fileRows.forEach(function(row) { row.style.display = "flex"; });
        document.getElementById('no-selection-msg').style.display = 'none';
    } 
    else if (hash) {
        // وضع قسم محدد
        sections.forEach(function(section) {
            section.style.display = 'none';
        });
        var targetSection = document.getElementById(hash);
        if (targetSection) {
            targetSection.style.display = 'block';
            var fileRows = targetSection.querySelectorAll('.file-row');
            fileRows.forEach(function(row) { row.style.display = "flex"; });
            document.getElementById('no-selection-msg').style.display = 'none';
        }
    } 
    else {
        // الوضع الافتراضي (فارغ)
        sections.forEach(function(section) {
            section.style.display = 'none';
        });
        document.getElementById('no-selection-msg').style.display = 'block';
    }
}

// تشغيل الدوال عند التحميل وتغيير الرابط
window.onload = showSection;
window.onhashchange = showSection;

