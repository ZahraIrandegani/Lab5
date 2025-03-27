// Initialize Leaflet map
function initMap(lat = 51.505, lng = -0.09) {
    map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}


// MQTT Connection
let client = null;

document.getElementById('startBtn').addEventListener('click', () => {
    const host = document.getElementById('host').value;
    const port = parseInt(document.getElementById('port').value);

    client = new Paho.MQTT.Client(host, port, "clientId_" + parseInt(Math.random() * 100));
    
    client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
            console.log("Connection lost:" + responseObject.errorMessage);
        }
    };
    
    client.connect({
        onSuccess: () => {
            console.log("Connected to MQTT Broker");
        },
        onFailure: (message) => {
            console.log("Connection failed: " + message.errorMessage);
        }
    });
});