import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useContext, useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { MapPinIcon } from "react-native-heroicons/outline";
import { BaseUrl } from "../../Database/BaseUrl";
import { AuthContext } from "../context/AuthContext";

const DeliveryHome = ({ route }) => {
  const { id } = route.params || {};
  const [order, setOrder] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending"); // Pending | Picked | Shipped
  const { authData } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchOrder = async () => {
    let endpoint = "";
    if (activeTab === "Pending") endpoint = "Order/GetPendingOrder";
    else if (activeTab === "Picked") endpoint = "Order/GetPickedOrders";
    else if (activeTab === "Shipped") endpoint = "Order/GetShippedOrders";

    try {
      const response = await axios.get(`${BaseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      console.log(`Response data (${activeTab}):`, response.data);

      if (response.data.isSuccess) {
        setOrder(response.data.result);
        setFetchError(null);
      } else {
        // If API returns "No pending Order" etc as result string, handle it
        if (typeof response.data.result === 'string') {
             setOrder([]);
        } else {
             setFetchError(response.data.errorMessage || "No orders found");
        }
      }
    } catch (error) {
      setOrder([]);
      setFetchError("Error fetching orders: " + error.message);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrder();
    setRefreshing(false);
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      fetchOrder();
    }, [activeTab])
  );

  const addTocart = async (id) => {
      // ... existing implementation if needed
  };

  const handleDeliveryPress = (item) => {
    navigation.navigate("OrderConfirmation", { item, fetchOrder, activeTab });
  };

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 ${
        isActive ? "bg-orange-500" : "bg-gray-200"
      }`}
    >
      <Text
        className={`font-semibold ${
          isActive ? "text-white" : "text-gray-600"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <View className="flex-1 px-4">
        <View className="py-4 mt-2">
          <Text className="text-2xl font-bold text-gray-800">
            Delivery Jobs
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Manage your deliveries
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row mb-4">
            <TabButton 
                title="Pending" 
                isActive={activeTab === "Pending"} 
                onPress={() => setActiveTab("Pending")} 
            />
            <TabButton 
                title="Picked" 
                isActive={activeTab === "Picked"} 
                onPress={() => setActiveTab("Picked")} 
            />
            <TabButton 
                title="Shipped" 
                isActive={activeTab === "Shipped"} 
                onPress={() => setActiveTab("Shipped")} 
            />
        </View>

        {order.length === 0 ? (
          <View className="flex-1 justify-center items-center">
             <Text className="text-gray-400 text-lg">No {activeTab.toLowerCase()} orders</Text>
             <TouchableOpacity onPress={onRefresh} className="mt-4">
                <Text className="text-orange-500">Tap to refresh</Text>
             </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            className="mt-2"
            data={order}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#f97316"]} />
            }
            renderItem={({ item }) => (
              <RenderAllorder
                item={item}
                handleDeliveryPress={handleDeliveryPress}
                status={activeTab}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-4" />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const RenderAllorder = ({ item, handleDeliveryPress, status }) => {
  return (
    <View className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex-row">
      <Image
        className="rounded-xl bg-gray-200"
        source={require("../../assets/images/friedchicken.jpg")}
        style={{ height: 110, width: 110 }}
        resizeMode="cover"
      />
      
      <View className="flex-1 ml-4 justify-between py-1">
        <View>
          <View className="flex-row items-start space-x-1">
            <MapPinIcon size={16} color="#6b7280" style={{marginTop: 3}} />
            <Text className="text-gray-800 font-bold text-base flex-1" numberOfLines={2}>
              {item.restaurantName || "Yeti Food"} - {item.address}
            </Text>
          </View>

          {/* Food Items Summary */}
          <View className="mt-2">
            <Text className="text-gray-500 text-sm" numberOfLines={2}>
              {item.orderDetails && item.orderDetails.length > 0 
                ? item.orderDetails.map(detail => `${detail.foodItem.foodName} x${detail.count}`).join(', ')
                : "No items"}
            </Text>
          </View>
          
          <Text className="text-orange-500 font-bold text-lg mt-2">
            Rs. {item.orderTotal}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-orange-500 py-2.5 px-4 rounded-xl flex-row justify-center items-center shadow-sm"
          onPress={() => handleDeliveryPress(item)}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-sm tracking-wide">
            {status === "Shipped" ? "View Details" : "Process Order"} 
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeliveryHome;
