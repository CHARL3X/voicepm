class VoicePM {
    constructor() {
        this.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:8000'
            : 'https://api.voxify.app';
        this.isBackendAvailable = false;
        this.isDemoMode = false;
        this.selectedFormat = 'tasks'; // Default format
        
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            status: document.getElementById('status'),
            audioList: document.getElementById('audioList'),
            modeBadge: document.getElementById('modeBadge'),
            formatSelector: document.getElementById('formatSelector')
        };
        
        // Debug log
        console.log('VoicePM initializing...');
        
        // Bind methods to preserve 'this' context
        this.handleFormatSelect = this.handleFormatSelect.bind(this);
        this.preventDefaults = this.preventDefaults.bind(this);
        this.highlight = this.highlight.bind(this);
        this.unhighlight = this.unhighlight.bind(this);
        
        this.initializeEventListeners();
        this.checkBackendHealth();
        this.initializeAnimations();
        
        // Debug log
        console.log('VoicePM initialized with format:', this.selectedFormat);
    }
    
    initializeEventListeners() {
        // Format selection handling
        const formatCards = document.querySelectorAll('.format-card');
        console.log('Found format cards:', formatCards.length);
        
        formatCards.forEach(card => {
            const format = card.dataset.format;
            console.log('Setting up listener for format:', format, 'coming soon:', card.classList.contains('coming-soon'));
            
            if (!card.classList.contains('coming-soon')) {
                // Add click listener with proper binding
                card.addEventListener('click', (e) => {
                    console.log('Card clicked:', format);
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleFormatSelect(card);
                });
                
                // Add hover effect
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
        });

        // Existing event listeners
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.elements.uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.elements.uploadArea.addEventListener(eventName, this.highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.elements.uploadArea.addEventListener(eventName, this.unhighlight, false);
        });

        this.elements.uploadArea.addEventListener('drop', (e) => this.handleDrop(e), false);
        this.elements.uploadArea.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Upload area hover effect
        this.elements.uploadArea.addEventListener('mouseenter', () => {
            const icon = this.elements.uploadArea.querySelector('.upload-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) translateY(-5px)';
                icon.style.filter = 'drop-shadow(0 0 10px rgba(109, 90, 255, 0.3))';
            }
        });
        
        this.elements.uploadArea.addEventListener('mouseleave', () => {
            const icon = this.elements.uploadArea.querySelector('.upload-icon');
            if (icon) {
                icon.style.transform = 'scale(1) translateY(0)';
                icon.style.filter = 'none';
            }
        });
        
        console.log('Event listeners initialized');
    }

    handleFormatSelect(card) {
        const format = card.dataset.format;
        console.log('Handling format selection:', format);
        
        // Check if trying to select a pro feature
        if (card.classList.contains('pro') && !this.isProUser()) {
            console.log('Pro feature selected by non-pro user');
            this.showProFeaturePrompt();
            return;
        }

        // Update selected format
        this.selectedFormat = format;
        console.log('Format updated to:', this.selectedFormat);

        // Update UI
        document.querySelectorAll('.format-card').forEach(c => {
            c.classList.remove('active');
            c.style.transform = '';
            c.style.boxShadow = '';
            console.log('Removed active class from:', c.dataset.format);
        });
        
        card.classList.add('active');
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = 'var(--shadow-lg), var(--glow)';
        console.log('Added active class to:', format);

        // Update upload area text based on format
        const uploadText = this.elements.uploadArea.querySelector('.upload-text');
        const uploadSubtext = this.elements.uploadArea.querySelector('.upload-subtext');
        
        const formatTexts = {
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

        if (formatTexts[format]) {
            uploadText.textContent = formatTexts[format].main;
            uploadSubtext.textContent = formatTexts[format].sub;
            console.log('Updated upload area text for format:', format);
        }
    }

    isProUser() {
        // Always return true for testing purposes
        return true;
    }

    showProFeaturePrompt() {
        this.showStatus('This is a Pro feature. Upgrade to access.', 'warning');
        
        // TODO: Show upgrade modal
        console.log('Show upgrade modal');
    }
    
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-card, .format-card').forEach(card => {
            observer.observe(card);
            card.classList.add('animate-on-scroll');
        });
    }
    
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    highlight() {
        this.elements.uploadArea.classList.add('dragover');
        const icon = this.elements.uploadArea.querySelector('.upload-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) translateY(-10px)';
            icon.style.filter = 'drop-shadow(0 0 15px rgba(109, 90, 255, 0.4))';
            icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }
    
    unhighlight() {
        this.elements.uploadArea.classList.remove('dragover');
        const icon = this.elements.uploadArea.querySelector('.upload-icon');
        if (icon) {
            icon.style.transform = 'scale(1) translateY(0)';
            icon.style.filter = 'none';
        }
    }
    
    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }
    
    handleFileSelect(e) {
        const files = e.target.files;
        this.handleFiles(files);
    }
    
    handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        if (!file.type.startsWith('audio/')) {
            this.showStatus('Please upload an audio file', 'error');
            return;
        }

        // Check if trying to use pro feature
        if (this.selectedFormat !== 'tasks' && !this.isProUser()) {
            this.showProFeaturePrompt();
            return;
        }

        this.showStatus('File uploaded successfully!', 'success');
        this.addAudioFile(file);
    }
    
    showStatus(message, type) {
        this.elements.status.textContent = message;
        this.elements.status.className = 'status ' + type;
        this.elements.status.classList.add('visible');
        
        if (type === 'error') {
            this.elements.status.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
            setTimeout(() => {
                this.elements.status.style.animation = '';
            }, 500);
        }
        
        setTimeout(() => {
            this.elements.status.classList.remove('visible');
            setTimeout(() => {
                this.elements.status.className = 'status';
                this.elements.status.textContent = '';
            }, 300);
        }, 3000);
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    addAudioFile(file) {
        const audioItem = document.createElement('div');
        audioItem.className = 'audio-item';
        audioItem.style.opacity = '0';
        audioItem.style.transform = 'translateY(20px)';
        
        const audioContent = document.createElement('div');
        audioContent.className = 'audio-content';
        
        const details = document.createElement('div');
        details.className = 'audio-details';
        details.innerHTML = `
            <div class="audio-name">${file.name}</div>
            <div class="audio-size">${this.formatFileSize(file.size)}</div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = URL.createObjectURL(file);
        
        const processButton = document.createElement('button');
        processButton.className = 'process-button';

        // Get format-specific button text
        const buttonText = {
            tasks: 'Extract Tasks',
            roadmap: 'Generate Roadmap',
            process: 'Create Documentation'
        }[this.selectedFormat] || 'Process Audio';

        processButton.innerHTML = `
            <i data-feather="cpu"></i>
            <span>${buttonText}</span>
        `;
        processButton.onclick = () => this.processAudio(file, audioItem, processButton);
        
        controls.appendChild(audio);
        controls.appendChild(processButton);
        
        audioContent.appendChild(details);
        audioContent.appendChild(controls);
        
        audioItem.appendChild(audioContent);
        this.elements.audioList.appendChild(audioItem);
        
        requestAnimationFrame(() => {
            audioItem.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            audioItem.style.opacity = '1';
            audioItem.style.transform = 'translateY(0)';
        });
        
        feather.replace();
    }

    async processAudio(file, audioItem, button) {
        button.disabled = true;
        button.innerHTML = `
            <div class="loading"></div>
            <span>Processing</span>
        `;
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Update endpoint mapping to match backend routes
            const endpoints = {
                tasks: '/process-audio',
                roadmap: '/process-audio/roadmap',
                process: '/process-audio/process'
            };

            const endpoint = endpoints[this.selectedFormat];
            if (!endpoint) {
                throw new Error('Unsupported format');
            }

            console.log('Processing with endpoint:', endpoint); // Debug log

            const response = await fetch(`${this.API_URL}${endpoint}`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Processing failed');
            }
            
            const data = await response.json();
            this.displayProcessedContent(data, audioItem);
            
            if (this.isDemoMode) {
                this.showStatus('Processed in demo mode - using mock data', 'warning');
            } else {
                this.showStatus('Processing complete!', 'success');
            }
        } catch (error) {
            console.error('Error processing audio:', error);
            this.showStatus(error.message || 'Error processing audio file', 'error');
            button.innerHTML = `
                <i data-feather="cpu"></i>
                <span>Process</span>
            `;
            button.disabled = false;
            feather.replace();
        }
    }

    displayProcessedContent(data, audioItem) {
        const processedContent = document.createElement('div');
        processedContent.className = 'processed-content';
        processedContent.style.opacity = '0';
        processedContent.style.transform = 'translateY(20px)';

        let sections;
        
        switch (this.selectedFormat) {
            case 'tasks':
                sections = [
                    {
                        title: 'Tasks',
                        icon: 'check-square',
                        content: this.renderTasks(data.tasks)
                    },
                    {
                        title: 'Next Steps',
                        icon: 'arrow-right-circle',
                        content: this.renderList(data.next_steps)
                    },
                    {
                        title: 'Notes',
                        icon: 'book-open',
                        content: this.renderList(data.notes)
                    }
                ];
                break;

            case 'roadmap':
                sections = [
                    {
                        title: 'Market Analysis',
                        icon: 'trending-up',
                        content: this.renderRoadmapSections(data.market_analysis)
                    },
                    {
                        title: 'Resource Requirements',
                        icon: 'package',
                        content: this.renderRoadmapSections(data.resource_requirements)
                    },
                    {
                        title: 'Dependencies',
                        icon: 'git-branch',
                        content: this.renderRoadmapSections(data.dependencies)
                    },
                    {
                        title: 'Milestones',
                        icon: 'flag',
                        content: this.renderRoadmapSections(data.milestones)
                    },
                    {
                        title: 'Success Metrics',
                        icon: 'target',
                        content: this.renderRoadmapSections(data.success_metrics)
                    }
                ];
                break;

            case 'process':
                sections = [
                    {
                        title: 'Overview',
                        icon: 'info',
                        content: `<div class="process-overview">${data.overview}</div>`
                    },
                    {
                        title: 'Prerequisites',
                        icon: 'list',
                        content: this.renderList(data.prerequisites)
                    },
                    {
                        title: 'Process Steps',
                        icon: 'check-square',
                        content: this.renderProcessSteps(data.steps)
                    },
                    {
                        title: 'Important Notes',
                        icon: 'alert-circle',
                        content: this.renderList(data.notes)
                    }
                ];
                break;
        }
        
        processedContent.innerHTML = sections
            .map(section => `
                <h3>
                    <i data-feather="${section.icon}"></i>
                    ${section.title}
                </h3>
                ${section.content}
            `)
            .join('');
            
        audioItem.appendChild(processedContent);
        
        requestAnimationFrame(() => {
            processedContent.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            processedContent.style.opacity = '1';
            processedContent.style.transform = 'translateY(0)';
        });
        
        const button = audioItem.querySelector('.process-button');
        if (button) {
            button.style.transition = 'all 0.3s ease-out';
            button.style.opacity = '0';
            button.style.transform = 'translateY(10px)';
            setTimeout(() => button.remove(), 300);
        }
        
        feather.replace();
    }
    
    renderTasks(tasks) {
        return `
            <ul class="task-list">
                ${tasks.map((task, index) => `
                    <li class="task-item" style="animation: slideIn 0.3s ease-out ${index * 0.1}s both;">
                        <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
                        <div class="task-content">
                            <div class="task-title">${task.title}</div>
                            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    }
    
    renderRoadmapSections(sections) {
        return `
            <ul class="roadmap-list">
                ${sections.map((section, index) => `
                    <li class="roadmap-item" style="animation: slideIn 0.3s ease-out ${index * 0.1}s both;">
                        <div class="roadmap-header">
                            <h4>${section.title}</h4>
                            <span class="priority-badge priority-${section.priority.toLowerCase()}">${section.priority}</span>
                        </div>
                        <div class="roadmap-timeline">${section.timeline}</div>
                        <ul class="roadmap-content">
                            ${section.content.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        `;
    }
    
    renderProcessSteps(steps) {
        return `
            <ul class="process-steps">
                ${steps.map((step, index) => `
                    <li class="process-step" style="animation: slideIn 0.3s ease-out ${index * 0.1}s both;">
                        <div class="step-number">${step.number}</div>
                        <div class="step-content">
                            <div class="step-action">${step.action}</div>
                            <div class="step-details">${step.details}</div>
                            <div class="step-outcome">Expected: ${step.outcome}</div>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;
    }
    
    renderList(items) {
        return `
            <ul>
                ${items.map((item, index) => `
                    <li class="list-item" style="animation: slideIn 0.3s ease-out ${index * 0.1}s both;">
                        ${item}
                    </li>
                `).join('')}
            </ul>
        `;
    }
    
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.API_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                this.isBackendAvailable = true;
                this.isDemoMode = data.status === 'demo';
                
                if (this.isDemoMode) {
                    this.elements.modeBadge.className = 'mode-badge demo';
                    this.elements.modeBadge.innerHTML = `
                        <i data-feather="radio"></i>
                        <span>Demo Mode</span>
                    `;
                    this.showStatus(data.message, 'warning');
                } else {
                    this.elements.modeBadge.className = 'mode-badge production';
                    this.elements.modeBadge.innerHTML = `
                        <i data-feather="zap"></i>
                        <span>Production</span>
                    `;
                }
            } else {
                throw new Error('Backend health check failed');
            }
        } catch (error) {
            console.error('API health check failed:', error);
            this.showStatus('Server connection failed', 'error');
            this.elements.modeBadge.className = 'mode-badge offline';
            this.elements.modeBadge.innerHTML = `
                <i data-feather="wifi-off"></i>
                <span>Offline</span>
            `;
        }
        feather.replace();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing VoicePM...');
    window.voicePM = new VoicePM();
});
