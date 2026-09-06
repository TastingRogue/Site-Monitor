#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Set these to run example.
#define FIREBASE_HOST "https://site-monitor-01.firebaseio.com/"
#define FIREBASE_AUTH "Token"

//Cambiar SSID y contraseña
#define WIFI_SSID "ARRIS-0D65"
#define WIFI_PASSWORD "748A0DF"
#define DHTPIN 2     // Digital pin connected to the DHT sensor 
#define DHTTYPE    DHT11     // DHT 11

FirebaseData firebaseData;
DHT_Unified dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

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
  int temp = event.temperature;
  int Humedad = event.relative_humidity;

  Serial.print("Temperatura: ");
  Serial.println(temp);
  Serial.print("Humedad: ");
  Serial.println(Humedad);
  
  //Cambiar por columna de DB
  Firebase.setInt (firebaseData, "Temperature", temp);
  Firebase.setInt (firebaseData, "Humidity", Humedad);
  delay(1000);
}
