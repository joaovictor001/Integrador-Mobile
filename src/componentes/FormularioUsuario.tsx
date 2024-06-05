import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../componentes/AuthContext';

export const FormularioUsuario: React.FC = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigation = useNavigation();
    //useContext
    const { setToken } = useAuth();
 // Usando o contexto de autenticação

    const fazerCadastro = async () => {
        try {
            // Fazer a requisição de cadastro
            const response = await axios.post(
                'http://10.109.71.21:8082/api/create_user',
                {
                    username: usuario,
                    password: senha
                }
            );



            // Se o cadastro for bem-sucedido, navegar para a tela inicial
            const token = response.data.access;
            setToken(token)
            navigation.navigate('rotasTab');
        } catch (error) {
            // Se houver um erro no cadastro, você pode exibir uma mensagem de erro
            console.error('Erro de cadastro:', error);
        }
    };

    return (
        <View style={estilos.conteiner}>
            <View style={estilos.conteinerCampos}>
                <TextInput
                    style={estilos.campo}
                    placeholder="Usuário"
                    placeholderTextColor="#01233c"
                    keyboardType="default"
                    onChangeText={setUsuario}
                    value={usuario}
                />
                <TextInput
                    style={estilos.campo}
                    placeholder="Senha"
                    placeholderTextColor="#01233c"
                    secureTextEntry={true}
                    onChangeText={setSenha}
                    value={senha}
                />
            </View>
            <TouchableOpacity style={estilos.botao} onPress={fazerCadastro}>
                <Feather name="user-plus" size={24} color="#dee2e6" />
            </TouchableOpacity>
        </View>
    );
};

const estilos = StyleSheet.create({
    conteiner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 10,
    },
    conteinerCampos: {
        flex: 1,
    },
    campo: {
        height: 50,
        backgroundColor: '#dee2e6',
        color: '#01233c',
        marginVertical: 5,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    botao: {
        width: 60,
        height: 290,
        marginStart: 10,
        backgroundColor: '#4f030a',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
});
