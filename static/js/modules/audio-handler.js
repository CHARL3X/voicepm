/**
 * Audio Handler Module
 * Manages file uploads and audio processing
 */
export class AudioHandler {
    constructor(voicePM) {
        this.voicePM = voicePM;
        this.maxFileSize = 25 * 1024 * 1024; // 25MB limit
        this.supportedTypes = /^audio\/(mp3|mpeg|wav|x-m4a)$/;
        this.maxRetries = 3;
    }

    /**
     * Handle file drop event
     */
    handleDrop(e) {
        if (this.voicePM.currentStep === 2) {
            const dt = e.dataTransfer;
            const files = dt.files;
            this.handleFiles(files);
        }
    }

    /**
     * Handle file select event
     */
    handleFileSelect(e) {
        if (this.voicePM.currentStep === 2) {
            const files = e.target.files;
            this.handleFiles(files);
        }
    }

    /**
     * Process uploaded files
     */
    handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        
        if (!this.validateFile(file)) {
            return;
        }

        this.voicePM.showStatus('File uploaded successfully!', 'success');
        this.addAudioFile(file);
        this.voicePM.updateSteps(3);
    }

    /**
     * Validate uploaded file
     */
    validateFile(file) {
        if (!file.type.match(this.supportedTypes)) {
            this.voicePM.showStatus('Please upload an MP3, M4A, or WAV file', 'error');
            return false;
        }

        if (file.size > this.maxFileSize) {
            this.voicePM.showStatus('File size must be under 25MB', 'error');
            return false;
        }

        if (this.voicePM.selectedFormat !== 'tasks' && !this.voicePM.isProUser()) {
            this.voicePM.showProFeaturePrompt();
            return false;
        }

        return true;
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Add audio file to UI
     */
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
        processButton.innerHTML = `
            <i data-feather="cpu"></i>
            <span>${this.voicePM.formatHandler.getProcessButtonText(this.voicePM.selectedFormat)}</span>
        `;
        processButton.onclick = () => this.processAudio(file, audioItem, processButton);
        
        controls.appendChild(audio);
        controls.appendChild(processButton);
        
        audioContent.appendChild(details);
        audioContent.appendChild(controls);
        
        audioItem.appendChild(audioContent);
        this.voicePM.elements.audioList.appendChild(audioItem);
        
        requestAnimationFrame(() => {
            audioItem.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            audioItem.style.opacity = '1';
            audioItem.style.transform = 'translateY(0)';
        });
        
        feather.replace();
    }

    /**
     * Process audio file
     */
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
                process: '/process-audio/process',
                constellation: '/process-audio/constellation'
            };

            const endpoint = endpoints[this.voicePM.selectedFormat];
            if (!endpoint) {
                throw new Error('Unsupported format');
            }

            console.log('Processing with endpoint:', endpoint);

            const response = await fetch(`${this.voicePM.API_URL}${endpoint}`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || 'Processing failed';
                
                if (response.status >= 500 && retryCount < this.maxRetries) {
                    console.log(`Retrying request (${retryCount + 1}/${this.maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                    return this.processAudio(file, audioItem, button, retryCount + 1);
                }
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            this.voicePM.contentRenderer.displayProcessedContent(data, audioItem);
            
            if (this.voicePM.isDemoMode) {
                this.voicePM.showStatus('Processed in demo mode - using mock data', 'warning');
            } else {
                this.voicePM.showStatus('Processing complete!', 'success');
            }
        } catch (error) {
            console.error('Error processing audio:', error);
            
            let errorMessage = this.getErrorMessage(error);
            
            this.voicePM.showStatus(errorMessage, 'error');
            button.innerHTML = `
                <i data-feather="cpu"></i>
                <span>Retry Processing</span>
            `;
            button.disabled = false;
            feather.replace();
        }
    }

    /**
     * Get appropriate error message
     */
    getErrorMessage(error) {
        if (error.message.includes('Failed to fetch')) {
            return 'Unable to connect to server. Please check your internet connection.';
        } else if (error.message.includes('NetworkError')) {
            return 'Network error occurred. Please try again.';
        } else if (error.message.includes('timeout')) {
            return 'Request timed out. Please try again.';
        }
        return error.message;
    }
}
