/**
 * Format Handler Module
 * Manages format selection and related UI updates
 */
export class FormatHandler {
    constructor(voicePM) {
        this.voicePM = voicePM;
        this.formatTexts = {
            tasks: {
                main: 'Start Your Productivity Revolution',
                sub: 'Drop your voice memo or click to upload (MP3, M4A, WAV supported)'
            },
            roadmap: {
                main: 'Create Your Strategic Roadmap',
                sub: 'Upload a voice memo describing your project vision and goals'
            },
            process: {
                main: 'Document Your Expert Knowledge',
                sub: 'Record your process explanation and let AI structure it perfectly'
            }
        };
    }

    /**
     * Handle format selection
     */
    handleFormatSelect(card) {
        const format = card.dataset.format;
        console.log('Handling format selection:', format);
        
        if (this.isProFeature(card)) {
            return;
        }

        this.voicePM.selectedFormat = format;
        this.updateFormatUI(card);
        this.updateUploadText(format);
        this.voicePM.updateSteps(2);
    }

    /**
     * Check if format is a pro feature and handle accordingly
     */
    isProFeature(card) {
        if (card.classList.contains('pro') && !this.voicePM.isProUser()) {
            console.log('Pro feature selected by non-pro user');
            this.voicePM.showStatus('This is a Pro feature. Upgrade to access.', 'warning');
            return true;
        }
        return false;
    }

    /**
     * Update UI for selected format
     */
    updateFormatUI(selectedCard) {
        document.querySelectorAll('.format-card').forEach(card => {
            card.classList.remove('active');
            card.style.transform = '';
            card.style.boxShadow = '';
            console.log('Removed active class from:', card.dataset.format);
        });
        
        selectedCard.classList.add('active');
        selectedCard.style.transform = 'translateY(-4px)';
        selectedCard.style.boxShadow = 'var(--shadow-lg), var(--glow)';
        console.log('Added active class to:', selectedCard.dataset.format);
    }

    /**
     * Update upload area text based on selected format
     */
    updateUploadText(format) {
        const uploadText = this.voicePM.elements.uploadArea.querySelector('.upload-text');
        const uploadSubtext = this.voicePM.elements.uploadArea.querySelector('.upload-subtext');
        
        if (this.formatTexts[format]) {
            uploadText.textContent = this.formatTexts[format].main;
            uploadSubtext.textContent = this.formatTexts[format].sub;
            console.log('Updated upload area text for format:', format);
        }
    }

    /**
     * Get button text based on format
     */
    getProcessButtonText(format) {
        const buttonTexts = {
            tasks: 'Extract Tasks',
            roadmap: 'Generate Roadmap',
            process: 'Create Documentation'
        };
        return buttonTexts[format] || 'Process Audio';
    }
}
