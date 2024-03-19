import React from "react";
import { Platform } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from "styled-components";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const { Navigator, Screen } = createBottomTabNavigator();

import { Dashboard } from "../screens/Dashboard"; 
import { Register } from "../screens/Register"; 
import { Resume } from "../screens/Resume";

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false, // Remove o cabeçalho que é colocado por padrão
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          height: 88,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        }
      }}
    >
      <Screen
        name="Listagem" // Esse é o nome que irá aparecer no menu
        component={Dashboard}
        options={{
          tabBarIcon: (({ size, color }) => 
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Screen
        name="Cadastrar" // Esse é o nome que irá aparecer no menu
        component={Register}
        options={{
          tabBarIcon: (({ size, color }) => 
            <MaterialIcons
              name="attach-money"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Screen
        name="Resumo" // Esse é o nome que irá aparecer no menu
        component={Resume}
        options={{
          tabBarIcon: (({ size, color }) => 
            <MaterialIcons
              name="pie-chart"
              size={size}
              color={color}
            />
          )
        }}
      />
    </Navigator>
  );
}