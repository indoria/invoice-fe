let timeline1 = {
    "timelineConfig": {
        "containerId": "myTimelineContainer",
        "nodeSize": 20, // in pixels
        "pathThickness": 4, // in pixels
        "colors": {
            "completedPath": "#4CAF50", // Green
            "remainingPath": "#ddd", // Light grey
            "nodeFill": "#2196F3", // Blue
            "nodeBorder": "#1976D2" // Darker blue
        },
        "animationDuration": "1s" // for current node blinking
    },
    "nodes": [
        {
            "id": "node1",
            "location": 10, // Percentage along the timeline (0-100)
            "title": "Project Start",
            "details": "Kick off meeting and planning.",
            "percentageCompleted": 100,
            "apps": [],
            "isCurrent": false
        },
        {
            "id": "node2",
            "location": 40,
            "title": "Phase 1 Completion",
            "details": "Development of core features.",
            "percentageCompleted": 75,
            "apps": [
                {
                    "name": "Code Repo",
                    "hint": "View the code repository",
                    "url": "https://github.com/example/repo",
                    "callbackId": "openCodeRepo" // We'll map this ID to a JS function
                },
                {
                    "name": "Task Board",
                    "hint": "Check task progress",
                    "callbackId": "openTaskBoard"
                }
            ],
            "isCurrent": true
        },
        {
            "id": "node3",
            "location": 80,
            "title": "Testing Begins",
            "details": "Start of QA and UAT.",
            "percentageCompleted": 20,
            "apps": [],
            "isCurrent": false
        },
        {
            "id": "node4",
            "location": 100,
            "title": "Project End",
            "details": "Final deployment and sign-off.",
            "percentageCompleted": 0,
            "apps": [],
            "isCurrent": false
        }
    ]
}