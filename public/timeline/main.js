document.addEventListener('DOMContentLoaded', () => {

    const myAppCallbacks = {
        openCodeRepo: function(nodeId) {
            console.log(`Callback: Opening code repository for node ID: ${nodeId}`);
            const currentData = timelineRenderer.getCurrentTimelineData();
            const node = currentData?.nodes.find(n => n.id === nodeId);
            const app = node?.apps?.find(a => a.callbackId === 'openCodeRepo');
            if (app && app.url) {
                 window.open(app.url, '_blank');
            } else {
                 alert('Error: Code repository URL not found for this node.');
            }
        },
        openTaskBoard: function(nodeId) {
            console.log(`Callback: Opening task board for node ID: ${nodeId}`);
            alert(`Simulating opening task board for node: ${nodeId}`);
        },
    };

    dataStorageManager.registerAdapter('local', storageAdapters.localStorageAdapter);
    dataStorageManager.registerAdapter('session', storageAdapters.sessionStorageAdapter);
    dataStorageManager.registerAdapter('remote', storageAdapters.remoteStorageAdapter);


    const isStorageManagerInitialized = dataStorageManager.init({
        storageType: 'local',
        key: 'myTimelineData'
    });

    if (!isStorageManagerInitialized) {
        console.error("Failed to initialize data storage manager.");
        return;
    }

    const isRendererInitialized = timelineRenderer.init('myTimelineContainer', myAppCallbacks);

    if (!isRendererInitialized) {
        console.error("Failed to initialize timeline renderer. Check container ID.");
        return;
    }

    async function loadAndRenderTimeline() {
        const loadedTimeline = await dataStorageManager.loadData();

        if (loadedTimeline) {
            console.log("Loaded timeline from storage:", loadedTimeline);
            timelineDataManager.importTimeline(JSON.stringify(loadedTimeline));
            const timelineToRender = timelineDataManager.getTimeline(loadedTimeline.id);
            if (timelineToRender) {
                 timelineRenderer.render(timelineToRender);
            } else {
                 console.error("Failed to get timeline from data manager after import.");
                 // Fallback to creating default if load/import fails
                 createAndRenderDefaultTimeline();
            }
        } else {
            console.log("No timeline found in storage. Creating default.");
            createAndRenderDefaultTimeline();
        }
    }

    function createAndRenderDefaultTimeline() {
         const initialTimelineData = {
            "id": "project-alpha-timeline",
            "timelineConfig": {
                "containerId": "myTimelineContainer",
                "displayMode": "horizontal",
                "nodeSize": 30,
                "pathThickness": 8,
                "colors": {
                    "completedPath": "#28a745",
                    "remainingPath": "#ced4da",
                    "nodeFill": "#007bff",
                    "nodeBorder": "#0056b3"
                },
                "animationDuration": "1.5s",
                "spiralConfig": {
                     "rowHeight": 100,
                     "horizontalPadding": 40
                }
            },
            "nodes": [
                { "id": "node-initiation", "location": 5, "title": "Project Initiation", "details": "Define scope, objectives, and resources.", "percentageCompleted": 100, "apps": [], "isCurrent": false },
                { "id": "node-planning", "location": 15, "title": "Planning Phase", "details": "Develop detailed project plan.", "percentageCompleted": 100, "apps": [{ "name": "Project Plan Doc", "hint": "View plan", "url": "https://example.com/plan.pdf" }], "isCurrent": false },
                 { "id": "node-design", "location": 25, "title": "Design Phase", "details": "Create system architecture and UI/UX.", "percentageCompleted": 100, "apps": [], "isCurrent": false },
                { "id": "node-execution-1", "location": 35, "title": "Execution (Part 1)", "details": "Begin core development.", "percentageCompleted": 100, "apps": [{ "name": "Code Repo", "hint": "Access code", "callbackId": "openCodeRepo" }], "isCurrent": false },
                { "id": "node-execution-2", "location": 45, "title": "Execution (Part 2)", "details": "Continue development, integrate modules.", "percentageCompleted": 85, "apps": [{ "name": "Task Management", "hint": "Check tasks", "callbackId": "openTaskBoard" }], "isCurrent": true },
                 { "id": "node-testing-1", "location": 55, "title": "Testing (Alpha)", "details": "Internal testing and bug fixing.", "percentageCompleted": 40, "apps": [], "isCurrent": false },
                 { "id": "node-testing-2", "location": 65, "title": "Testing (Beta)", "details": "External beta testing.", "percentageCompleted": 10, "apps": [], "isCurrent": false },
                 { "id": "node-deployment", "location": 75, "title": "Deployment Prep", "details": "Prepare for production release.", "percentageCompleted": 0, "apps": [], "isCurrent": false },
                 { "id": "node-release", "location": 85, "title": "Go Live", "details": "Launch the project.", "percentageCompleted": 0, "apps": [], "isCurrent": false },
                 { "id": "node-closure", "location": 95, "title": "Project Closure", "details": "Final review and sign-off.", "percentageCompleted": 0, "apps": [], "isCurrent": false }
            ]
        };
        const defaultTimeline = timelineDataManager.createTimeline(initialTimelineData.timelineConfig, initialTimelineData.nodes);
        if (defaultTimeline) {
             timelineRenderer.render(defaultTimeline);
             // Optionally save the default timeline immediately
             // dataStorageManager.saveData(defaultTimeline);
        } else {
             console.error("Failed to create default timeline data.");
        }
    }


    loadAndRenderTimeline();


    const modeButtons = document.querySelectorAll('.mode-selector button');
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedMode = button.getAttribute('data-mode');
            timelineRenderer.switchMode(selectedMode);

            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    const initialMode = timelineRenderer.getCurrentMode();
    const initialButton = document.querySelector(`.mode-selector button[data-mode="${initialMode}"]`);
    if (initialButton) {
        initialButton.classList.add('active');
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (timelineRenderer.getCurrentMode() !== 'horizontal') {
                 const currentData = timelineRenderer.getCurrentTimelineData();
                 if (currentData) {
                     timelineRenderer.render(currentData);
                 }
            }
        }, 250);
    });

    // Example of saving data when the timeline is updated (you would trigger this
    // whenever a node is moved, percentage changes, etc.)
    // For demonstration, let's simulate saving after 10 seconds
    // setTimeout(async () => {
    //     console.log("Simulating saving current timeline data...");
    //     const currentData = timelineRenderer.getCurrentTimelineData();
    //     if (currentData) {
    //         const success = await dataStorageManager.saveData(currentData);
    //         if (success) {
    //             console.log("Timeline data saved successfully after update.");
    //         } else {
    //             console.error("Failed to save timeline data after update.");
    //         }
    //     }
    // }, 10000);


});
