import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Cabecalho } from '../componentes/Cabecalho'
import { FormularioUsuario } from '../componentes/FormularioUsuario'

import uuid from 'react-native-uuid'

interface UsuarioProps {
    codigo: string;
    nome: string; 
    email: string; 
    telefone: string; 
    usuario: string;
    senha: string;
}

export const Usuarios = () => { 

    

    return(
        <View style={estilos.conteiner}>

            <Cabecalho 
                titulo="Cadastro de usuários"
            />

            <FormularioUsuario 
                adicionar={adicionarUsuario}
            />  
        </View>
    ); 
}

const estilos = StyleSheet.create({
    conteiner: {
      flex: 1,
      backgroundColor: '#080a0c'
    },
  });