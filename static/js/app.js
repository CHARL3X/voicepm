/**
 * VoicePM Application
 * Core application logic for voice-to-structured-content transformation
 */
class VoicePM {
    constructor() {
        this.selectedFormat = null;
        this.currentStep = 1;
        this.isDemoMode = false;
        this.formatHandler = null;
        this.audioHandler = null;
        this.initialize();
    }

    initialize() {
        this.setupFormatHandler();
        this.setupAudioHandler();
        this.setupEventListeners();
        this.checkDemoMode();
    }

    setupFormatHandler() {
        this.formatHandler = new FormatHandler(this);
        this.setupFormatCards();
    }

    setupAudioHandler() {
        this.audioHandler = new AudioHandler(this);
    }

    setupFormatCards() {
        const formatContainer = document.querySelector('.format-cards');
        if (!formatContainer) return;

        const formats = [
            {
                type: 'tasks',
                title: 'Task Lists',
                description: 'Convert voice memos into clear, actionable task lists',
                features: [
                    'Prioritized tasks',
                    'Context preservation',
                    'Clear organization',
                    'Action tracking'
                ],
                preview: '/static/images/task-preview.svg'
            },
            {
                type: 'roadmap',
                title: 'Strategic Roadmaps',
                description: 'Transform voice notes into comprehensive project roadmaps',
                features: [
                    'Timeline visualization',
                    'Resource planning',
                    'Milestone tracking',
                    'Risk assessment'
                ],
                preview: '/static/images/roadmap-preview.svg',
                pro: true
            },
            {
                type: 'process',
                title: 'Process Documentation',
                description: 'Create detailed process documentation from voice explanations',
                features: [
                    'Step-by-step guides',
                    'Prerequisite mapping',
                    'Outcome tracking',
                    'Resource links'
                ],
                preview: '/static/images/process-preview.svg',
                pro: true
            },
            {
                type: 'constellation',
                title: 'Constellation Format',
                description: 'Transform conversations into interconnected insights with pattern recognition',
                features: [
                    'Pattern recognition',
                    'Relationship mapping',
                    'Sentiment analysis',
                    'Decision flow tracking'
                ],
                preview: '/static/images/constellation-preview.svg',
                pro: true
            }
        ];

        formats.forEach(format => {
            const card = this.createFormatCard(format);
            formatContainer.appendChild(card);
        });

        // Initialize Feather icons
        if (window.feather) {
            window.feather.replace({
                'stroke-width': 1.5,
                width: 16,
                height: 16
            });
        }
    }

    createFormatCard(format) {
        const card = document.createElement('div');
        card.className = `format-card${format.pro ? ' pro' : ''}`;
        card.dataset.format = format.type;

        card.innerHTML = `
            <div class="format-preview">
                <img src="${format.preview}" alt="${format.title} Preview" loading="lazy">
                ${format.pro ? '<div class="pro-badge">PRO</div>' : ''}
            </div>
            <div class="format-content">
                <h3>${format.title}</h3>
                <p>${format.description}</p>
                <ul class="format-features">
                    ${format.features.map(feature => `
                        <li>
                            <i data-feather="check-circle"></i>
                            <span>${feature}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        card.addEventListener('click', () => {
            this.formatHandler.handleFormatSelect(card);
        });

        return card;
    }

    setupEventListeners() {
        // File upload handling
        const fileInput = document.getElementById('fileInput');
        const uploadZone = document.querySelector('.upload-zone');

        if (fileInput && uploadZone) {
            fileInput.addEventListener('change', (e) => {
                this.audioHandler.handleFiles(e.target.files);
            });

            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });

            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });

            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                this.audioHandler.handleFiles(e.dataTransfer.files);
            });

            uploadZone.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }

    checkDemoMode() {
        fetch('/health')
            .then(response => response.json())
            .then(data => {
                this.isDemoMode = data.mode === 'demo';
                this.updateModeBadge();
            })
            .catch(() => {
                this.isDemoMode = true;
                this.updateModeBadge();
            });
    }

    updateModeBadge() {
        const badge = document.getElementById('modeBadge');
        if (badge) {
            badge.className = `mode-badge ${this.isDemoMode ? 'demo' : 'live'}`;
            badge.innerHTML = `
                <i data-feather="${this.isDemoMode ? 'radio' : 'zap'}"></i>
                <span>${this.isDemoMode ? 'Demo Mode' : 'Live Mode'}</span>
            `;
            if (window.feather) {
                window.feather.replace({
                    'stroke-width': 1.5,
                    width: 16,
                    height: 16
                });
            }
        }
    }

    updateSteps(step) {
        this.currentStep = step;
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            if (index + 1 < step) {
                stepEl.classList.add('complete');
                stepEl.classList.remove('active');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
                stepEl.classList.remove('complete');
            } else {
                stepEl.classList.remove('complete', 'active');
            }
        });
    }

    showStatus(message, type = 'info') {
        const status = document.createElement('div');
        status.className = `status-message ${type}`;
        status.innerHTML = `
            <i data-feather="${this.getStatusIcon(type)}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(status);

        if (window.feather) {
            window.feather.replace({
                'stroke-width': 1.5,
                width: 16,
                height: 16
            });
        }

        setTimeout(() => {
            status.classList.add('show');
        }, 100);

        setTimeout(() => {
            status.classList.remove('show');
            setTimeout(() => {
                status.remove();
            }, 300);
        }, 3000);
    }

    getStatusIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || icons.info;
    }

    isProUser() {
        // TODO: Implement actual pro user check
        return false;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.voicePM = new VoicePM();
});
