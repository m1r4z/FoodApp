
// import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BusinessSignUp from "../src/screens/BusinessSignUp";
import BuyerSignUp from "../src/screens/BuyerSignUp";
import Cart from "../src/screens/Cart";
import CustomerOrderDetails from "../src/screens/CustomerOrderDetails";
import DeliveryHome from "../src/screens/DeliveryHome";
import DeliveryRiderSighup from "../src/screens/DeliveryRiderSighup";
import IndividualSignUp from "../src/screens/IndividualSignUp";
import LogIn from "../src/screens/LogIn";
import OrderConfirmation from "../src/screens/OrderConfirmation";
import OrderHistory from "../src/screens/OrderHistory";
import ProductDetails from "../src/screens/ProductDetails";
import Profile from "../src/screens/Profile";
import SignUp from "../src/screens/SignUp";
import SignupHelp from "../src/screens/SignupHelp";
import Route from "./Route";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="LogIn"
      >
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignupHelp" component={SignupHelp} />
        <Stack.Screen name="HomeScreen" component={Route} />
        <Stack.Screen name="BuyerSignUp" component={BuyerSignUp} />
        <Stack.Screen name="IndividualSignUp" component={IndividualSignUp} />
        <Stack.Screen name="BusinessSignUp" component={BusinessSignUp} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen
          name="DeliveryRiderSighup"
          component={DeliveryRiderSighup}
        />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="DeliveryHome" component={DeliveryHome} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
        <Stack.Screen name="CustomerOrderDetails" component={CustomerOrderDetails} />
        <Stack.Screen name="OrderHistory" component={OrderHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
