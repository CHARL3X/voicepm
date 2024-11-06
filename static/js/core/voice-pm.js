/**
 * Core VoicePM Class
 * Main application class that coordinates between modules
 */

import { UIHandler } from '../modules/ui-handler.js';
import { FormatHandler } from '../modules/format-handler.js';
import { AudioHandler } from '../modules/audio-handler.js';
import { ContentRenderer } from '../modules/content-renderer.js';

export class VoicePM {
    constructor() {
        // API Configuration
        this.API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:8000'
            : 'https://voicepm-backend.onrender.com';
        
        // Application State
        this.isBackendAvailable = false;
        this.isDemoMode = false;
        this.selectedFormat = 'tasks';
        this.currentStep = 1;
        
        // Initialize DOM Elements
        this.initializeElements();
        
        // Initialize Modules
        this.initializeModules();
        
        // Start Application
        this.initialize();
        
        console.log('VoicePM initialized with format:', this.selectedFormat);
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            status: document.getElementById('status'),
            audioList: document.getElementById('audioList'),
            modeBadge: document.getElementById('modeBadge'),
            formatSelector: document.getElementById('formatSelector'),
            steps: document.querySelectorAll('.step'),
            uploadText: document.querySelector('.upload-text'),
            uploadSubtext: document.querySelector('.upload-subtext'),
            outputFormat: document.getElementById('outputFormat'),
            outputFormatIcon: document.getElementById('outputFormatIcon'),
            outputFormatName: document.getElementById('outputFormatName')
        };

        // Ensure audioList is visible
        if (this.elements.audioList) {
            this.elements.audioList.style.display = 'block';
        }

        // Log element initialization
        console.log('Elements initialized:', Object.keys(this.elements).filter(key => this.elements[key]));
    }

    /**
     * Initialize application modules
     */
    initializeModules() {
        // Initialize handlers in correct order
        this.audioHandler = new AudioHandler(this);
        this.formatHandler = new FormatHandler(this);
        this.uiHandler = new UIHandler(this);
        this.contentRenderer = new ContentRenderer(this);
        console.log('Modules initialized');
    }

    /**
     * Initialize application
     */
    initialize() {
        this.checkBackendHealth();
        this.initializeAnimations();
        this.startHealthCheck();
        this.setupInitialState();
    }

    /**
     * Set up initial application state
     */
    setupInitialState() {
        // Set initial format
        const defaultFormat = document.querySelector('.format-card[data-format="tasks"]');
        if (defaultFormat) {
            this.formatHandler.handleFormatSelect(defaultFormat);
        }

        // Update output format display
        this.updateOutputFormat('tasks');
    }

    /**
     * Update output format display
     */
    updateOutputFormat(format) {
        if (this.elements.outputFormat && this.elements.outputFormatName) {
            this.elements.outputFormat.style.display = 'flex';
            this.elements.outputFormatName.textContent = format.charAt(0).toUpperCase() + format.slice(1);
            
            // Update icon based on format
            if (this.elements.outputFormatIcon) {
                const icons = {
                    tasks: 'check-square',
                    roadmap: 'git-branch',
                    process: 'book',
                    constellation: 'star'
                };
                this.elements.outputFormatIcon.setAttribute('data-feather', icons[format] || 'check-square');
                feather.replace();
            }
        }
    }

    /**
     * Start periodic health checks
     */
    startHealthCheck() {
        this.healthCheckInterval = setInterval(() => this.checkBackendHealth(), 30000);
    }

    /**
     * Initialize animations
     */
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

    /**
     * Check backend health status
     */
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.API_URL}/health`);
            const data = await response.json();
            
            this.isBackendAvailable = data.status === 'ok';
            this.isDemoMode = data.demo_mode === true;
            
            this.updateBackendStatus();
            
        } catch (error) {
            console.error('Health check failed:', error);
            this.isBackendAvailable = false;
            this.isDemoMode = true;
            this.updateBackendStatus(true);
        }
    }

    /**
     * Update backend status UI
     */
    updateBackendStatus(isError = false) {
        if (this.elements.modeBadge) {
            if (this.isDemoMode) {
                this.elements.modeBadge.style.display = 'flex';
                this.elements.modeBadge.innerHTML = isError
                    ? '<i data-feather="alert-triangle"></i><span>Demo Mode (Offline)</span>'
                    : '<i data-feather="radio"></i><span>Demo Mode</span>';
            } else {
                this.elements.modeBadge.style.display = 'none';
            }
            feather.replace();
        }
    }

    /**
     * Update progress steps
     */
    updateSteps(activeStep) {
        this.currentStep = activeStep;
        
        this.elements.steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === activeStep) {
                step.classList.add('active');
            } else if (stepNumber < activeStep) {
                step.classList.add('completed');
            }
        });
    }

    /**
     * Show status message
     */
    showStatus(message, type) {
        if (!this.elements.status) return;

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

    /**
     * Check if user has pro access
     */
    isProUser() {
        return true; // Always return true for testing purposes
    }

    /**
     * Show pro feature prompt
     */
    showProFeaturePrompt() {
        this.showStatus('This is a Pro feature. Upgrade to access.', 'warning');
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
        
        this.uiHandler.destroy();
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
