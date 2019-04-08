import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import BusinessDetailsScreen from '../screens/BusinessDetails';
import SearchScreen from '../screens/SearchScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  BusinessDetails: BusinessDetailsScreen,
  Search: SearchScreen
});


export default createSwitchNavigator({
  HomeStack,
});
