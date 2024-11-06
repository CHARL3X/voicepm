import { ConstellationHandler } from './constellation-handler.js';

/**
 * FormatHandler Module
 * Manages output format selection and rendering
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
            },
            constellation: {
                main: 'Transform Conversations into Insights',
                sub: 'Upload a meeting recording to discover patterns and relationships'
            }
        };
        this.constellationHandler = new ConstellationHandler(voicePM);
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
        });
        selectedCard.classList.add('active');
    }

    /**
     * Update upload section text based on selected format
     */
    updateUploadText(format) {
        const formatText = this.formatTexts[format];
        if (!formatText) return;

        const mainText = document.querySelector('.upload-title');
        const subText = document.querySelector('.upload-subtitle');

        if (mainText) mainText.textContent = formatText.main;
        if (subText) subText.textContent = formatText.sub;
    }

    /**
     * Render the processed output in the selected format
     */
    renderOutput(data) {
        const outputContainer = document.querySelector('.output-container');
        if (!outputContainer) return;

        // Clear previous output
        outputContainer.innerHTML = '';

        try {
            let output;
            if (this.voicePM.selectedFormat === 'constellation') {
                output = this.constellationHandler.render(data);
            } else {
                // Handle other formats
                output = this.createDefaultOutput(data);
            }

            outputContainer.appendChild(output);

            // Initialize Feather icons
            if (window.feather) {
                window.feather.replace({
                    'stroke-width': 1.5,
                    width: 16,
                    height: 16
                });
            }

            this.voicePM.showStatus('Content processed successfully!', 'success');
        } catch (error) {
            console.error('Error rendering output:', error);
            outputContainer.innerHTML = `
                <div class="error-message">
                    <i data-feather="alert-circle"></i>
                    <p>Error rendering output. Please try again.</p>
                </div>
            `;
            this.voicePM.showStatus('Error processing content. Please try again.', 'error');
        }
    }

    /**
     * Create default output for other formats
     */
    createDefaultOutput(data) {
        const container = document.createElement('div');
        container.className = 'default-output';
        container.innerHTML = `
            <div class="output-content">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        return container;
    }

    /**
     * Check if current format is premium
     */
    isCurrentFormatPremium() {
        const premiumFormats = ['roadmap', 'process', 'constellation'];
        return premiumFormats.includes(this.voicePM.selectedFormat);
    }
}
