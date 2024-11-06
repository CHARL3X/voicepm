/**
 * UI Handler Module
 * Manages all DOM event listeners and UI interactions
 */
export class UIHandler {
    constructor(voicePM) {
        this.voicePM = voicePM;
        this.initializeEventListeners();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        this.setupFormatCards();
        this.setupFileHandling();
        this.setupUploadArea();
        console.log('Event listeners initialized');
    }

    /**
     * Set up format selection card interactions
     */
    setupFormatCards() {
        const formatCards = document.querySelectorAll('.format-card');
        console.log('Found format cards:', formatCards.length);
        
        formatCards.forEach(card => {
            if (!card.classList.contains('coming-soon')) {
                card.addEventListener('click', (e) => {
                    console.log('Card clicked:', card.dataset.format);
                    e.preventDefault();
                    e.stopPropagation();
                    this.voicePM.handleFormatSelect(card);
                });
                
                this.addCardHoverEffects(card);
            }
        });
    }

    /**
     * Add hover effects to format cards
     */
    addCardHoverEffects(card) {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = 'var(--shadow-lg), var(--glow)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
    }

    /**
     * Set up file upload handling
     */
    setupFileHandling() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.voicePM.elements.uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.voicePM.elements.uploadArea.addEventListener(eventName, () => this.highlight(), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.voicePM.elements.uploadArea.addEventListener(eventName, () => this.unhighlight(), false);
        });

        this.voicePM.elements.uploadArea.addEventListener('drop', (e) => this.voicePM.handleDrop(e), false);
        this.voicePM.elements.uploadArea.addEventListener('click', () => this.voicePM.elements.fileInput.click());
        this.voicePM.elements.fileInput.addEventListener('change', (e) => this.voicePM.handleFileSelect(e));
    }

    /**
     * Set up upload area interactions
     */
    setupUploadArea() {
        this.voicePM.elements.uploadArea.addEventListener('mouseenter', () => {
            if (this.voicePM.currentStep === 2) {
                const icon = this.voicePM.elements.uploadArea.querySelector('.upload-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) translateY(-5px)';
                    icon.style.filter = 'drop-shadow(0 0 10px rgba(109, 90, 255, 0.3))';
                }
            }
        });
        
        this.voicePM.elements.uploadArea.addEventListener('mouseleave', () => {
            const icon = this.voicePM.elements.uploadArea.querySelector('.upload-icon');
            if (icon) {
                icon.style.transform = 'scale(1) translateY(0)';
                icon.style.filter = 'none';
            }
        });
    }

    /**
     * Prevent default drag and drop behaviors
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Highlight upload area during drag
     */
    highlight() {
        if (this.voicePM.currentStep === 2) {
            this.voicePM.elements.uploadArea.classList.add('dragover');
            const icon = this.voicePM.elements.uploadArea.querySelector('.upload-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) translateY(-10px)';
                icon.style.filter = 'drop-shadow(0 0 15px rgba(109, 90, 255, 0.4))';
                icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        }
    }

    /**
     * Remove highlight from upload area
     */
    unhighlight() {
        this.voicePM.elements.uploadArea.classList.remove('dragover');
        const icon = this.voicePM.elements.uploadArea.querySelector('.upload-icon');
        if (icon) {
            icon.style.transform = 'scale(1) translateY(0)';
            icon.style.filter = 'none';
        }
    }

    /**
     * Clean up event listeners
     */
    destroy() {
        if (this.voicePM.elements.uploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.voicePM.elements.uploadArea.removeEventListener(eventName, this.preventDefaults);
                document.body.removeEventListener(eventName, this.preventDefaults);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                this.voicePM.elements.uploadArea.removeEventListener(eventName, this.highlight);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                this.voicePM.elements.uploadArea.removeEventListener(eventName, this.unhighlight);
            });
        }
    }
}
