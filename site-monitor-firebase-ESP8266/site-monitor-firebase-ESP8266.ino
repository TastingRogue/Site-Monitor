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
#define FIREBASE_HOST "https://site-monitor-01.firebaseio.com/"
#define FIREBASE_AUTH "AIzaSyBjTGkYBr8DlxZLATlkEsi9geEMK_DldZY"
#define WIFI_SSID "ARRIS-0D65"
#define WIFI_PASSWORD "748A0DF00D65"
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
  pinMode(D8, OUTPUT);
}

void humidityAlert(){
  int Humidity = myHumidity.readHumidity();
  if(Humidity > 55){
    Firebase.setInt("humidityAlert", 1);  
  }
  else{
    Firebase.setInt("humidityAlert", 0);
  }
}

void loop() {
  //Main code
  humidityAlert();

//  Serial.print(" Temperature:");
//  Serial.print(myHumidity.readTemperature(), 1);
//  Serial.print("C");
//  Serial.print(" Humidity:");
//  Serial.print(myHumidity.readHumidity(), 1);
//  Serial.print("%");
//  Serial.println(Firebase.getInt("ledStatus"));
  if(Firebase.getInt("ledStatus")){
    digitalWrite(led, LOW); 
  }
  else{
    digitalWrite(led, HIGH);
  }
  Firebase.setInt ("Temperature",myHumidity.readTemperature());
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
  Firebase.setInt ("Humidity",myHumidity.readHumidity());
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
}
