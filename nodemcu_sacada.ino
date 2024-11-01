#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>


const char* WIFI_SSID = "windos7"; 
const char* WIFI_PASSWORD = "WIND@555@"; 

WebSocketsServer webSocket = WebSocketsServer(81);
String receivedMessage = "";

String payloadToString(uint8_t * payload, size_t length) {
    String message = "";
    for (size_t i = 0; i < length; i++) {
        message += (char)payload[i];
    }c:\Users\Rehan-Khan\Downloads\arduino_files\arduinocodes\nodemcu_sacada\nodemcu_sacada.ino
    return message;
}

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    switch (type) {
        case WStype_TEXT:
            {
                receivedMessage = payloadToString(payload, length);
                
                Serial.println("Received Message: " + receivedMessage);
                if (receivedMessage.equalsIgnoreCase("hello")) {
                    webSocket.sendTXT(num, "Welcome to the WebSocket server!");
                }
            }
            break;
        
        case WStype_CONNECTED:
            Serial.println("Client Connected!");
            break;
        
        case WStype_DISCONNECTED:
            Serial.println("Client Disconnected!");
            break;
    }
}

void setup() {
    Serial.begin(115200);
    delay(100);
    pinMode(LED_BUILTIN,OUTPUT);
    digitalWrite(LED_BUILTIN,HIGH);
    Serial.println("\nWebSocket Server Starting...");

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to WiFi");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    webSocket.begin();
    webSocket.onEvent(onWebSocketEvent);
    Serial.println("WebSocket Server Started!");
}

void loop() {
    webSocket.loop();


      
    
}