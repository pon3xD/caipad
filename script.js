class DontPad {
    constructor() {
        this.homePage = document.getElementById('homePage');
        this.editorPage = document.getElementById('editorPage');
        this.padNameInput = document.getElementById('padNameInput');
        this.goButton = document.getElementById('goButton');
        this.homeButton = document.getElementById('homeButton');
        this.currentPadName = document.getElementById('currentPadName');
        this.textarea = document.getElementById('notepad');
        this.charCount = document.getElementById('charCount');
        this.saveIndicator = document.getElementById('saveIndicator');
        this.themeToggle = document.getElementById('themeToggle');
        
        this.notes = {};
        this.currentPad = null;
        this.saveTimeout = null;
        this.isDarkMode = false;
        
        this.init();
    }

    init() {
        this.loadTheme();
        this.bindEvents();
        this.checkUrlOnLoad();
    }

    loadTheme() {
        // Carrega o tema salvo ou usa o padrão
        const savedTheme = this.getStoredTheme();
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
            this.applyTheme();
        }
    }

    getStoredTheme() {
        // Simula localStorage usando uma variável
        return this.storedTheme || 'light';
    }

    setStoredTheme(theme) {
        // Simula localStorage usando uma variável
        this.storedTheme = theme;
    }

    applyTheme() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            this.themeToggle.textContent = '☀️ modo direitos';
        } else {
            document.body.classList.remove('dark-mode');
            this.themeToggle.textContent = '🌙 modo amora';
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.setStoredTheme(this.isDarkMode ? 'dark' : 'light');
    }

    bindEvents() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Go button click
        this.goButton.addEventListener('click', () => {
            this.goToPad();
        });

        // Enter key in input
        this.padNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.goToPad();
            }
        });

        // Home button click
        this.homeButton.addEventListener('click', () => {
            this.goHome();
        });

        // Textarea input
        this.textarea.addEventListener('input', () => {
            this.updateStats();
            this.autoSave();
        });

        // Tab key support
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.textarea.selectionStart;
                const end = this.textarea.selectionEnd;
                this.textarea.value = this.textarea.value.substring(0, start) + 
                    '    ' + this.textarea.value.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
                this.updateStats();
                this.autoSave();
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.checkUrlOnLoad();
        });
    }

    checkUrlOnLoad() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.openPad(hash);
        } else {
            this.showHomePage();
        }
    }

    goToPad() {
        const padName = this.padNameInput.value.trim();
        if (padName) {
            this.openPad(padName);
            // Update URL
            window.history.pushState({}, '', `#${padName}`);
        }
    }

    openPad(padName) {
        this.currentPad = padName;
        this.currentPadName.textContent = padName;
        this.showEditorPage();
        this.loadNotes();
        this.updateStats();
        this.textarea.focus();
    }

    goHome() {
        this.currentPad = null;
        this.showHomePage();
        this.padNameInput.value = '';
        this.padNameInput.focus();
        // Update URL
        window.history.pushState({}, '', window.location.pathname);
    }

    showHomePage() {
        this.homePage.style.display = 'flex';
        this.editorPage.style.display = 'none';
        document.title = 'CAIPAD - so pa informiticos';
    }

    showEditorPage() {
        this.homePage.style.display = 'none';
        this.editorPage.style.display = 'flex';
        document.title = `CAIPAD - ${this.currentPad}`;
    }

    loadNotes() {
        const savedNotes = this.notes[this.currentPad];
        if (savedNotes) {
            this.textarea.value = savedNotes;
        } else {
            this.textarea.value = '';
        }
    }

    updateStats() {
        const text = this.textarea.value;
        const chars = text.length;
        this.charCount.textContent = `${chars} personagen${chars !== 1 ? 's' : ''}`;
    }

    autoSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveNotes();
        }, 500);
    }

    saveNotes() {
        if (this.currentPad) {
            this.notes[this.currentPad] = this.textarea.value;
            this.showSaveIndicator();
        }
    }

    showSaveIndicator() {
        this.saveIndicator.classList.add('show');
        setTimeout(() => {
            this.saveIndicator.classList.remove('show');
        }, 2000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DontPad();
});

// Focus on input when page loads
window.addEventListener('load', () => {
    const padNameInput = document.getElementById('padNameInput');
    if (padNameInput && padNameInput.offsetParent !== null) {
        padNameInput.focus();
    }
});

// Teste simples
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollImage = document.getElementById('scrollImage');
    
    console.log('Scroll:', scrollY); // Para debug
    
    if (scrollY > 500) { // Simples: depois de 500px de scroll
        scrollImage.classList.add('show');
    } else {
        scrollImage.classList.remove('show');
    }
});