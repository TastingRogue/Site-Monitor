// FirebaseArduino API.

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "site-monitor-01.firebaseio.com/"
#define FIREBASE_AUTH "bGZn3Dbxpxt8nIiRGQhf1FmiQgZSjpho2oSvbgG6"
#define WIFI_SSID "TOTALPLAY_A027B3"
#define WIFI_PASSWORD "2WD43T2C4W"

int ledPower = 5;

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
  Serial.println();
  Serial.print("MAC: ");
  Serial.println(WiFi.macAddress());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  pinMode(ledPower, OUTPUT);
}

void loop() {
  //Main code
  int ledStatus = Firebase.getInt("ledStatus");
  Serial.println(ledStatus);
  if(ledStatus){
    digitalWrite(ledPower, HIGH); 
  }
  else{
    digitalWrite(ledPower, LOW);
  }
}
