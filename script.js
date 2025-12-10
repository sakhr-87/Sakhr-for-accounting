function searchFiles() {
    var input = document.getElementById('search-input').value.toLowerCase();
    var fileRows = document.querySelectorAll('.file-row');
    var body = document.body;
    var sections = document.querySelectorAll('.subject-section');

    if (input.length > 0) {
        body.classList.add('archive-mode');
        document.getElementById('no-selection-msg').style.display = 'none';
        
        sections.forEach(function(section) {
            section.style.display = 'block';
        });

        fileRows.forEach(function(row) {
            var text = row.innerText.toLowerCase();
            if (text.includes(input)) {
                row.style.display = "flex";
            } else {
                row.style.display = "none";
            }
        });
    } else {
        showSection();
    }
}

function showSection() {
    var sections = document.querySelectorAll('.subject-section');
    var hash = window.location.hash.substring(1);
    var body = document.body;
    var searchContainer = document.querySelector('.search-container');
    var searchInput = document.getElementById('search-input');

    body.classList.remove('archive-mode');
    
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }

    if (hash === 'all') {
        if (searchContainer) {
            searchContainer.style.display = 'block';
        }
        
        body.classList.add('archive-mode');
        
        sections.forEach(function(section) {
            section.style.display = 'block';
        });
        
        var fileRows = document.querySelectorAll('.file-row');
        fileRows.forEach(function(row) { row.style.display = "flex"; });
        
        document.getElementById('no-selection-msg').style.display = 'none';
    } 
    else if (hash) {
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
        sections.forEach(function(section) {
            section.style.display = 'none';
        });
        document.getElementById('no-selection-msg').style.display = 'block';
    }
    
    if (searchInput && searchInput.value !== '') {
         searchInput.value = '';
    }
}

window.onload = showSection;
window.onhashchange = showSection;
