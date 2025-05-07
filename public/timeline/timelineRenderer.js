const timelineRenderer = (function() {
    let containerElement = null;
    let currentTimelineData = null;
    let currentDisplayMode = 'horizontal';
    let appCallbacks = {};

    const _displayModes = {};

    function registerDisplayMode(modeName, renderFunction) {
        if (typeof modeName !== 'string' || typeof renderFunction !== 'function') {
            console.error("registerDisplayMode: Invalid modeName or renderFunction.");
            return;
        }
        if (_displayModes[modeName]) {
            console.warn(`registerDisplayMode: Display mode "${modeName}" is already registered. Overwriting.`);
        }
        _displayModes[modeName] = renderFunction;
        console.log(`Display mode "${modeName}" registered.`);
    }

    function init(containerId, callbacks = {}) {
        containerElement = document.getElementById(containerId);
        if (!containerElement) {
            console.error(`timelineRenderer.init: Container element with ID "${containerId}" not found.`);
            return false;
        }
        appCallbacks = callbacks;
        console.log(`Timeline renderer initialized for container "${containerId}".`);
        return true;
    }

    function render(timelineData) {
        if (!containerElement) {
            console.error("timelineRenderer.render: Renderer not initialized. Call init() first.");
            return;
        }
        if (!timelineData || !timelineData.timelineConfig || !Array.isArray(timelineData.nodes)) {
             console.error("timelineRenderer.render: Invalid timeline data provided.");
             return;
        }

        currentTimelineData = timelineData;
        const config = currentTimelineData.timelineConfig;
        const nodes = currentTimelineData.nodes;

        const modeToRender = config.displayMode && _displayModes[config.displayMode] ? config.displayMode : 'horizontal';
        currentDisplayMode = modeToRender;

        containerElement.innerHTML = '';
        containerElement.className = '';
        containerElement.classList.add(`timeline-container--${currentDisplayMode}`);

        containerElement.style.setProperty('--node-size', `${config.nodeSize || 20}px`);
        containerElement.style.setProperty('--path-thickness', `${config.pathThickness || 4}px`);
        containerElement.style.setProperty('--completed-path-color', config.colors?.completedPath || '#4CAF50');
        containerElement.style.setProperty('--remaining-path-color', config.colors?.remainingPath || '#ddd');
        containerElement.style.setProperty('--node-fill', config.colors?.nodeFill || '#2196F3');
        containerElement.style.setProperty('--node-border', config.colors?.nodeBorder || '#1976D2');
        containerElement.style.setProperty('--animation-duration', config.animationDuration || '1s');
        containerElement.style.setProperty('--spiral-row-height', `${config.spiralConfig?.rowHeight || 80}px`);
        containerElement.style.setProperty('--spiral-horizontal-padding', `${config.spiralConfig?.horizontalPadding || 30}px`);

        nodes.sort((a, b) => (a.location || 0) - (b.location || 0));

        const nodeElements = {};
        nodes.forEach((node, index) => {
            const nodeElement = _createNodeElement(node);
            containerElement.appendChild(nodeElement);
            nodeElements[node.id] = nodeElement;
        });

        const renderModeFunction = _displayModes[currentDisplayMode];
        if (renderModeFunction) {
            renderModeFunction(containerElement, nodes, config, nodeElements, appCallbacks);
        } else {
            console.error(`timelineRenderer.render: No rendering function found for mode "${currentDisplayMode}".`);
        }

        _adjustContainerSize(containerElement, config);

        console.log(`Timeline "${timelineData.id}" rendered in mode "${currentDisplayMode}".`);
    }

    function switchMode(modeName) {
        if (!containerElement) {
            console.error("timelineRenderer.switchMode: Renderer not initialized. Call init() first.");
            return;
        }
        if (!currentTimelineData) {
             console.warn("timelineRenderer.switchMode: No timeline data loaded to switch mode.");
             return;
        }
        if (!_displayModes[modeName]) {
            console.warn(`timelineRenderer.switchMode: Display mode "${modeName}" is not registered.`);
            return;
        }

        currentTimelineData.timelineConfig.displayMode = modeName;
        render(currentTimelineData);
    }

    function getCurrentTimelineData() {
        return currentTimelineData;
    }

    function getCurrentMode() {
        return currentDisplayMode;
    }

    function _createNodeElement(node) {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('timeline-node');
        nodeElement.setAttribute('data-node-id', node.id);

        const percentageCompleted = typeof node.percentageCompleted === 'number' ? node.percentageCompleted : 0;
        if (percentageCompleted > 0) { nodeElement.classList.add('timeline-node--filled'); }
        if (percentageCompleted === 100) { nodeElement.classList.add('timeline-node--completed'); }
        if (node.isCurrent) { nodeElement.classList.add('timeline-node--current'); }

        const infoElement = _createNodeInfoElement(node);
        nodeElement.appendChild(infoElement);

        return nodeElement;
    }

    function _createNodeInfoElement(node) {
         const infoElement = document.createElement('div');
         infoElement.classList.add('node-info');

         infoElement.innerHTML = `<h4>${node.title || 'Untitled Node'}</h4>`;

         if (node.details) {
             infoElement.innerHTML += `<p>${node.details}</p>`;
         }

         const percentageCompleted = typeof node.percentageCompleted === 'number' ? node.percentageCompleted : 0;
         infoElement.innerHTML += `<p>Completed: ${percentageCompleted}%</p>`;

         if (node.apps && Array.isArray(node.apps) && node.apps.length > 0) {
             const appListElement = document.createElement('div');
             appListElement.classList.add('app-list');
             infoElement.appendChild(appListElement);

             node.apps.forEach(app => {
                 const appElement = document.createElement('div');
                 appElement.textContent = app.name || 'App Link';
                 if (app.hint) {
                      appElement.title = app.hint;
                 }

                 if (app.callbackId && appCallbacks[app.callbackId]) {
                      appElement.addEventListener('click', (event) => {
                           event.stopPropagation();
                           appCallbacks[app.callbackId](node.id);
                      });
                 } else if (app.url) {
                      appElement.addEventListener('click', (event) => {
                          event.stopPropagation();
                          window.open(app.url, '_blank');
                      });
                 } else {
                      appElement.classList.add('app-disabled');
                 }
                 appListElement.appendChild(appElement);
             });
         }
         return infoElement;
    }

    function _adjustContainerSize(container, config) {
         if (config.displayMode === 'vertical' || config.displayMode === 'spiral') {
             let maxBottom = 0;
             container.querySelectorAll('.timeline-node, .timeline-path').forEach(el => {
                 const rect = el.getBoundingClientRect();
                 const bottom = (rect.top + rect.height) - container.getBoundingClientRect().top;
                 if (bottom > maxBottom) {
                     maxBottom = bottom;
                 }
             });
             container.style.height = `${maxBottom + (config.nodeSize || 20)}px`;
        } else {
             container.style.height = '120px';
        }

        if (config.displayMode === 'vertical') {
             container.style.width = '300px';
             container.style.maxWidth = '95%';
        } else {
             container.style.width = '95%';
             container.style.maxWidth = '1400px';
        }
    }

    function _renderHorizontal(container, nodes, config, nodeElements) {
        const nodeRadius = (config.nodeSize || 20) / 2;
        const pathThickness = config.pathThickness || 4;

        nodes.forEach(node => {
            const nodeElement = nodeElements[node.id];
            const nodeLocation = typeof node.location === 'number' ? node.location : 0;
            nodeElement.style.left = `${nodeLocation}%`;
            nodeElement.style.top = '50%';
            nodeElement.style.transform = 'translate(-50%, -50%)';
        });

        for (let i = 0; i < nodes.length - 1; i++) {
            const startNode = nodes[i];
            const endNode = nodes[i + 1];

            const startElement = nodeElements[startNode.id];
            const endElement = nodeElements[endNode.id];

            if (!startElement || !endElement) continue;

            const containerRect = container.getBoundingClientRect();
            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();

            const startCenterX = (startRect.left + startRect.width / 2) - containerRect.left;
            const endCenterX = (endRect.left + endRect.width / 2) - containerRect.left;

            const pathStartX = startCenterX + nodeRadius;
            const pathEndX = endCenterX - nodeRadius;
            const totalPathDistance = pathEndX - pathStartX;

            if (totalPathDistance <= 0) continue;

            const startNodeCompletedPercentage = typeof startNode.percentageCompleted === 'number' ? startNode.percentageCompleted : 0;
            const completedPathWidth = (totalPathDistance * Math.max(0, Math.min(100, startNodeCompletedPercentage))) / 100;
            const remainingPathWidth = totalPathDistance - completedPathWidth;

            if (completedPathWidth > 0) {
                const completedPathElement = document.createElement('div');
                completedPathElement.classList.add('timeline-path', 'timeline-path--completed');
                completedPathElement.style.left = `${pathStartX}px`;
                completedPathElement.style.width = `${completedPathWidth}px`;
                completedPathElement.style.top = '50%';
                completedPathElement.style.transform = 'translateY(-50%)';
                container.appendChild(completedPathElement);
            }

            if (remainingPathWidth > 0) {
                 const remainingPathElement = document.createElement('div');
                 remainingPathElement.classList.add('timeline-path', 'timeline-path--remaining');
                 remainingPathElement.style.left = `${pathStartX + completedPathWidth}px`;
                 remainingPathElement.style.width = `${remainingPathWidth}px`;
                 remainingPathElement.style.top = '50%';
                 remainingPathElement.style.transform = 'translateY(-50%)';
                 container.appendChild(remainingPathElement);
            }
        }
    }

    function _renderVertical(container, nodes, config, nodeElements) {
         const nodeRadius = (config.nodeSize || 20) / 2;
         const pathThickness = config.pathThickness || 4;

         nodes.forEach(node => {
             const nodeElement = nodeElements[node.id];
             const nodeLocation = typeof node.location === 'number' ? node.location : 0;
             nodeElement.style.top = `${nodeLocation}%`;
             nodeElement.style.left = '50%';
             nodeElement.style.transform = 'translate(-50%, -50%)';
         });

         for (let i = 0; i < nodes.length - 1; i++) {
             const startNode = nodes[i];
             const endNode = nodes[i + 1];

             const startElement = nodeElements[startNode.id];
             const endElement = nodeElements[endNode.id];

             if (!startElement || !endElement) continue;

             const containerRect = container.getBoundingClientRect();
             const startRect = startElement.getBoundingClientRect();
             const endRect = endElement.getBoundingClientRect();

             const startCenterX = (startRect.left + startRect.width / 2) - containerRect.left;
             const startCenterY = (startRect.top + startRect.height / 2) - containerRect.top;
             const endCenterX = (endRect.left + endRect.width / 2) - containerRect.left;
             const endCenterY = (endRect.top + endRect.height / 2) - containerRect.top;

             const pathStartY = startCenterY + nodeRadius;
             const pathEndY = endCenterY - nodeRadius;
             const totalPathDistance = pathEndY - pathStartY;

             if (totalPathDistance <= 0) continue;

             const startNodeCompletedPercentage = typeof startNode.percentageCompleted === 'number' ? startNode.percentageCompleted : 0;
             const completedPathHeight = (totalPathDistance * Math.max(0, Math.min(100, startNodeCompletedPercentage))) / 100;
             const remainingPathHeight = totalPathDistance - completedPathHeight;

             const pathLeft = startCenterX - (pathThickness / 2);

             if (completedPathHeight > 0) {
                 const completedPathElement = document.createElement('div');
                 completedPathElement.classList.add('timeline-path', 'timeline-path--completed');
                 completedPathElement.style.top = `${pathStartY}px`;
                 completedPathElement.style.height = `${completedPathHeight}px`;
                 completedPathElement.style.left = `${pathLeft}px`;
                 completedPathElement.style.width = `${pathThickness}px`;
                 container.appendChild(completedPathElement);
             }

             if (remainingPathHeight > 0) {
                  const remainingPathElement = document.createElement('div');
                  remainingPathElement.classList.add('timeline-path', 'timeline-path--remaining');
                  remainingPathElement.style.top = `${pathStartY + completedPathHeight}px`;
                  remainingPathElement.style.height = `${remainingPathHeight}px`;
                  remainingPathElement.style.left = `${pathLeft}px`;
                  remainingPathElement.style.width = `${pathThickness}px`;
                  container.appendChild(remainingPathElement);
             }
         }
    }

    function _renderSpiral(container, nodes, config, nodeElements) {
        const nodeSize = config.nodeSize || 20;
        const nodeRadius = nodeSize / 2;
        const pathThickness = config.pathThickness || 4;
        const containerWidth = container.clientWidth;
        const rowHeight = config.spiralConfig?.rowHeight || 80;
        const horizontalPadding = config.spiralConfig?.horizontalPadding || 30;
        const effectiveWidth = containerWidth - (horizontalPadding * 2);
        const estimatedNodeSpacing = nodeRadius * 4;
        const nodesPerRow = Math.max(1, Math.floor(effectiveWidth / estimatedNodeSpacing));


        nodes.forEach((node, index) => {
            const nodeElement = nodeElements[node.id];
            const row = Math.floor(index / nodesPerRow);
            const posInRow = index % nodesPerRow;

            let horizontalPos;
            const spacingInRow = effectiveWidth / Math.max(1, nodesPerRow - 1);
            if (row % 2 === 0) {
                horizontalPos = horizontalPadding + (posInRow * spacingInRow);
            } else {
                horizontalPos = horizontalPadding + effectiveWidth - (posInRow * spacingInRow);
            }

            const verticalPos = (row * rowHeight) + (rowHeight / 2);

            nodeElement.style.left = `${horizontalPos}px`;
            nodeElement.style.top = `${verticalPos}px`;
            nodeElement.style.transform = 'translate(-50%, -50%)';
        });


        for (let i = 0; i < nodes.length - 1; i++) {
            const startNode = nodes[i];
            const endNode = nodes[i + 1];

            const startElement = nodeElements[startNode.id];
            const endElement = nodeElements[endNode.id];

            if (!startElement || !endElement) continue;

            const containerRect = container.getBoundingClientRect();
            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();

            const startCenterX = (startRect.left + startRect.width / 2) - containerRect.left;
            const startCenterY = (startRect.top + startRect.height / 2) - containerRect.top;
            const endCenterX = (endRect.left + endRect.width / 2) - containerRect.left;
            const endCenterY = (endRect.top + endRect.height / 2) - containerRect.top;

            const startNodeIndex = nodes.findIndex(n => n.id === startNode.id);
            const endNodeIndex = nodes.findIndex(n => n.id === endNode.id);

            const startNodeRow = Math.floor(startNodeIndex / nodesPerRow);
            const endNodeRow = Math.floor(endNodeIndex / nodesPerRow);

            const pathStartX = startCenterX + (startNodeRow % 2 === 0 ? nodeRadius : -nodeRadius);
            const pathStartY = startCenterY;

            const pathEndX = endCenterX + (endNodeRow % 2 === 0 ? -nodeRadius : nodeRadius);
            const pathEndY = endCenterY;

            let turnX, turnY;

            if (startNodeRow === endNodeRow) {
                turnX = pathEndX;
                turnY = pathStartY;
            } else {
                if (startNodeRow % 2 === 0) {
                    turnX = container.clientWidth - horizontalPadding;
                } else {
                    turnX = horizontalPadding;
                }
                turnY = pathEndY;
            }

            const segments = [];
            segments.push({
                type: 'horizontal',
                startX: pathStartX,
                startY: pathStartY,
                endX: turnX,
                endY: pathStartY,
                length: Math.abs(turnX - pathStartX)
            });

            if (startNodeRow !== endNodeRow) {
                segments.push({
                    type: 'vertical',
                    startX: turnX,
                    startY: pathStartY,
                    endX: turnX,
                    endY: pathEndY,
                    length: Math.abs(pathEndY - pathStartY)
                });
            }

             segments.push({
                type: 'horizontal',
                startX: turnX,
                startY: pathEndY,
                endX: pathEndX,
                endY: pathEndY,
                length: Math.abs(pathEndX - turnX)
            });


            const totalPathLength = segments.reduce((sum, segment) => sum + segment.length, 0);

            if (totalPathLength <= 0) continue;

            const startNodeCompletedPercentage = typeof startNode.percentageCompleted === 'number' ? startNode.percentageCompleted : 0;
            let completedLength = (totalPathLength * Math.max(0, Math.min(100, startNodeCompletedPercentage))) / 100;
            let remainingLength = totalPathLength - completedLength;

            segments.forEach(segment => {
                const segmentLength = segment.length;
                if (segmentLength === 0) return;

                const segmentCompleted = Math.min(segmentLength, completedLength);
                const segmentRemaining = Math.min(segmentLength - segmentCompleted, remainingLength);

                if (segmentCompleted > 0) {
                    const completedPathElement = document.createElement('div');
                    completedPathElement.classList.add('timeline-path', 'timeline-path--completed');

                    if (segment.type === 'horizontal') {
                        const actualStartX = Math.min(segment.startX, segment.endX);
                        completedPathElement.style.left = `${actualStartX + (segment.startX < segment.endX ? 0 : segmentLength - segmentCompleted)}px`;
                        completedPathElement.style.top = `${segment.startY - pathThickness / 2}px`;
                        completedPathElement.style.width = `${segmentCompleted}px`;
                        completedPathElement.style.height = `${pathThickness}px`;
                    } else {
                        const actualStartY = Math.min(segment.startY, segment.endY);
                        completedPathElement.style.top = `${actualStartY + (segment.startY < segment.endY ? 0 : segmentLength - segmentCompleted)}px`;
                        completedPathElement.style.left = `${segment.startX - pathThickness / 2}px`;
                        completedPathElement.style.height = `${segmentCompleted}px`;
                        completedPathElement.style.width = `${pathThickness}px`;
                    }
                    container.appendChild(completedPathElement);
                    completedLength -= segmentCompleted;
                }

                if (segmentRemaining > 0) {
                    const remainingPathElement = document.createElement('div');
                    remainingPathElement.classList.add('timeline-path', 'timeline-path--remaining');

                    if (segment.type === 'horizontal') {
                         const actualStartX = Math.min(segment.startX, segment.endX);
                         const completedPortionEnd = actualStartX + (segment.startX < segment.endX ? segmentCompleted : segmentLength - segmentCompleted);
                         remainingPathElement.style.left = `${completedPortionEnd}px`;
                         remainingPathElement.style.top = `${segment.startY - pathThickness / 2}px`;
                         remainingPathElement.style.width = `${segmentRemaining}px`;
                         remainingPathElement.style.height = `${pathThickness}px`;
                    } else {
                        const actualStartY = Math.min(segment.startY, segment.endY);
                        const completedPortionEnd = actualStartY + (segment.startY < segment.endY ? segmentCompleted : segmentLength - segmentCompleted);
                        remainingPathElement.style.top = `${completedPortionEnd}px`;
                        remainingPathElement.style.left = `${segment.startX - pathThickness / 2}px`;
                        remainingPathElement.style.height = `${segmentRemaining}px`;
                        remainingPathElement.style.width = `${pathThickness}px`;
                    }
                    container.appendChild(remainingPathElement);
                    remainingLength -= segmentRemaining;
                }
            });
        }
    }


    registerDisplayMode('horizontal', _renderHorizontal);
    registerDisplayMode('vertical', _renderVertical);
    registerDisplayMode('spiral', _renderSpiral);


    return {
        init: init,
        render: render,
        registerDisplayMode: registerDisplayMode,
        switchMode: switchMode,
        getCurrentTimelineData: getCurrentTimelineData,
        getCurrentMode: getCurrentMode
    };

})();
