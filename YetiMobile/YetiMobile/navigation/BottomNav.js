import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform, View } from "react-native";
import {
    HomeIcon,
    MapIcon,
    ShoppingBagIcon,
    UserIcon,
} from "react-native-heroicons/outline";
import {
    HomeIcon as HomeIconSolid,
    MapIcon as MapIconSolid,
    ShoppingBagIcon as ShoppingBagIconSolid,
    UserIcon as UserIconSolid,
} from "react-native-heroicons/solid";
import Account from "../src/screens/Account";
import Cart from "../src/screens/Cart";
import HomeScreen from "../src/screens/HomeScreen";
import Maps from "../src/screens/Maps";

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 25 : 15,
          left: 15,
          right: 15,
          backgroundColor: "white",
          borderRadius: 30,
          height: 70,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          borderTopWidth: 0,
          paddingBottom: 0, // Reset default padding
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              {focused ? (
                <HomeIconSolid size={26} color={color} />
              ) : (
                <HomeIcon size={26} color={color} />
              )}
              {focused && (
                <View className="h-1 w-1 bg-orange-500 rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Maps"
        component={Maps}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              {focused ? (
                <MapIconSolid size={26} color={color} />
              ) : (
                <MapIcon size={26} color={color} />
              )}
              {focused && (
                <View className="h-1 w-1 bg-orange-500 rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              {focused ? (
                <ShoppingBagIconSolid size={26} color={color} />
              ) : (
                <ShoppingBagIcon size={26} color={color} />
              )}
              {focused && (
                <View className="h-1 w-1 bg-orange-500 rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              {focused ? (
                <UserIconSolid size={26} color={color} />
              ) : (
                <UserIcon size={26} color={color} />
              )}
              {focused && (
                <View className="h-1 w-1 bg-orange-500 rounded-full mt-1" />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
