import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../componentes/AuthContext';

export const CadastroSensores = () => {
  const [tipo, setTipo] = useState('');
  const [macAddress, setMacAddress] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [localizacao, setLocalizacao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('');
  const [statusOperacional, setStatusOperacional] = useState(true);
  const [observacao, setObservacao] = useState('');

  const navigation = useNavigation();
  const { token } = useAuth();

  const sensorCadastro = () => {
    axios.post('http://10.0.2.2:8000/api/sensores/', {
      tipo: tipo,
      mac_address: macAddress,
      latitude: latitude,
      longitude: longitude,
      localizacao: localizacao,
      responsavel: responsavel,
      unidade_medida: unidadeMedida,
      status_operacional: statusOperacional,
      observacao:observacao
    },
        {
        headers: {
          Authorization: `Bearer ${token}`
        }
    }
    )
    .then(response => {
      console.log('Cadastro bem-sucedido:', response.data);
      
    })
    .catch(error => {
      console.error('Erro no cadastro:', error);
    });
  };

  return (
    <View style={estilos.container}>
      <Image
        style={estilos.logo}
        source={require('../../assets/logo.png')}
      />
      <TextInput
        style={estilos.campo}
        placeholder='Tipo'
        placeholderTextColor='#e1e5f2'
        onChangeText={setTipo}
        value={tipo}
      />
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
        onChangeText={text => setLatitude(parseFloat(text))}
        value={latitude.toString()}
      />
      <TextInput
        style={estilos.campo}
        placeholder='Longitude'
        placeholderTextColor='#e1e5f2'
        keyboardType='numeric'
        onChangeText={text => setLongitude(parseFloat(text))}
        value={longitude.toString()}
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
    marginTop: -155
  }
});

e