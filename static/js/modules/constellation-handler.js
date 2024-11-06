/**
 * ConstellationHandler Module
 * Manages the visualization and interaction of the Constellation Format
 */
export class ConstellationHandler {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.initialize();
    }

    initialize() {
        this.container = document.createElement('div');
        this.container.className = 'constellation-container';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Delegate event handling for interactive elements
        this.container.addEventListener('click', (e) => {
            const orbit = e.target.closest('.constellation-orbit');
            if (orbit) {
                this.handleOrbitClick(orbit);
            }
        });
    }

    /**
     * Creates the constellation visualization from structured data
     * @param {Object} data - Processed meeting data
     */
    render(data) {
        const { centralStar, orbits, timeline, support } = data;
        
        // Clear previous content
        this.container.innerHTML = '';
        
        // Add header
        this.container.appendChild(this.createHeader(data.title, data.summary));
        
        // Add central star
        this.container.appendChild(this.createCentralStar(centralStar));
        
        // Add orbital insights
        const orbitsContainer = this.createOrbits(orbits);
        this.container.appendChild(orbitsContainer);
        
        // Add timeline if present
        if (timeline && timeline.length) {
            this.container.appendChild(this.createTimeline(timeline));
        }
        
        // Add support elements
        if (support) {
            this.container.appendChild(this.createSupportElements(support));
        }
        
        return this.container;
    }

    createHeader(title, summary) {
        const header = document.createElement('div');
        header.className = 'constellation-header';
        
        header.innerHTML = `
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <h1 class="constellation-title">${title}</h1>
                    <div class="constellation-badge">Voice Transformed</div>
                </div>
                <p class="constellation-summary">${summary}</p>
            </div>
        `;
        
        return header;
    }

    createCentralStar(data) {
        const star = document.createElement('div');
        star.className = 'constellation-star';
        star.setAttribute('data-active', 'true');
        
        star.innerHTML = `
            <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <i data-feather="star" class="w-5 h-5 text-primary"></i>
                </div>
                <h3 class="text-lg font-medium text-primary">${data.title}</h3>
            </div>
            <p class="text-secondary">${data.description}</p>
        `;
        
        return star;
    }

    createOrbits(orbits) {
        const container = document.createElement('div');
        container.className = 'constellation-orbits';
        
        orbits.forEach(orbit => {
            const orbitEl = document.createElement('div');
            orbitEl.className = 'constellation-orbit';
            
            let sentimentClass = '';
            if (orbit.sentiment) {
                sentimentClass = `pattern-sentiment" data-sentiment="${orbit.sentiment}`;
            }
            
            let priorityIndicator = '';
            if (orbit.priority) {
                priorityIndicator = `
                    <span class="priority-indicator" data-priority="${orbit.priority}">
                        <i data-feather="${this.getPriorityIcon(orbit.priority)}" class="w-4 h-4"></i>
                    </span>
                `;
            }
            
            orbitEl.innerHTML = `
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <i data-feather="star" class="w-4 h-4 text-primary"></i>
                    </div>
                    <h4 class="text-sm font-medium text-primary">
                        ${orbit.title}
                        ${sentimentClass ? `<span class="${sentimentClass}">${orbit.sentiment}</span>` : ''}
                        ${priorityIndicator}
                    </h4>
                </div>
                <div class="space-y-2">
                    ${orbit.points.map(point => `
                        <p class="text-secondary text-xs">${point}</p>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(orbitEl);
        });
        
        return container;
    }

    createTimeline(timeline) {
        const container = document.createElement('div');
        container.className = 'constellation-timeline';
        
        timeline.forEach(marker => {
            const markerEl = document.createElement('div');
            markerEl.className = 'timeline-marker';
            
            markerEl.innerHTML = `
                <div class="timeline-date">${marker.date}</div>
                <div class="timeline-title">${marker.title}</div>
            `;
            
            container.appendChild(markerEl);
        });
        
        return container;
    }

    createSupportElements(support) {
        const container = document.createElement('div');
        container.className = 'constellation-support';
        
        // Create Questions Section
        if (support.questions) {
            container.appendChild(this.createSupportSection(
                'Questions',
                support.questions,
                'help-circle',
                'warning'
            ));
        }
        
        // Create Actions Section
        if (support.actions) {
            container.appendChild(this.createSupportSection(
                'Actions',
                support.actions,
                'check-circle',
                'success'
            ));
        }
        
        return container;
    }

    createSupportSection(title, items, icon, type) {
        const section = document.createElement('div');
        section.className = 'support-section';
        
        section.innerHTML = `
            <div class="support-header">
                <i data-feather="${icon}" class="w-5 h-5 text-${type}"></i>
                <h3>${title}</h3>
            </div>
            <div class="support-list">
                ${items.map(item => `
                    <div class="support-item">
                        <div class="support-indicator bg-${type}"></div>
                        <span class="text-sm text-secondary">${item}</span>
                    </div>
                `).join('')}
            </div>
        `;
        
        return section;
    }

    getPriorityIcon(priority) {
        const icons = {
            high: 'alert-circle',
            medium: 'alert-triangle',
            low: 'info'
        };
        return icons[priority] || 'info';
    }

    handleOrbitClick(orbit) {
        // Remove active state from all orbits
        this.container.querySelectorAll('.constellation-orbit').forEach(o => {
            o.classList.remove('active');
        });
        
        // Add active state to clicked orbit
        orbit.classList.add('active');
        
        // Emit event for other components
        this.app.emit('constellation:orbit:selected', {
            title: orbit.querySelector('h4').textContent,
            points: Array.from(orbit.querySelectorAll('p')).map(p => p.textContent)
        });
    }

    /**
     * Updates sentiment indicators based on pattern recognition
     * @param {Object} patterns - Detected patterns in the conversation
     */
    updatePatterns(patterns) {
        if (patterns.sentiment) {
            this.container.querySelectorAll('.pattern-sentiment').forEach(el => {
                const sentiment = el.getAttribute('data-sentiment');
                if (patterns.sentiment[sentiment]) {
                    el.classList.add('active');
                }
            });
        }
    }
}
