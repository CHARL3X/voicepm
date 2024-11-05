class VoxifyComponent extends HTMLElement {
    constructor() {
        super();
        this.apiUrl = this.determineApiUrl();
        this.isBackendAvailable = false;
        this.isDemoMode = false;
    }

    determineApiUrl() {
        // Check if a backend URL is provided via attribute
        const configuredUrl = this.getAttribute('backend-url');
        if (configuredUrl) {
            return configuredUrl;
        }

        // Default to production URL, fallback to localhost for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        return 'https://voicepm-backend.onrender.com';
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                .container {
                    padding: 2rem 1.5rem;
                    background: #16171f;
                    color: #ffffff;
                    font-family: 'Inter', sans-serif;
                }
                .app-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .app-title {
                    font-size: 3rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #6d5aff, #a78bfa);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    margin-bottom: 1rem;
                }
                .app-description {
                    font-size: 1.25rem;
                    color: #94a3b8;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .upload-area {
                    background: #1a1b26;
                    border: 2px dashed #2d3748;
                    border-radius: 1rem;
                    padding: 4rem 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin: 2rem 0;
                }
                .upload-area:hover {
                    border-color: #6d5aff;
                    box-shadow: 0 0 20px rgba(109, 90, 255, 0.15);
                    transform: translateY(-2px);
                }
                .upload-text {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 0.75rem;
                }
                .upload-subtext {
                    color: #94a3b8;
                    font-size: 1rem;
                }
                .mode-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-left: 0.75rem;
                    background: rgba(255, 179, 71, 0.1);
                    color: #ffb347;
                    border: 1px solid rgba(255, 179, 71, 0.2);
                }
                .status {
                    display: none;
                    padding: 1rem;
                    margin: 1rem 0;
                    border-radius: 0.5rem;
                    text-align: center;
                }
                .status.error {
                    display: block;
                    background: rgba(255, 77, 77, 0.1);
                    color: #ff4d4d;
                    border: 1px solid rgba(255, 77, 77, 0.2);
                }
                .status.success {
                    display: block;
                    background: rgba(0, 204, 136, 0.1);
                    color: #00cc88;
                    border: 1px solid rgba(0, 204, 136, 0.2);
                }
                .status.warning {
                    display: block;
                    background: rgba(255, 179, 71, 0.1);
                    color: #ffb347;
                    border: 1px solid rgba(255, 179, 71, 0.2);
                }
            </style>
            <div class="container">
                <header class="app-header">
                    <h1 class="app-title">
                        Voxify
                        <span class="mode-badge">Demo Mode</span>
                    </h1>
                    <p class="app-description">
                        Transform Your Voice into Action. Harness AI-powered intelligence to convert voice memos into 
                        beautifully organized project plans in seconds.
                    </p>
                </header>

                <div class="upload-area">
                    <input type="file" accept="audio/*" style="display: none">
                    <p class="upload-text">Start Your Productivity Revolution</p>
                    <p class="upload-subtext">Drop your voice memo or click to upload (MP3, M4A, WAV supported)</p>
                </div>
                <div class="status"></div>
            </div>
        `;

        this.setupListeners();
        this.checkBackendHealth();
    }

    setupListeners() {
        const uploadArea = this.querySelector('.upload-area');
        const fileInput = this.querySelector('input[type="file"]');

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
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

    async handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        if (!file.type.startsWith('audio/')) {
            this.showStatus('Please upload an audio file', 'error');
            return;
        }

        this.showStatus('Processing your audio...', 'success');
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${this.apiUrl}/process-audio/`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Processing failed');
            }
            
            const data = await response.json();
            this.showStatus('Processing complete!', 'success');
            this.displayResults(data);
            
        } catch (error) {
            console.error('Error processing audio:', error);
            this.showStatus(error.message || 'Error processing audio file', 'error');
        }
    }

    showStatus(message, type) {
        const status = this.querySelector('.status');
        status.textContent = message;
        status.className = `status ${type}`;
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        }
    }

    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.apiUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                this.isBackendAvailable = true;
                this.isDemoMode = data.status === 'demo';
                this.updateModeBadge();
                
                if (this.isDemoMode) {
                    this.showStatus('Running in demo mode - using mock data', 'warning');
                }
            }
        } catch (error) {
            console.error('Backend health check failed:', error);
            this.isBackendAvailable = false;
            this.updateModeBadge();
            this.showStatus('Cannot connect to server', 'error');
        }
    }

    updateModeBadge() {
        const badge = this.querySelector('.mode-badge');
        if (this.isBackendAvailable) {
            badge.textContent = this.isDemoMode ? 'Demo Mode' : 'Connected';
            badge.style.background = this.isDemoMode ? 'rgba(255, 179, 71, 0.1)' : 'rgba(0, 204, 136, 0.1)';
            badge.style.color = this.isDemoMode ? '#ffb347' : '#00cc88';
        } else {
            badge.textContent = 'Offline';
            badge.style.background = 'rgba(255, 77, 77, 0.1)';
            badge.style.color = '#ff4d4d';
        }
    }

    displayResults(data) {
        // Implementation for displaying results
        console.log('Processing results:', data);
        // TODO: Add UI for displaying tasks, next steps, and notes
    }
}

customElements.define('voxify-component', VoxifyComponent);
