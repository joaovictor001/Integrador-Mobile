import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Switch } from 'react-native';
import axios from 'axios';  
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../componentes/AuthContext';
import { Picker } from '@react-native-picker/picker';

export const CadastroSensores = () => {
  const [tipo, setTipo] = useState('Temperatura');
  const [macAddress, setMacAddress] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [statusOperacional, setStatusOperacional] = useState(true);
  const [observacao, setObservacao] = useState('');

  const navigation = useNavigation();
  const { token } = useAuth();

  const sensorCadastro = () => {
    const latitudeNum = parseFloat(latitude);
    const longitudeNum = parseFloat(longitude);
    if (isNaN(latitudeNum) || isNaN(longitudeNum)) {
      Alert.alert('Erro', 'Latitude e Longitude devem ser números válidos.');
      return;
    }

    axios.post('http://10.0.2.2:8000/api/sensores/', {
      tipo: tipo,
      mac_address: macAddress,
      latitude: latitudeNum,
      longitude: longitudeNum,
      localizacao: localizacao,
      responsavel: responsavel,
      unidade_medida: unidadeMedida,
      status_operacional: statusOperacional,
      observacao: observacao
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Cadastro bem-sucedido:', response.data);
      Alert.alert('Cadastrado', 'Sensor cadastrado com sucesso');
      navigation.goBack();
    })
    .catch(error => {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', 'Erro ao cadastrar sensor');
    });
  };

  return (
    <View style={estilos.container}>
      <Image
        style={estilos.logo}
        source={require('../../assets/logo.png')}
      />
      <Picker
        selectedValue={tipo}
        style={estilos.campo}
        onValueChange={(itemValue) => setTipo(itemValue)}
      >
        <Picker.Item label="Temperatura" value="Temperatura" />
        <Picker.Item label="Contador" value="Contador" />
        <Picker.Item label="Umidade" value="Umidade" />
        <Picker.Item label="Luminosidade" value="Luminosidade" />
        <Picker.Item label="Umidade" value="Umidade" />
      </Picker>
      <TextInput
        style={estilos.campo}
        placeholder='MAC Address'
        placeholderTextColor='#e1e5f2'
        onChangeText={setMacAddress}
        value={macAddress}
      />
      <TextInput
        style={estilos.campo}
        placeholder='Latitude'
        placeholderTextColor='#e1e5f2'
        keyboardType='numeric'
        onChangeText={setLatitude}
        value={latitude}
      />
      <TextInput
        style={estilos.campo}
        placeholder='Longitude'
        placeholderTextColor='#e1e5f2'
        keyboardType='numeric'
        onChangeText={setLongitude}
        value={longitude}
      />
      <TextInput
        style={estilos.campo}
        placeholder='Localização'
        placeholderTextColor='#e1e5f2'
        onChangeText={setLocalizacao}
        value={localizacao}
      />
      <TextInput
        style={estilos.campo}
        placeholder='Responsável'
        placeholderTextColor='#e1e5f2'
        onChangeText={setResponsavel}
        value={responsavel}
      />
      <TextInput
        style={estilos.campo}
        placeholder='Unidade de Medida'
        placeholderTextColor='#e1e5f2'
        onChangeText={setUnidadeMedida}
        value={unidadeMedida}
      />
      <View style={estilos.switchContainer}>
        <Text style={estilos.switchLabel}>Status Operacional</Text>
        <Switch
          value={statusOperacional}
          onValueChange={setStatusOperacional}
        />
      </View>
      <TextInput
        style={estilos.campo}
        placeholder='Observação'
        placeholderTextColor='#e1e5f2'
        onChangeText={setObservacao}
        value={observacao}
      />
      <TouchableOpacity
        style={estilos.botao}
        onPress={sensorCadastro}
      >
        <Text style={estilos.textoBotao}>Cadastrar Sensor</Text>
      </TouchableOpacity>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  campo: {
    height: 50,
    width: 300,
    backgroundColor: '#4f030a',
    color: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 300,
    marginVertical: 5,
  },
  switchLabel: {
    color: '#e1e5f2',
    fontSize: 16,
  },
  botao: {
    height: 50,
    width: 300,
    backgroundColor: '#4f030a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    height: 105,
    width: 170,
    marginBottom: 50,
    marginTop: -155,
  }
});
