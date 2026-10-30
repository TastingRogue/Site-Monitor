#include "config.h"
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Set these to run example.

//Cambiar SSID y contraseña
#define DHTPIN 2     // Digital pin connected to the DHT sensor 
#define DHTTYPE    DHT11     // DHT 11

FirebaseData firebaseData;
DHT_Unified dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // set value
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  float temp = event.temperature;
  dht.humidity().getEvent(&event);
  float Humedad = event.relative_humidity;
  if (isnan(temp) || isnan(Humedad) || temp < -40 || temp > 125 || Humedad < 0 || Humedad > 100) {
    Serial.println("Invalid sensor reading");
    delay(2000);
    return;
  }

  Serial.print("Temperatura: ");
  Serial.println(temp);
  Serial.print("Humedad: ");
  Serial.println(Humedad);
  
  //Cambiar por columna de DB
  if (!Firebase.setFloat(firebaseData, "Temperature", temp)) Serial.println(firebaseData.errorReason());
  if (!Firebase.setFloat(firebaseData, "Humidity", Humedad)) Serial.println(firebaseData.errorReason());
  if (!Firebase.setInt(firebaseData, "humidityAlert", Humedad > 55 ? 1 : 0)) Serial.println(firebaseData.errorReason());
  delay(2000);
}
