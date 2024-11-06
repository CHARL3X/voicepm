"""Demo data generator for the Constellation Format"""

def get_demo_constellation():
    """Returns a demo constellation output for testing"""
    return {
        "title": "Product Launch Strategy Meeting",
        "summary": "Team sync on Cleanse landing page, training videos, and upcoming launches",
        "central_star": {
            "title": "Cleanse Launch Strategy",
            "description": "January product launch with December pre-sale window",
            "timeline": "December - January",
            "impact": "Successful market entry with optimized customer journey"
        },
        "orbits": [
            {
                "title": "Landing Page",
                "points": [
                    "Quiz reduced to 6 questions",
                    "Four videos with thumbnails",
                    "Mobile-optimized design"
                ],
                "sentiment": "positive",
                "priority": "high",
                "dependencies": [
                    {
                        "type": "blocking",
                        "source": "Landing Page",
                        "target": "Product Launch",
                        "description": "Required for pre-sale start"
                    }
                ]
            },
            {
                "title": "Content Requirements",
                "points": [
                    "Video titles match shipper",
                    "Simple navigation flow",
                    "Mobile-first approach"
                ],
                "sentiment": "neutral",
                "priority": "medium",
                "dependencies": []
            },
            {
                "title": "Training Video",
                "points": [
                    "5-minute format with Brenda",
                    "Need presentation reprint",
                    "Requires compliance review"
                ],
                "sentiment": "neutral",
                "priority": "medium",
                "dependencies": []
            },
            {
                "title": "Education Summit",
                "points": [
                    "January 23-24",
                    "All educators attending",
                    "Multiple breakout sessions"
                ],
                "sentiment": "positive",
                "priority": "medium",
                "dependencies": []
            }
        ],
        "timeline": [
            {
                "date": "December",
                "title": "Pre-sale Start",
                "description": "Initial sales window opens"
            },
            {
                "date": "Early January",
                "title": "Product Launch",
                "description": "Full market release"
            },
            {
                "date": "January 23-24",
                "title": "Education Summit",
                "description": "Team training and alignment"
            }
        ],
        "support": {
            "questions": [
                "Expo West participation details?",
                "Training video shoot location?",
                "Literature quantity needed?"
            ],
            "actions": [
                "Schedule Brenda video shoot",
                "Update Amazon/website assets",
                "Print new presentation materials"
            ]
        },
        "sentiment_patterns": [
            {
                "type": "positive",
                "markers": ["optimized", "successful", "aligned"],
                "confidence": 0.85
            }
        ],
        "decision_flows": [
            {
                "initial": "10-question quiz",
                "progression": [
                    "Discussed simplification",
                    "Proposed 6 questions",
                    "Focus on condition specifics"
                ],
                "final": "6-question optimized quiz"
            }
        ],
        "topic_threads": [
            {
                "topic": "Landing Page",
                "mentions": [
                    "Initial quiz discussion",
                    "Video requirements",
                    "Mobile optimization"
                ],
                "evolution": {
                    "initial": "Complex quiz format",
                    "progression": ["Quiz simplification", "Content optimization"],
                    "final": "Streamlined user experience"
                }
            }
        ],
        "role_assignments": [
            {
                "person": "Brenda",
                "assignments": ["Record training video"],
                "implied_tasks": ["Review presentation materials", "Prepare for video shoot"]
            }
        ]
    }

def get_demo_constellation_preview():
    """Returns preview data for the constellation format option"""
    return {
        "title": "Constellation Format",
        "description": "Transform conversations into interconnected insights with pattern recognition",
        "features": [
            "Pattern recognition and relationship mapping",
            "Timeline and dependency tracking",
            "Sentiment and priority analysis",
            "Decision flow visualization"
        ],
        "preview_image": "/static/images/constellation-preview.svg",
        "format_type": "constellation"
    }
