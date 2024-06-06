import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import styles from '../css/styels';

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
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensors();

      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const newLocation = await Location.getCurrentPositionAsync({});
        const currentCoords = {
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
        };
        setLocation(currentCoords);

        // Calcular a distância entre a localização atual e os sensores
        let closestSensor: Sensor | null = null;
        let closestDistance: number | null = null;

        sensors.forEach(sensor => {
          const distance = haversine(
            currentCoords.latitude,
            currentCoords.longitude,
            sensor.latitude,
            sensor.longitude
          );
          if (closestDistance === null || distance < closestDistance) {
            closestDistance = distance;
            closestSensor = sensor;
          }
        });

        if (closestSensor) {
          setSensorProximo(closestSensor);
        }
      })();
    }, 5000); // Atualização a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  const calculateInitialRegion = (userLocation: LocationCoords | null): Region => {
    if (!userLocation) {
      return {
        latitude: -22.9140639,
        longitude: -47.068686,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    return {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  };

  const initialRegion = calculateInitialRegion(location);

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
