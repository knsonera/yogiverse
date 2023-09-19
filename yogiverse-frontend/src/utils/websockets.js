// I wrote this code

// Creating a WebSocket instance and establish a connection to the specified URL
export const ws = new WebSocket('ws://localhost:8000/ws/chat/?token=' + localStorage.getItem('authToken'));

// WebSocket connection is opened
ws.addEventListener('open', function(event) {
   console.log("Websocket connection was opened.");
});

// WebSocket message received
ws.addEventListener('message', function(event) {
    // Parse the received data as JSON
    const receivedData = JSON.parse(event.data);
    console.log('Websocket Received message:', receivedData);
});

// WebSocket connection is closed
ws.addEventListener('close', function(event) {
    console.log('Websocket connection was closed.');
});

// WebSocket errors
ws.addEventListener('error', function(event) {
    console.log('Websocket error occurred:', event);
});

// end of the code I wrote
