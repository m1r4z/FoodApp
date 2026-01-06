import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { BaseUrl } from "../../Database/BaseUrl";
import { AuthContext } from "../context/AuthContext";

const OrderHistory = () => {
  const navigation = useNavigation();
  const { authData } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${BaseUrl}Order/GetOrderHistory`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        setOrders(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-blue-600 bg-blue-100";
      case "picked":
        return "text-indigo-600 bg-indigo-100";
      case "shipped": 
        return "text-purple-600 bg-purple-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate("CustomerOrderDetails", { item })}
      className="mx-4 mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-500 font-medium">
          Order #{item.id}
        </Text>
        <Text className="text-gray-400 text-xs text-right">
          {new Date(item.orderDate).toLocaleDateString()}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-gray-800">
            Rs. {item.orderTotal}
          </Text>
          <Text className="text-gray-500 text-xs mt-1 font-bold">
             {item.restaurantName || 'Yeti Food'}
          </Text>
          <Text className="text-gray-400 text-xs">
             {item.applicationUser?.fullName || 'User'}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(item.orderStatus).split(" ")[1]}`}>
          <Text className={`text-xs font-bold ${getStatusColor(item.orderStatus).split(" ")[0]}`}>
            {item.orderStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white shadow-sm mb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-100 mr-4"
        >
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Order History</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#f97316"]} />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-400 text-lg">No orders found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default OrderHistory;
