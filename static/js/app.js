class VoicePM {
    constructor() {
        // Get API URL from environment or default to Render.com deployment
        this.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:8000'
            : 'https://voicepm-backend.onrender.com';
        this.isBackendAvailable = false;
        this.isDemoMode = false;
        this.selectedFormat = 'tasks'; // Default format
        this.maxRetries = 3; // Maximum number of retries for failed requests
        this.healthCheckInterval = null;
        
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
        console.log('API URL:', this.API_URL);
        
        // Bind methods to preserve 'this' context
        this.handleFormatSelect = this.handleFormatSelect.bind(this);
        this.preventDefaults = this.preventDefaults.bind(this);
        this.highlight = this.highlight.bind(this);
        this.unhighlight = this.unhighlight.bind(this);
        
        this.initializeEventListeners();
        this.checkBackendHealth();
        this.initializeAnimations();
        
        // Start periodic health checks
        this.healthCheckInterval = setInterval(() => this.checkBackendHealth(), 30000);
        
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
        const maxSize = 25 * 1024 * 1024; // 25MB limit
        
        // Enhanced file validation
        if (!file.type.match(/^audio\/(mp3|mpeg|wav|x-m4a)$/)) {
            this.showStatus('Please upload an MP3, M4A, or WAV file', 'error');
            return;
        }

        if (file.size > maxSize) {
            this.showStatus('File size must be under 25MB', 'error');
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

    async processAudio(file, audioItem, button, retryCount = 0) {
        button.disabled = true;
        button.innerHTML = `
            <div class="loading"></div>
            <span>Processing${retryCount > 0 ? ` (Retry ${retryCount}/${this.maxRetries})` : ''}</span>
        `;
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const endpoints = {
                tasks: '/process-audio',
                roadmap: '/process-audio/roadmap',
                process: '/process-audio/process'
            };

            const endpoint = endpoints[this.selectedFormat];
            if (!endpoint) {
                throw new Error('Unsupported format');
            }

            console.log('Processing with endpoint:', endpoint);

            const response = await fetch(`${this.API_URL}${endpoint}`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || 'Processing failed';
                
                // Retry logic for 5xx errors
                if (response.status >= 500 && retryCount < this.maxRetries) {
                    console.log(`Retrying request (${retryCount + 1}/${this.maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                    return this.processAudio(file, audioItem, button, retryCount + 1);
                }
                
                throw new Error(errorMessage);
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
            
            // Enhanced error messages
            let errorMessage = 'Error processing audio file';
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Unable to connect to server. Please check your internet connection.';
            } else if (error.message.includes('NetworkError')) {
                errorMessage = 'Network error occurred. Please try again.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again.';
            } else {
                errorMessage = error.message; // Use the actual error message
            }
            
            this.showStatus(errorMessage, 'error');
            button.innerHTML = `
                <i data-feather="cpu"></i>
                <span>Retry Processing</span>
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
    // First, organize tasks by priority
    const tasksByPriority = {
        High: [],
        Medium: [],
        Low: []
    };
    
    tasks.forEach(task => {
        if (tasksByPriority[task.priority]) {
            tasksByPriority[task.priority].push(task);
        }
    });

    // Calculate total and completed tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;

    return `
        <div class="task-board-header">
            <div class="task-board-title">
                <h2>Task Overview</h2>
                <div class="ai-badge">AI-Extracted</div>
            </div>
            <p class="text-secondary">Automatically organized by priority and context</p>
        </div>

        <div class="progress-overview">
            <div class="progress-header">
                <i data-feather="sparkles" class="text-primary"></i>
                <div class="progress-info">
                    <h3 class="text-primary font-medium mb-1">Task Progress</h3>
                    <div class="progress-stats">
                        <div>${completedTasks} of ${totalTasks} completed</div>
                        <div class="divider"></div>
                        <div class="text-primary">50% on track</div>
                    </div>
                </div>
                <button class="btn-secondary">Export Tasks</button>
            </div>
            
            <div class="priority-progress">
                ${Object.entries(tasksByPriority).map(([priority, priorityTasks]) => `
                    <div class="priority-bar priority-${priority.toLowerCase()}">
                        <div class="priority-bar-header">
                            <span class="priority-label">${priority} Priority</span>
                            <span class="task-count">${priorityTasks.length} tasks</span>
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${(priorityTasks.filter(t => t.status === 'Completed').length / priorityTasks.length) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="task-board">
            ${Object.entries(tasksByPriority).map(([priority, priorityTasks]) => `
                <div class="task-column">
                    <div class="column-header">
                        <div class="priority-indicator priority-${priority.toLowerCase()}"></div>
                        <h3>${priority} Priority</h3>
                        <span class="task-count">${priorityTasks.length}</span>
                    </div>
                    <div class="task-list">
                        ${priorityTasks.map((task, index) => `
                            <div class="task-item" style="animation: fadeScale 0.3s ease-out ${index * 0.1}s both;">
                                <div class="task-content">
                                    <h4 class="task-title">${task.title}</h4>
                                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                                    <div class="task-meta">
                                        <span class="task-priority ${priority.toLowerCase()}">${priority}</span>
                                        ${task.status ? `
                                            <span class="task-status">
                                                <i data-feather="${task.status === 'Completed' ? 'check-circle' : 'clock'}" class="icon-sm"></i>
                                                ${task.status}
                                            </span>
                                        ` : ''}
                                        ${task.deadline ? `
                                            <span class="task-deadline">
                                                <i data-feather="calendar" class="icon-sm"></i>
                                                ${task.deadline}
                                            </span>
                                        ` : ''}
                                        ${task.tags ? task.tags.map(tag => `
                                            <span class="task-tag">${tag}</span>
                                        `).join('') : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderRoadmapSections(sections) {
        return `
            <div class="roadmap-timeline">
                <div class="timeline-track"></div>
                ${sections.map((section, index) => `
                    <div class="timeline-item" style="animation: fadeScale 0.3s ease-out ${index * 0.1}s both;">
                        <div class="timeline-content">
                            <div class="timeline-date">${section.timeline}</div>
                            <h4 class="timeline-title">${section.title}</h4>
                            <div class="timeline-details">
                                ${section.content.map(item => `
                                    <div class="timeline-detail-item">
                                        <i data-feather="arrow-right"></i>
                                        ${item}
                                    </div>
                                `).join('')}
                            </div>
                            ${section.priority ? `<span class="priority-badge priority-${section.priority.toLowerCase()}">${section.priority}</span>` : ''}
                        </div>
                        <div class="timeline-marker"></div>
                </div>
            `).join('')}
        </div>
    `;
}

    renderProcessSteps(steps) {
        return `
            <div class="process-flow">
                ${steps.map((step, index) => `
                    <div class="process-step" style="animation: fadeScale 0.3s ease-out ${index * 0.1}s both;">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-content">
                            <div class="step-header">
                                <div class="step-title">${step.action}</div>
                            </div>
                            <div class="step-details">${step.details}</div>
                            ${step.outcome ? `
                                <div class="step-outcome">
                                    <i data-feather="check-circle"></i>
                                    ${step.outcome}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderList(items) {
        if (!Array.isArray(items)) {
            console.warn('renderList received non-array input:', items);
            items = [];
        }
        
        return `
            <div class="process-overview">
                <div class="overview-content">
                    ${items.map(item => `
                        <div class="overview-item">
                            <i data-feather="chevron-right"></i>
                            ${typeof item === 'string' ? item : JSON.stringify(item)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.API_URL}/health`);
            const data = await response.json();
            
            this.isBackendAvailable = data.status === 'ok';
            this.isDemoMode = data.demo_mode === true;
            
            // Update UI based on backend status
            if (this.elements.modeBadge) {
                if (this.isDemoMode) {
                    this.elements.modeBadge.style.display = 'flex';
                    this.elements.modeBadge.innerHTML = `
                        <i data-feather="radio"></i>
                        <span>Demo Mode</span>
                    `;
                } else {
                    this.elements.modeBadge.style.display = 'none';
                }
                feather.replace();
            }
            
            console.log('Backend health check:', {
                available: this.isBackendAvailable,
                demoMode: this.isDemoMode
            });
        } catch (error) {
            console.error('Health check failed:', error);
            this.isBackendAvailable = false;
            this.isDemoMode = true;
            
            if (this.elements.modeBadge) {
                this.elements.modeBadge.style.display = 'flex';
                this.elements.modeBadge.innerHTML = `
                    <i data-feather="alert-triangle"></i>
                    <span>Demo Mode (Offline)</span>
                `;
                feather.replace();
            }
        }
    }

    destroy() {
        // Clear health check interval
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
        
        // Remove event listeners
        if (this.elements.uploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.elements.uploadArea.removeEventListener(eventName, this.preventDefaults);
                document.body.removeEventListener(eventName, this.preventDefaults);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                this.elements.uploadArea.removeEventListener(eventName, this.highlight);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                this.elements.uploadArea.removeEventListener(eventName, this.unhighlight);
            });
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing VoicePM...');
    window.voicePM = new VoicePM();
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (window.voicePM) {
        window.voicePM.destroy();
    }
});
