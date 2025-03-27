const YOUR_NAME = "Zahra_Irandegani";
const COURSE_CODE = "ENGO651";
const DEFAULT_TOPIC = `${COURSE_CODE}/${YOUR_NAME}/my_temperature`

let client = null;
let map = null;
let marker = null;

// Initialize Leaflet map
function initMap(lat = 51.505, lng = -0.09) {
    map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Get marker color based on temperature
function getMarkerColor(temp) {
    if (temp < 10) return 'blue';
    if (temp < 30) return 'green';
    return 'red';
}

// Update map with new location and temperature
function updateMap(geojson) {
    const { coordinates } = geojson.geometry;
    const temp = geojson.properties.temperature;
    const [lng, lat] = coordinates;

    if (marker) map.removeLayer(marker);
    marker = L.circleMarker([lat, lng], {
        radius: 8,
        color: getMarkerColor(temp),
        fillOpacity: 0.8
    }).addTo(map);
    marker.bindPopup(`Temperature: ${temp}°C`).openPopup();
    map.setView([lat, lng], 13);
}

// Generate GeoJSON with current location and random temperature
function getGeoJSON(callback) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const geojson = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [position.coords.longitude, position.coords.latitude]
                },
                properties: {
                    temperature: Math.floor(Math.random() * 100) - 40 // Random -40 to 60
                }
            };
            callback(geojson);
        },
        (error) => {
            document.getElementById('status').innerText = "Geolocation error: " + error.message;
        }
    );
}

// Callback for successful connection
function onConnect() {
    const topic = document.getElementById('topic').value;
    document.getElementById('status').innerText = "Connected to " + client.host;
    client.subscribe(topic, (err) => {
        if (err) {
            document.getElementById('status').innerText = "Subscription failed: " + err;
        } else {
            document.getElementById('status').innerText += "\nSubscribed to " + topic;
        }
    });
    
    document.getElementById('startBtn').disabled = true;
    document.getElementById('endBtn').disabled = false;
    document.getElementById('shareBtn').disabled = false;
    document.getElementById('publishBtn').disabled = false;
    document.getElementById('host').disabled = true;
    document.getElementById('port').disabled = true;
    document.getElementById('topic').disabled = true;
    
    if (!map) initMap();
}


// MQTT Connection
document.getElementById('startBtn').addEventListener('click', () => {
    const host = document.getElementById('host').value;
    const port = parseInt(document.getElementById('port').value);

    client = new Paho.MQTT.Client(host, port, "clientId_" + parseInt(Math.random() * 100));
    
    client.onConnectionLost = () => {
        document.getElementById('status').innerText = "Disconnected. Reconnecting...";
        setTimeout(() => client.connect({ onSuccess: onConnect }), 2000);
    };
    
    client.onMessageArrived = (message) => {
        const geojson = JSON.parse(message.payloadString);
        updateMap(geojson);
        document.getElementById('status').innerText = "Message received and map updated";
    };

    client.connect({
        onSuccess: onConnect,
        onFailure: (err) => {
            document.getElementById('status').innerText = "Connection failed: " + err.errorMessage;
        },
        useSSL: true,
        userName: "",
        password: ""
    });
});


// Share Status
document.getElementById('shareBtn').addEventListener('click', () => {
    const publishTopic = document.getElementById('publish-topic').value;
    getGeoJSON((geojson) => {
        const message = new Paho.MQTT.Message(JSON.stringify(geojson));
        message.destinationName = publishTopic;
        client.send(message);
        document.getElementById('status').innerText = "Status shared";
        updateMap(geojson);
    });
});