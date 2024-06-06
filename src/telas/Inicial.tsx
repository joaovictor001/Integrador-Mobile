import React, { useEffect, useState } from 'react';
import { Text, View,Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


interface Sensor {
  id: number;
  tipo: string;
  mac_address: string | null;
  latitude: number;
  longitude: number;
  localizacao: string;
  responsavel: string;
  unidade_medida: string;
  status_operacional: boolean;
  observacao: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export function Inicial() {
  const navigation = useNavigation();
  const [sensorProximo, setSensorProximo] = useState<Sensor | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // Raio da Terra em metros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distância em metros
    return d;
  };

  const fetchSensors = async () => {
    try {
      const response = await axios.get<Sensor[]>('http://10.0.2.2:8000/api/sensores');
      setSensors(response.data);
     

    } catch (error) {
      console.error(error);
      Alert.alert('Erro',"Erro ao puxar dados.")
    }
  };

  useEffect(() => {
    fetchSensors();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation.coords);

          // Calcular a distância entre a localização atual e os sensores
          let closestSensor: Sensor | null = null;
          let closestDistance: number | null = null;

          sensors.forEach(sensor => {
            const distance = haversine(newLocation.coords.latitude, newLocation.coords.longitude, sensor.latitude, sensor.longitude);
            if (closestDistance === null || distance < closestDistance) {
              closestDistance = distance;
              closestSensor = sensor;
            }
          });

          if (closestSensor) {
            setSensorProximo(closestSensor);
          }
        }
      );

      return () => {
        locationSubscription.remove();
      };
    })();
  }, [sensors]);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  // Calcular o initialRegion com base nos sensores
  const calculateInitialRegion = (sensors: Sensor[]): Region => {
    if (sensors.length === 0) {
      return {
        latitude: -22.9140639,
        longitude: -47.068686,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const latitudes = sensors.map(sensor => sensor.latitude);
    const longitudes = sensors.map(sensor => sensor.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLon + maxLon) / 2;
    const latitudeDelta = maxLat - minLat + 0.01;
    const longitudeDelta = maxLon - minLon + 0.01;

    return {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };
  };

  const initialRegion = calculateInitialRegion(sensors);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {sensors.map(sensor => (
          <Marker
            key={sensor.id}
            coordinate={{ latitude: sensor.latitude, longitude: sensor.longitude }}
            title={sensor.localizacao}
            description={`Responsável: ${sensor.responsavel}`}
            pinColor="blue"
          />
        ))}
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.cxs}>
        <View style={styles.cx}><Text style={styles.cxTxt}>Latitude: </Text><Text style={styles.cxTxt}>{location?.latitude}</Text></View>
        <View style={styles.cx}><Text style={styles.cxTxt}>Longitude: </Text><Text style={styles.cxTxt}>{location?.longitude}</Text></View>
        {sensorProximo && (
          <>
            <View style={styles.cx}><Text style={styles.cxTxt}>Sensor mais próximo:</Text><Text style={styles.cxTxt}>{sensorProximo.localizacao}</Text></View>
            <View style={styles.cx}><Text style={styles.cxTxt}>Responsável:</Text><Text style={styles.cxTxt}>{sensorProximo.responsavel}</Text></View>
            <View style={styles.cx}><Text style={styles.cxTxt}>Observação:</Text><Text style={styles.cxTxt}>{sensorProximo.observacao}</Text></View>
          </>
        )}
      </View>
    </View>
  );
}

import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    width: width - 40,
    height: height / 2,
    borderRadius: 10,
  },
  button: {
    width: "70%",
    height: 40,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white'
  },
  cxs: {
    width: '80%'
  },
  cx: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 8,
    borderWidth: 1,
    padding: 5,
    borderColor: '#999'
  },
  cxTxt: {
    fontSize: 12,
  }
});

export default styles;
