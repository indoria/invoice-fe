const timelineDataManager = (function() {
    const timelines = {};

    function createTimeline(config, nodes) {
        if (!config || !nodes || !Array.isArray(nodes)) {
            console.error("createTimeline: Invalid configuration or nodes provided.");
            return null;
        }

        const id = config.id || `timeline-${Date.now()}`;
        if (timelines[id]) {
            console.error(`createTimeline: Timeline with ID "${id}" already exists.`);
            return null;
        }

        const newTimeline = {
            id: id,
            timelineConfig: config,
            nodes: nodes
        };

        timelines[id] = newTimeline;
        console.log(`Timeline "${id}" created.`);
        return newTimeline;
    }

    function getTimeline(id) {
        return timelines[id];
    }

    function getAllTimelines() {
        return { ...timelines };
    }

     function updateTimeline(id, newData) {
        const timeline = timelines[id];
        if (!timeline) {
            console.error(`updateTimeline: Timeline with ID "${id}" not found.`);
            return null;
        }

        if (newData.timelineConfig) {
            timeline.timelineConfig = { ...timeline.timelineConfig, ...newData.timelineConfig };
        }
        if (newData.nodes && Array.isArray(newData.nodes)) {
             timeline.nodes = newData.nodes;
        }
        console.log(`Timeline "${id}" updated.`);
        return timeline;
    }


    function deleteTimeline(id) {
        if (timelines[id]) {
            delete timelines[id];
            console.log(`Timeline "${id}" deleted.`);
            return true;
        }
        console.warn(`deleteTimeline: Timeline with ID "${id}" not found.`);
        return false;
    }

    function exportTimeline(id) {
        const timeline = timelines[id];
        if (timeline) {
            try {
                return JSON.stringify(timeline, null, 2);
            } catch (e) {
                console.error(`exportTimeline: Error stringifying timeline "${id}":`, e);
                return null;
            }
        }
        console.warn(`exportTimeline: Timeline with ID "${id}" not found.`);
        return null;
    }

    function importTimeline(jsonString) {
        try {
            const timeline = JSON.parse(jsonString);
            if (timeline && timeline.id && timeline.timelineConfig && Array.isArray(timeline.nodes)) {
                 if (timelines[timeline.id]) {
                     console.warn(`importTimeline: Timeline with ID "${timeline.id}" already exists. Overwriting.`);
                 }
                 timelines[timeline.id] = timeline;
                 console.log(`Timeline "${timeline.id}" imported.`);
                 return timeline;
            } else {
                 console.error("importTimeline: Invalid JSON structure for a timeline.");
                 return null;
            }
        } catch (e) {
            console.error("importTimeline: Error parsing JSON string:", e);
            return null;
        }
    }


    return {
        createTimeline: createTimeline,
        getTimeline: getTimeline,
        getAllTimelines: getAllTimelines,
        updateTimeline: updateTimeline,
        deleteTimeline: deleteTimeline,
        exportTimeline: exportTimeline,
        importTimeline: importTimeline
    };

})();
