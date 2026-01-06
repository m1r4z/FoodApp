import { useNavigation } from "@react-navigation/native";
// import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import LottieView from "lottie-react-native";
import { useContext, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ChevronLeftIcon,
    TrashIcon
} from "react-native-heroicons/outline";
import { BaseUrl } from "../../Database/BaseUrl";
import { AuthContext } from "../context/AuthContext";

const Cart = (item) => {
  const navigation = useNavigation();
  const { authData } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BaseUrl}ShoppingCart`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        });
        console.log("Response data:", response.data.result);

        if (response.data.isSuccess) {
          setCart(response.data.result);
          setFetchError(null);
        } else {
          setFetchError(
            "Error fetching food item: " + response.data.errorMessage
          );
        }
      } catch (error) {
        setFetchError("Error fetching food item: " + error.message);
      }
    };
    fetchCart();
  }, []);

  const PlaceOrder = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}Order/PlaceOrder`,
        // Data object
        {},
        // Config object with headers
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(authData.token);
      console.log(error);
    }
  };

  const onCheckOut = async () => {
    // 1. Create Payment Intent
    const response = await PlaceOrder();
    console.log(response);
    const orderHeaderId = response.result.orderHeaderId;
    console.log(orderHeaderId);
    // Check if the request was successful
    if (response.isSuccess == false) {
      Alert.alert("Something went wrong!!!");
      return;
    }
    // 2. Initilizethe Payment sheet
    /*
    const initResponse = await initPaymentSheet({
      merchantDisplayName: "YetaiFood.dev",
      paymentIntentClientSecret: response.result.paymentIntentId,
      defaultBillingDetails: {
        name: authData.fullName,
        address: authData.address,
      },
    });
    if (initResponse.error) {
      console.log(initResponse.error);
      Alert.alert("Something went wrong!!!");
      return;
    }
    */
    // 3. Present Payment Sheet from Strip
    // await presentPaymentSheet();

    // 4. If Payment ok -> clear the cart
    // Bypass Stripe: Directly confirm the order
    const clearCartResponse = await OrderConfirmation(orderHeaderId);
    if (clearCartResponse.isSuccess) {
      Alert.alert("success", "Order has been Placed (Payment Bypassed)");
      setCart([]);
    } else {
      Alert.alert("error", "Something went wrong during order confirmation");
    }
  };

  const cancelOrder = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}Order/CancelOrder`,
        // Data object
        {},
        // Config object with headers
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(authData.token);
      console.log(error);
    }
  };

  const OrderConfirmation = async (orderHeaderId) => {
    try {
      const response = await axios.get(
        `${BaseUrl}Order/OrderConfirmation?id=${orderHeaderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(authData.token);
      console.log(error);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const deliveryFee = cart.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Custom Header */}
      <View className="px-4 py-4 bg-white flex-row items-center border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 bg-gray-50 rounded-full"
        >
          <ChevronLeftIcon size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 ml-4">My Cart</Text>
      </View>

      {cart.length > 0 ? (
        <View className="flex-1">
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RenderAllProducts item={item} />}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Order Summary */}
          <View 
            className="bg-white p-6 rounded-t-[40px] shadow-2xl border-t border-gray-100"
            style={{ marginBottom: Platform.OS === "ios" ? 90 : 80 }}
          >
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 text-base">Subtotal</Text>
              <Text className="text-gray-800 font-semibold text-base">Rs. {subtotal}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500 text-base">Delivery Fee</Text>
              <Text className="text-gray-800 font-semibold text-base">Rs. {deliveryFee}</Text>
            </View>
            <View className="h-[1px] bg-gray-100 mb-4" />
            <View className="flex-row justify-between mb-6">
              <Text className="text-gray-800 font-bold text-xl">Total</Text>
              <Text className="text-orange-600 font-bold text-xl">Rs. {total}</Text>
            </View>

            <View className="flex-row gap-x-3">
              <TouchableOpacity
                onPress={async () => {
                  const response = await cancelOrder();
                  if (response.isSuccess) {
                    Alert.alert("Success", "Order has been cancelled");
                    setCart([]);
                  } else {
                    Alert.alert("Error", "Something went wrong");
                  }
                }}
                className="flex-1 bg-red-50 py-4 rounded-2xl items-center border border-red-100"
              >
                <Text className="text-red-500 font-bold text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={onCheckOut}
                activeOpacity={0.8}
                className="flex-[2] bg-orange-500 py-4 rounded-2xl items-center shadow-lg shadow-orange-200"
              >
                <Text className="text-white font-bold text-lg">Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center px-10">
          <LottieView
            source={require("../../assets/images/Cart.json")}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
          <Text className="text-2xl font-bold text-gray-800 mt-5">Your cart is empty</Text>
          <Text className="text-gray-500 text-center mt-2 leading-6">
            Looks like you haven't added anything to your cart yet.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeScreen")}
            className="mt-8 bg-orange-500 px-8 py-4 rounded-2xl shadow-lg shadow-orange-200"
          >
            <Text className="text-white font-bold text-lg">Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const RenderAllProducts = ({ item }) => {
  return (
    <View className="flex-row items-center bg-white rounded-3xl mb-4 p-3 shadow-sm border border-gray-100">
      <View className="mr-4">
        <Image
          className="rounded-2xl"
          source={{ uri: item.foodItem.imageUrl }}
          style={{ height: 90, width: 90 }}
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
            {item.foodItem.foodName}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {item.count} x Rs. {item.foodItem.foodPrice}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-orange-600 font-bold text-lg">
            Rs. {item.price}
          </Text>
          <TouchableOpacity 
            className="p-2 bg-gray-50 rounded-lg"
            onPress={() => {/* Add functionality to remove or decrease count if needed */}}
          >
            <TrashIcon size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Cart;
