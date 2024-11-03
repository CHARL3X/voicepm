from models import Task, ProcessedOutput, RoadmapSection, StrategicRoadmap, ProcessStep, ProcessDocument

def get_demo_tasks() -> ProcessedOutput:
    """Return mock data for tasks demo mode."""
    return ProcessedOutput(
        tasks=[
            Task(
                title="Review project timeline", 
                priority="High", 
                description="[DEMO] Need to align with Q4 goals"
            ),
            Task(
                title="Schedule team meeting", 
                priority="Medium", 
                description="[DEMO] Include remote team members"
            ),
            Task(
                title="Update documentation", 
                priority="Low", 
                description="[DEMO] Focus on new features"
            )
        ],
        next_steps=[
            "[DEMO] Complete timeline review by EOD",
            "[DEMO] Send meeting invitation for tomorrow",
            "[DEMO] Assign documentation tasks"
        ],
        notes=[
            "[DEMO] Timeline needs adjustment for Q4",
            "[DEMO] Include remote team members in meeting",
            "[DEMO] Documentation update can wait until next week"
        ]
    )

def get_demo_roadmap() -> StrategicRoadmap:
    """Return mock data for roadmap demo mode."""
    return StrategicRoadmap(
        market_analysis=[
            RoadmapSection(
                title="Market Opportunity Analysis",
                priority="High",
                timeline="Q1 2024",
                content=[
                    "[DEMO] Expanding market share in enterprise segment",
                    "[DEMO] Growing demand for AI-powered solutions",
                    "[DEMO] Competitive advantage in voice processing"
                ]
            )
        ],
        resource_requirements=[
            RoadmapSection(
                title="Technical Infrastructure",
                priority="High",
                timeline="Q1-Q2 2024",
                content=[
                    "[DEMO] Scale cloud infrastructure for enterprise load",
                    "[DEMO] Implement advanced security measures",
                    "[DEMO] Enhance AI processing capabilities"
                ]
            )
        ],
        dependencies=[
            RoadmapSection(
                title="Technical Dependencies",
                priority="High",
                timeline="Q1 2024",
                content=[
                    "[DEMO] API integration with enterprise systems",
                    "[DEMO] Security compliance requirements",
                    "[DEMO] Data processing capabilities"
                ]
            )
        ],
        milestones=[
            RoadmapSection(
                title="Product Launch Phases",
                priority="High",
                timeline="Q1-Q4 2024",
                content=[
                    "[DEMO] Beta release to select enterprise customers",
                    "[DEMO] Full enterprise feature rollout",
                    "[DEMO] Global market expansion"
                ]
            )
        ],
        success_metrics=[
            RoadmapSection(
                title="Key Performance Indicators",
                priority="High",
                timeline="Ongoing",
                content=[
                    "[DEMO] Enterprise customer acquisition rate",
                    "[DEMO] User engagement metrics",
                    "[DEMO] Processing accuracy benchmarks"
                ]
            )
        ],
        summary="[DEMO] Strategic roadmap for enterprise market expansion with focus on AI-powered voice processing capabilities."
    )

def get_demo_process_doc() -> ProcessDocument:
    """Return mock data for process documentation demo mode."""
    return ProcessDocument(
        title="[DEMO] Deploying a New Feature to Production",
        overview="[DEMO] A step-by-step guide for safely deploying new features to the production environment",
        prerequisites=[
            "[DEMO] Access to the deployment pipeline",
            "[DEMO] Completed code review",
            "[DEMO] Passing test suite",
            "[DEMO] Change request approval"
        ],
        steps=[
            ProcessStep(
                number=1,
                action="Create deployment branch",
                details="[DEMO] Create a new branch from main named 'deploy/feature-name'",
                outcome="[DEMO] New deployment branch is ready"
            ),
            ProcessStep(
                number=2,
                action="Run pre-deployment checks",
                details="[DEMO] Execute the pre-deployment checklist including security scans",
                outcome="[DEMO] All pre-deployment checks pass"
            ),
            ProcessStep(
                number=3,
                action="Deploy to staging",
                details="[DEMO] Use the deployment pipeline to push changes to staging environment",
                outcome="[DEMO] Feature is live in staging environment"
            ),
            ProcessStep(
                number=4,
                action="Run smoke tests",
                details="[DEMO] Execute the smoke test suite against staging environment",
                outcome="[DEMO] All smoke tests pass"
            ),
            ProcessStep(
                number=5,
                action="Deploy to production",
                details="[DEMO] Use the deployment pipeline to push changes to production",
                outcome="[DEMO] Feature is live in production"
            )
        ],
        notes=[
            "[DEMO] Always deploy during off-peak hours",
            "[DEMO] Have rollback plan ready",
            "[DEMO] Monitor error rates after deployment",
            "[DEMO] Update documentation after successful deployment"
        ]
    )
