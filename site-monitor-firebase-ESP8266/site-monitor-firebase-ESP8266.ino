// FirebaseArduino API.

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "site-monitor-01.firebaseio.com"
#define FIREBASE_AUTH "odewilCLq80qFMQQotsrp2bz2yQWkur21BVZ5Bm2"
#define WIFI_SSID "Unosquare Mobiles"
#define WIFI_PASSWORD "3336789139"
#define led 2

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
  pinMode(led, OUTPUT);
  pinMode(D8, OUTPUT);
}

int addition(int temp){
  temp++;
  return(temp);
}
void humidityAlert(){
  int alert = digitalRead(D8);
  if(alert == HIGH){
    Firebase.setInt("humidityAlert", 1);  
  }
  else{
    Firebase.setInt("humidityAlert", 0);
  }
}

void loop() {
  //Main code
  tempperatureVal = addition(tempperatureVal);
  humidityAlert();
  
  Serial.print(tempperatureVal);
  Serial.println(Firebase.getInt("ledStatus"));
  if(Firebase.getInt("ledStatus")){
    digitalWrite(led, LOW); 
  }
  else{
    digitalWrite(led, HIGH);
  }
  Firebase.setInt ("Temperature",tempperatureVal);
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
  Firebase.setInt ("Humidity",humidityVal);
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      return;
  }
}
