/**
 * Content Renderer Module
 * Handles displaying processed content in different formats
 */
export class ContentRenderer {
    constructor(voicePM) {
        this.voicePM = voicePM;
    }

    /**
     * Display processed content based on format
     */
    displayProcessedContent(data, audioItem) {
        const processedContent = document.createElement('div');
        processedContent.className = 'processed-content';
        processedContent.style.opacity = '0';
        processedContent.style.transform = 'translateY(20px)';

        let sections;
        switch (this.voicePM.selectedFormat) {
            case 'tasks':
                sections = this.getTaskSections(data);
                break;
            case 'roadmap':
                sections = this.getRoadmapSections(data);
                break;
            case 'process':
                sections = this.getProcessSections(data);
                break;
            case 'constellation':
                sections = this.getConstellationSections(data);
                break;
        }
        
        processedContent.innerHTML = this.renderSections(sections);
        this.appendContent(audioItem, processedContent);
        
        // Show CTA section after content is displayed
        this.showCTASection();
    }

    /**
     * Show CTA section with animation
     */
    showCTASection() {
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) {
            ctaSection.classList.add('visible');
        }
    }

    /**
     * Get sections for constellation format
     */
    getConstellationSections(data) {
        return [
            {
                title: 'Central Theme',
                icon: 'star',
                content: this.renderCentralStar(data.central_star)
            },
            {
                title: 'Orbital Insights',
                icon: 'circle',
                content: this.renderOrbits(data.orbits)
            },
            {
                title: 'Timeline',
                icon: 'clock',
                content: this.renderTimeline(data.timeline)
            },
            {
                title: 'Support Elements',
                icon: 'help-circle',
                content: this.renderSupportElements(data.support)
            },
            {
                title: 'Patterns & Relationships',
                icon: 'git-branch',
                content: this.renderPatterns(data)
            }
        ];
    }

    /**
     * Render central star section
     */
    renderCentralStar(star) {
        return `
            <div class="constellation-star">
                <h3 class="star-title">${star.title}</h3>
                <p class="star-description">${star.description}</p>
                ${star.timeline ? `<div class="star-timeline">${star.timeline}</div>` : ''}
                ${star.impact ? `<div class="star-impact">${star.impact}</div>` : ''}
            </div>
        `;
    }

    /**
     * Render orbits section
     */
    renderOrbits(orbits) {
        return `
            <div class="constellation-orbits">
                ${orbits.map(orbit => `
                    <div class="orbit-item">
                        <div class="orbit-header">
                            <h4>${orbit.title}</h4>
                            ${orbit.sentiment ? `<span class="sentiment-badge ${orbit.sentiment}">${orbit.sentiment}</span>` : ''}
                            ${orbit.priority ? `<span class="priority-badge ${orbit.priority}">${orbit.priority}</span>` : ''}
                        </div>
                        <ul class="orbit-points">
                            ${orbit.points.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render timeline section
     */
    renderTimeline(timeline) {
        return `
            <div class="constellation-timeline">
                ${timeline.map(marker => `
                    <div class="timeline-marker">
                        <div class="marker-date">${marker.date}</div>
                        <div class="marker-title">${marker.title}</div>
                        ${marker.description ? `<div class="marker-description">${marker.description}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render support elements section
     */
    renderSupportElements(support) {
        return `
            <div class="constellation-support">
                ${support.questions.length > 0 ? `
                    <div class="support-section">
                        <h4>Questions</h4>
                        <ul>
                            ${support.questions.map(q => `<li>${q}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${support.actions.length > 0 ? `
                    <div class="support-section">
                        <h4>Actions</h4>
                        <ul>
                            ${support.actions.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render patterns section
     */
    renderPatterns(data) {
        return `
            <div class="constellation-patterns">
                ${data.sentiment_patterns ? `
                    <div class="pattern-section">
                        <h4>Sentiment Patterns</h4>
                        ${data.sentiment_patterns.map(pattern => `
                            <div class="sentiment-pattern ${pattern.type}">
                                <span class="pattern-type">${pattern.type}</span>
                                <span class="pattern-confidence">${Math.round(pattern.confidence * 100)}%</span>
                                <div class="pattern-markers">${pattern.markers.join(', ')}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${data.decision_flows ? `
                    <div class="pattern-section">
                        <h4>Decision Flows</h4>
                        ${data.decision_flows.map(flow => `
                            <div class="decision-flow">
                                <div class="flow-initial">${flow.initial}</div>
                                <div class="flow-progression">
                                    ${flow.progression.map(step => `<div class="flow-step">${step}</div>`).join('')}
                                </div>
                                ${flow.final ? `<div class="flow-final">${flow.final}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Get sections for task format
     */
    getTaskSections(data) {
        return [
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
    }

    /**
     * Get sections for roadmap format
     */
    getRoadmapSections(data) {
        return [
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
    }

    /**
     * Get sections for process format
     */
    getProcessSections(data) {
        return [
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
    }

    /**
     * Render sections into HTML
     */
    renderSections(sections) {
        return sections
            .map(section => `
                <h3>
                    <i data-feather="${section.icon}"></i>
                    ${section.title}
                </h3>
                ${section.content}
            `)
            .join('');
    }

    /**
     * Append content to audio item with animation
     */
    appendContent(audioItem, processedContent) {
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

    /**
     * Render tasks in kanban board format
     */
    renderTasks(tasks) {
        const tasksByPriority = this.organizeTasks(tasks);
        const { totalTasks, completedTasks } = this.getTaskStats(tasks);

        return `
            ${this.renderTaskHeader(totalTasks, completedTasks)}
            ${this.renderProgressOverview(tasksByPriority)}
            ${this.renderTaskBoard(tasksByPriority)}
        `;
    }

    /**
     * Organize tasks by priority
     */
    organizeTasks(tasks) {
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

        return tasksByPriority;
    }

    /**
     * Get task statistics
     */
    getTaskStats(tasks) {
        return {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.status === 'Completed').length
        };
    }

    /**
     * Render task header section
     */
    renderTaskHeader(totalTasks, completedTasks) {
        return `
            <div class="task-board-header">
                <div class="task-board-title">
                    <h2>Task Overview</h2>
                    <div class="ai-badge">AI-Extracted</div>
                </div>
                <p class="text-secondary">Automatically organized by priority and context</p>
            </div>
        `;
    }

    /**
     * Render progress overview section
     */
    renderProgressOverview(tasksByPriority) {
        return `
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
        `;
    }

    /**
     * Render task board section
     */
    renderTaskBoard(tasksByPriority) {
        return `
            <div class="task-board">
                ${Object.entries(tasksByPriority).map(([priority, priorityTasks]) => `
                    <div class="task-column">
                        <div class="column-header">
                            <div class="priority-indicator priority-${priority.toLowerCase()}"></div>
                            <h3>${priority} Priority</h3>
                            <span class="task-count">${priorityTasks.length}</span>
                        </div>
                        <div class="task-list">
                            ${priorityTasks.map((task, index) => this.renderTaskItem(task, priority, index)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render individual task item
     */
    renderTaskItem(task, priority, index) {
        return `
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
        `;
    }

    /**
     * Render roadmap sections
     */
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

    /**
     * Render process steps
     */
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

    /**
     * Render generic list
     */
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
}
