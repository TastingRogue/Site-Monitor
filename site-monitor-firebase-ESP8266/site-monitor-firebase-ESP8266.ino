#include "config.h"
#include <Firebase.h>
#include <FirebaseArduino.h>
#include <FirebaseCloudMessaging.h>
#include <FirebaseError.h>
#include <FirebaseHttpClient.h>
#include <FirebaseObject.h>

// FirebaseArduino API.

#include <ESP8266WiFi.h>
#include <Wire.h>
#include "SparkFunHTU21D.h"

// Set these to run example.
#define led 2

//Create an instance of the object
HTU21D myHumidity;

int tempperatureVal = 1;
int humidityVal = 0;

void setup() {
  //Setup code
  Serial.begin(9600);

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
  Serial.print("MAC: ");
  Serial.println(WiFi.macAddress());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  myHumidity.begin();
  pinMode(led, OUTPUT);
  digitalWrite(led, HIGH);
  pinMode(D8, OUTPUT);
}

void loop() {
  delay(2000);
  if (WiFi.status() != WL_CONNECTED) { WiFi.reconnect(); return; }
  float temperature = myHumidity.readTemperature();
  float humidity = myHumidity.readHumidity();
  // HTU21D reports I2C/CRC errors as values outside the physical range.
  if (isnan(temperature) || isnan(humidity) || temperature < -40 || temperature > 125 || humidity < 0 || humidity > 100) {
    Serial.println("Invalid sensor reading");
    return;
  }
  int requestedLed = Firebase.getInt("ledStatus");
  if (!Firebase.failed() && (requestedLed == 0 || requestedLed == 1)) {
    digitalWrite(led, requestedLed ? LOW : HIGH);
  }
  Firebase.setFloat("Temperature", temperature);
  if (Firebase.failed()) { Serial.println(Firebase.error()); return; }
  Firebase.setFloat("Humidity", humidity);
  if (Firebase.failed()) { Serial.println(Firebase.error()); return; }
  Firebase.setInt("humidityAlert", humidity > 55 ? 1 : 0);
  if (Firebase.failed()) Serial.println(Firebase.error());
}
