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

// Generate GeoJSON
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
            console.error("Geolocation error: " + error.message);
        }
    );
}

document.getElementById('shareBtn').addEventListener('click', () => {
    getGeoJSON((geojson) => {
        const message = new Paho.MQTT.Message(JSON.stringify(geojson));
        message.destinationName = TOPIC;
        client.send(message);
    });
});