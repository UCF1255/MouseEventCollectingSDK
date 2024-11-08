class MouseEventSDK {
    constructor() {
        this.events = [];                 // Array to store collected events
        this.maxEvents = 1000;            // Maximum number of events to track
        this.isCollecting = false;        // Flag to track if event collection is active
        this.eventHandlers = {};          // Store the handlers for removing events
    }

    // Start collecting mouse events
    start() {
        document.getElementById('data').value = "Collecting mouse events...";
        if (this.isCollecting) {
            console.warn('Mouse event collection is already active.');
            return;
        }

        this.isCollecting = true;
        this.events = [];                  // Reset events when starting collection
        console.log('Started collecting mouse events.');

        this.addListeners();               // Add event listeners
        this.updateEventCount();           // Update event count on start
    }

    // Stop collecting mouse events
    stop() {
        document.getElementById('data').value = "Stopped collecting mouse events."; 
        if (!this.isCollecting) {
            console.warn('Mouse event collection is not active.');
            return;
        }

        this.isCollecting = false;
        console.log('Stopped collecting mouse events.');

        this.removeListeners();           // Remove event listeners
        this.updateEventCount();          // Update event count when stopping collection
    }

    // Add event listeners for all specified mouse events
    addListeners() {
        const eventsToTrack = [
            'mousemove', 'mouseenter', 'mouseleave', 
            'click', 'dblclick', 'mousedown', 'mouseup', 'contextmenu'
        ];

        eventsToTrack.forEach(eventType => {
            // Define the handler and store a reference for later removal
            const handler = this.collectMouseEvent.bind(this);
            this.eventHandlers[eventType] = handler;
            document.addEventListener(eventType, handler);
        });
    }

    // Remove event listeners when collection is stopped
    removeListeners() {
        const eventsToTrack = [
            'mousemove', 'mouseenter', 'mouseleave', 
            'click', 'dblclick', 'mousedown', 'mouseup', 'contextmenu'
        ];

        eventsToTrack.forEach(eventType => {
            const handler = this.eventHandlers[eventType];
            if (handler) {
                document.removeEventListener(eventType, handler);
            }
        });
    }

    // Collect mouse event data and store it
    collectMouseEvent(event) {
        // If we exceed the maximum number of events, apply FIFO strategy
        if (this.events.length >= this.maxEvents) {
            this.events.shift();                                                // Remove the oldest event
        }

        // Capture event details
        const eventData = {
            type: event.type,
            x: event.clientX,                                                   // Mouse X position relative to the viewport
            y: event.clientY,                                                   // Mouse Y position relative to the viewport
            timestamp: Date.now(),
            button: event.button || null,                                       // Button pressed (left, middle, right)
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            target: event.target.tagName,                                      // Tag name of the target element
            modifiers: this.getModifiers(event)
        };

        // Push the event to the array (only if we are collecting)
        if (this.isCollecting) {
            this.events.push(eventData);
        }

        // Update the event count in the UI
        this.updateEventCount();
    }

    // Extract modifier keys from the event
    getModifiers(event) {
        return {
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey
        };
    }

    // Get all collected events in JSON format
    getData() {
        return JSON.stringify(this.events, null, 2);  
    }

    updateEventCount() {
        const eventCountElement = document.getElementById('eventCount');
        eventCountElement.textContent = `Events Collected: ${this.events.length}`;
    }
}

// Expose the SDK globally to be used in the HTML page
const mouseEventSDK = new MouseEventSDK();
