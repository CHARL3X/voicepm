from models import Task, ProcessedOutput, RoadmapSection, StrategicRoadmap, ProcessStep, ProcessDocument

def get_demo_tasks() -> ProcessedOutput:
    """Return mock data for tasks demo mode."""
    return ProcessedOutput(
        tasks=[
            Task(
                title="Update brand guidelines", 
                priority="High", 
                description="Review and finalize new color palette and typography",
                status="In Progress",
                deadline="End of Q2",
                tags=["Design", "Brand"]
            ),
            Task(
                title="Customer feedback integration", 
                priority="High", 
                description="Implement top 3 most requested features from survey",
                status="Not Started",
                deadline="Next Sprint",
                tags=["Development"]
            ),
            Task(
                title="Team retrospective notes", 
                priority="Medium", 
                description="Document key findings from sprint review",
                status="In Review",
                deadline="This Week",
                tags=["Planning"]
            ),
            Task(
                title="Update documentation", 
                priority="Low", 
                description="Add new API endpoints to developer docs",
                status="Draft",
                deadline="Next Month",
                tags=["Documentation"]
            )
        ],
        next_steps=[
            "Schedule design review meeting",
            "Prioritize feature requests",
            "Share retrospective summary",
            "Create documentation template"
        ],
        notes=[
            "Consider accessibility guidelines in brand update",
            "Focus on high-impact features first",
            "Include action items from retrospective",
            "Link documentation to existing guides"
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
                    "Expanding market share in enterprise segment",
                    "Growing demand for AI-powered solutions",
                    "Competitive advantage in voice processing"
                ]
            )
        ],
        resource_requirements=[
            RoadmapSection(
                title="Technical Infrastructure",
                priority="High",
                timeline="Q1-Q2 2024",
                content=[
                    "Scale cloud infrastructure for enterprise load",
                    "Implement advanced security measures",
                    "Enhance AI processing capabilities"
                ]
            )
        ],
        dependencies=[
            RoadmapSection(
                title="Technical Dependencies",
                priority="High",
                timeline="Q1 2024",
                content=[
                    "API integration with enterprise systems",
                    "Security compliance requirements",
                    "Data processing capabilities"
                ]
            )
        ],
        milestones=[
            RoadmapSection(
                title="Product Launch Phases",
                priority="High",
                timeline="Q1-Q4 2024",
                content=[
                    "Beta release to select enterprise customers",
                    "Full enterprise feature rollout",
                    "Global market expansion"
                ]
            )
        ],
        success_metrics=[
            RoadmapSection(
                title="Key Performance Indicators",
                priority="High",
                timeline="Ongoing",
                content=[
                    "Enterprise customer acquisition rate",
                    "User engagement metrics",
                    "Processing accuracy benchmarks"
                ]
            )
        ],
        summary="Strategic roadmap for enterprise market expansion with focus on AI-powered voice processing capabilities."
    )

def get_demo_process_doc() -> ProcessDocument:
    """Return mock data for process documentation demo mode."""
    return ProcessDocument(
        title="Deploying a New Feature to Production",
        overview="A step-by-step guide for safely deploying new features to the production environment",
        prerequisites=[
            "Access to the deployment pipeline",
            "Completed code review",
            "Passing test suite",
            "Change request approval"
        ],
        steps=[
            ProcessStep(
                number=1,
                action="Create deployment branch",
                details="Create a new branch from main named 'deploy/feature-name'",
                outcome="New deployment branch is ready"
            ),
            ProcessStep(
                number=2,
                action="Run pre-deployment checks",
                details="Execute the pre-deployment checklist including security scans",
                outcome="All pre-deployment checks pass"
            ),
            ProcessStep(
                number=3,
                action="Deploy to staging",
                details="Use the deployment pipeline to push changes to staging environment",
                outcome="Feature is live in staging environment"
            ),
            ProcessStep(
                number=4,
                action="Run smoke tests",
                details="Execute the smoke test suite against staging environment",
                outcome="All smoke tests pass"
            ),
            ProcessStep(
                number=5,
                action="Deploy to production",
                details="Use the deployment pipeline to push changes to production",
                outcome="Feature is live in production"
            )
        ],
        notes=[
            "Always deploy during off-peak hours",
            "Have rollback plan ready",
            "Monitor error rates after deployment",
            "Update documentation after successful deployment"
        ]
    )
