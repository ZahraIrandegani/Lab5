# Geoweb IoT Sensor Application

## Overview
This web application is a real-time IoT sensor tracking system using MQTT protocol, Leaflet maps, and geolocation services. It allows users to connect to an MQTT broker, publish messages, share location status, and visualize temperature data on an interactive map.

## Live Demo
**https://zahrairandegani.github.io/Lab5/**

## Features

### 1. MQTT Broker Connection
- Users can specify custom MQTT broker host and port
- Supports secure SSL connections
- Flexible connection management with Start/End buttons

### 2. Connection Controls
- **Start Button**: 
  - Establishes connection to the specified MQTT broker
  - Disables host and port input fields during active connection
- **End Button**: 
  - Disconnects from the MQTT broker
  - Re-enables host and port input fields

### 3. Automatic Reconnection
- Automatically attempts to reconnect if the connection is lost
- Displays status messages for connection events

### 4. Message Publishing
- **Publish Button**:
  - Allows sending custom messages to any topic
  - Demonstrates flexibility in MQTT communication

### 5. Status Sharing
- **Share My Status Button**:
  - Generates a GeoJSON message containing:
    - Current geographic coordinates
    - Random temperature value between -40°C and 60°C
  - Publishes the message to a specified topic
  - Compatible with MQTTX for message verification

### 6. Interactive Map Visualization
- Uses Leaflet.js for map rendering
- Displays current location marker
- Color-coded temperature indicators:
  - Blue: Temperature < 10°C
  - Green: Temperature between 10°C and 30°C
  - Red: Temperature > 30°C
- Popup shows exact temperature when marker is clicked

### 7. MQTT Topic Convention
- Topic format: `<course_code>/<name>/my_temperature`
- Example: `ENGO651/Zahra_Irandegani/my_temperature`

## Prerequisites
- Modern web browser with geolocation support
- Active internet connection
- MQTT broker (default: broker.emqx.io)

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Paho MQTT JavaScript Library
- Leaflet.js
- OpenStreetMap

## Setup and Installation
1. Clone the repository
2. Open `index.html` in a modern web browser
3. Ensure all dependencies are loaded from CDNs

## Usage Instructions
1. Enter MQTT broker details (host and port)
2. Click "Start" to establish connection
3. Use buttons to:
   - Share status (generates random location/temperature)
   - Publish custom messages
   - End connection

## Compatibility
- Tested with MQTTX for message publishing and subscribing
- Works with various MQTT brokers

## Demonstration
- Publish GeoJSON from MQTTX to `<course_code>/<name>/my_temperature`
- Observe real-time map updates
- Verify message receipt and location tracking

## Accessing on Multiple Devices
- Hosted on GitHub Pages for easy access
- Responsive design supports mobile and desktop browsers
- Simply visit the live demo link from any device

## Security
- Supports SSL connections
- No persistent authentication (for demonstration purposes)

## Limitations
- Requires user permission for geolocation
- Temperature is randomly generated
- Depends on browser and network capabilities


## Author
Zahra Irandegani
ENGO651 Lab 5 Assignment