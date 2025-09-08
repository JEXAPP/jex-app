import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '@/themes/colors';


export const iconos = {
  error: (size: number, color: string) => (
    <MaterialIcons name="error" size={size} color={color} />
  ),
  ordenarFlechas: (size = 18, color = '#000') => (
    <Ionicons name="swap-vertical-outline" size={size} color={color} />
  ),
  exito: (size: number, color: string) => (
    <Octicons name="check-circle" size={size} color={color} />
  ),
  ojoContra: (visible: boolean, colorVisible: string, colorOculto: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={{position: 'absolute', right: 15, top: 12, zIndex: 10,padding: 5,}} accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
      <MaterialIcons name={visible ? 'visibility' : 'visibility-off'} size={20} color={visible ? colorVisible : colorOculto}/>
    </TouchableOpacity>
  ),
  flechaIzquierda: (size: number, color: string) => (
    <Ionicons name="chevron-back" size={size} color={color}/>
  ),
   vacantes: (size: number, color: string) => (
    <MaterialCommunityIcons name="briefcase-outline" size={size} color={color} />
  ),
  asistencia: (size: number, color: string) => (
    <MaterialIcons name="how-to-reg" size={size} color={color} />
  ),
  estrella: (size: number, color: string) => (
    <FontAwesome name="star" size={size} color={color} />
  ),
  reportes: (size: number, color: string) => (
    <MaterialIcons name="insert-chart-outlined" size={size} color={color} />
  ),
  flechaDerecha: (size: number, color: string) => (
    <Ionicons name="chevron-forward" size={size} color={color} />
  ),
  flechaAbajo: (size: number, color: string) =>(
    <Ionicons name="chevron-down" size={size} color={color} />
  ),
  editar: (size: number, color: string) => (
    <MaterialIcons name="edit" size={size} color={color} />
  ),
  mas: (size: number, color: string) => (
    <Ionicons name="add" size={size} color={color} />
  ),
  ordenar: (size: number, color: string) => (
    <MaterialIcons name="sort-by-alpha" size={size} color={color}/>
  ),
  lista: (size = 24, color = Colors.black) => (
    <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
  ),
  cuidado: (size: number, color: string) => (
    <Ionicons name="alert-circle" size={size} color={color} />
  ),

  exitoSinCirculo: (size: number, color: string) => (
    <Octicons name="check" size={size} color={color} />
  ),
  reloj: (size: number, color: string) => (
    <Octicons name="clock" size={size} color={color} />
  ),
  error_outline: (size: number, color: string) => (
    <MaterialIcons name="error-outline" size={size} color={color} />
  ),
  google: (size: number, color:string) => (
    <Ionicons name="logo-google" size={size} color={color} />
  ),
  search: (size: number, color: string) => (
    <Ionicons name="search" size={size} color={color} />
  ),
  trash: (size:number, color:string) => (
    <Ionicons name="trash" size={size} color={color} />
  ),
  full_star: (size:number, color:string) => (
    <FontAwesome name="star" size={size} color={color} />
  ),
  half_star: (size:number, color:string) => (
    <FontAwesome name="star-half-full" size={size} color={color} />
  ),
  empty_star: (size:number, color:string) => (
    <FontAwesome name="star-o" size={size} color={color} />
  ),
  // ==== Footer Nav Icons ====
  footer_home: (active: boolean, size: number, color: string) =>
    active ? (
      <Ionicons name="home" size={size} color={color} />
    ) : (
      <Ionicons name="home-outline" size={size} color={color} />
    ),

  footer_inbox: (active: boolean, size: number, color: string) =>
    active ? (
      <FontAwesome6 name="inbox" size={size} color={color} />
    ) : (
      <Octicons name="inbox" size={size} color={color} />
    ),

  footer_briefcase: (active: boolean, size: number, color: string) =>
    active ? (
      <MaterialCommunityIcons name="briefcase" size={size} color={color} />
    ) : (
      <MaterialCommunityIcons name="briefcase-outline" size={size} color={color} />
    ),

  footer_chat: (active: boolean, size: number, color: string) =>
    active ? (
      <MaterialIcons name="chat-bubble" size={size} color={color} />
    ) : (
      <MaterialIcons name="chat-bubble-outline" size={size} color={color} />
    ),

  footer_person: (active: boolean, size: number, color: string) =>
    active ? (
      <Octicons name="person-fill" size={size} color={color} />
    ) : (
      <Octicons name="person" size={size} color={color} />
    ),
};