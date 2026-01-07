import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Alert, useCallback, useContext, useState } from "react";
import {
    FlatList,
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

const DeliveryHome = () => {
  const [order, setOrder] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("Pending"); // Pending | Picked | Shipped
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);
  const [hasActiveDelivery, setHasActiveDelivery] = useState(false);
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
        setOrder(response.data.result || []);
      } else {
        // If API returns "No pending Order" etc as result string, handle it
        if (typeof response.data.result === 'string') {
             setOrder([]);
        } else {
             setOrder([]);
        }
      }
    } catch (error) {
      setOrder([]);
      console.error("Error fetching orders:", error.message);
    }

    // Always check for active deliveries by fetching picked orders
    await checkActiveDelivery();
  };

  const checkActiveDelivery = async () => {
    try {
      const response = await axios.get(`${BaseUrl}Order/GetPickedOrders`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      if (response.data.isSuccess && response.data.result) {
        // Check if rider has any active (Accepted or Picked) orders
        const hasActive = response.data.result.some(o =>
          o.orderStatus === "Accepted" || o.orderStatus === "Picked"
        );
        setHasActiveDelivery(hasActive);

        // If rider has active delivery and is on Pending tab, auto-switch to Picked tab
        if (hasActive && activeTab === "Pending") {
          setActiveTab("Picked");
        }
      } else {
        setHasActiveDelivery(false);
      }
    } catch (error) {
      setHasActiveDelivery(false);
      console.error("Error checking active delivery:", error.message);
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

  const handleAcceptOrder = async (item) => {
    setAcceptingOrderId(item.id);
    try {
      // Accept the order (changes status from "Approved" to "Accepted")
      const response = await axios.get(`${BaseUrl}Order/AcceptOrder?id=${item.id}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      if (response.data.isSuccess) {
        // Success: clear pending list and navigate to order details
        setOrder([]);
        navigation.navigate("OrderConfirmation", {
          item: { ...item, orderStatus: "Accepted" },
          fetchOrder,
          activeTab: "Picked" // Show in Picked tab
        });
      } else {
        // Failed: refresh the list to get current state
        Alert.alert("Accept Failed", response.data.errorMessage || "This order may have been accepted by another rider.");
        await fetchOrder();
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to accept order. Please try again.");
      await fetchOrder();
    } finally {
      setAcceptingOrderId(null);
    }
  };

  const handleDeliveryPress = (item) => {
    navigation.navigate("OrderConfirmation", { item, fetchOrder, activeTab });
  };

  const handleTabPress = (tabName) => {
    // Prevent switching to Pending tab if rider has active delivery
    if (tabName === "Pending" && hasActiveDelivery) {
      Alert.alert(
        "Active Delivery",
        "You have an active delivery. Complete it before accepting new orders.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }
    setActiveTab(tabName);
  };

  const TabButton = ({ title, isActive, onPress, isDisabled }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-full mr-2 ${
        isActive ? "bg-orange-500" : isDisabled ? "bg-gray-100" : "bg-gray-200"
      }`}
      opacity={isDisabled ? 0.5 : 1}
    >
      <Text
        className={`font-semibold ${
          isActive ? "text-white" : isDisabled ? "text-gray-400" : "text-gray-600"
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
                onPress={() => handleTabPress("Pending")}
                isDisabled={hasActiveDelivery}
            />
            <TabButton
                title="Picked"
                isActive={activeTab === "Picked"}
                onPress={() => handleTabPress("Picked")}
                isDisabled={false}
            />
            <TabButton
                title="Shipped"
                isActive={activeTab === "Shipped"}
                onPress={() => handleTabPress("Shipped")}
                isDisabled={false}
            />
        </View>

        {/* Active Delivery Banner */}
        {hasActiveDelivery && (
          <View className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4 rounded-r-lg">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-orange-800 font-bold text-sm">Active Delivery in Progress</Text>
                <Text className="text-orange-700 text-xs mt-1">Complete your current delivery before accepting new orders.</Text>
              </View>
            </View>
          </View>
        )}

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
                handleAcceptOrder={handleAcceptOrder}
                status={activeTab}
                acceptingOrderId={acceptingOrderId}
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

const RenderAllorder = ({ item, handleDeliveryPress, handleAcceptOrder, status, acceptingOrderId }) => {
  // Get pickup address from first order item's seller profile
  const pickupAddress = item.orderDetails && item.orderDetails.length > 0
    ? item.orderDetails[0].foodItem.sellerProfile?.address
    : "Restaurant address";

  // Shorten addresses for display
  const shortPickupAddress = pickupAddress.length > 30
    ? pickupAddress.substring(0, 30) + "..."
    : pickupAddress;

  const shortDropOffAddress = item.address.length > 30
    ? item.address.substring(0, 30) + "..."
    : item.address;

  // Calculate estimated earning (15% of order total)
  const estimatedEarning = item.orderTotal ? Math.round(item.orderTotal * 0.15) : 0;

  const isPending = status === "Pending";
  const isAccepting = acceptingOrderId === item.id;

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Restaurant Name */}
      <View className="mb-3">
        <Text className="text-gray-800 font-bold text-lg">
          {item.restaurantName || "Yeti Food"}
        </Text>
      </View>

      {/* Pickup Address */}
      <View className="flex-row items-start mb-2">
        <View className="bg-green-100 p-1.5 rounded-md mr-2 mt-0.5">
          <MapPinIcon size={14} color="#16a34a" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 text-xs font-medium uppercase">Pickup</Text>
          <Text className="text-gray-800 text-sm font-medium">{shortPickupAddress}</Text>
        </View>
      </View>

      {/* Drop-off Address */}
      <View className="flex-row items-start mb-3">
        <View className="bg-red-100 p-1.5 rounded-md mr-2 mt-0.5">
          <MapPinIcon size={14} color="#dc2626" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 text-xs font-medium uppercase">Drop-off</Text>
          <Text className="text-gray-800 text-sm font-medium">{shortDropOffAddress}</Text>
        </View>
      </View>

      {/* Estimated Earning */}
      <View className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
        <Text className="text-gray-600 text-sm">Estimated Earning</Text>
        <Text className="text-green-600 font-bold text-xl">Rs. {estimatedEarning}</Text>
      </View>

      {/* Action Button */}
      {isPending ? (
        <TouchableOpacity
          className={`py-3 px-4 rounded-xl flex-row justify-center items-center shadow-sm ${
            isAccepting ? "bg-gray-400" : "bg-orange-500"
          }`}
          onPress={() => handleAcceptOrder(item)}
          activeOpacity={0.8}
          disabled={isAccepting}
        >
          <Text className="text-white font-bold text-base tracking-wide">
            {isAccepting ? "Accepting..." : "Accept"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-orange-500 py-3 px-4 rounded-xl flex-row justify-center items-center shadow-sm"
          onPress={() => handleDeliveryPress(item)}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base tracking-wide">
            {status === "Shipped" ? "View Details" : "Process Order"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DeliveryHome;
