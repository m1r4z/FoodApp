import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useContext, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
    BanknotesIcon,
    CalendarDaysIcon,
    ChevronLeftIcon // Added for Back Button
    ,
    ClipboardDocumentCheckIcon,
    MapPinIcon,
    TruckIcon
} from "react-native-heroicons/outline";
import { BaseUrl } from "../../Database/BaseUrl";
import { AuthContext } from "../context/AuthContext";

const OrderConfirmation = ({ route }) => {
  const { item, fetchOrder, activeTab } = route.params; // Get activeTab from params
  const { authData } = useContext(AuthContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Helper to safely display status
  const displayStatus = item.orderStatus === "Approved" ? "Pending" : item.orderStatus;

  const handlePickOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}Order/PickOrder?id=${item.id}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      if (response.data.isSuccess) {
        Alert.alert("Success", "Order Picked Successfully!");
        if (fetchOrder) fetchOrder();
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.errorMessage || "Failed to pick order");
      }
    } catch (error) {
        console.error(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  const handleShippedOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BaseUrl}Order/ShippedOrder?id=${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        Alert.alert("Success", "Order Shipped Successfully!");
        if (fetchOrder) fetchOrder();
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.errorMessage || "Failed to ship order");
      }
    } catch (error) {
        console.error(error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
        setLoading(false);
    }
  };

  const DetailRow = ({ icon: Icon, label, value }) => (
    <View className="flex-row items-start mb-4">
      <View className="bg-orange-100 p-2 rounded-lg mr-3">
         <Icon size={20} color="#f97316" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-0.5">{label}</Text>
        <Text className="text-gray-800 font-semibold text-base leading-5">{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header with Back Button */}
      <View className="px-4 py-4 flex-row items-center border-b border-gray-100 bg-white">
        <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full hover:bg-gray-100 mr-2"
        >
            <ChevronLeftIcon size={24} color="#1f2937" />
        </TouchableOpacity>
        <View>
             <Text className="text-xl font-bold text-gray-800">Delivery Details</Text>
             <Text className="text-gray-500 text-xs text-orange-500 font-medium">{displayStatus}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Header Info Card */}
        <View className="bg-orange-500 p-6 rounded-2xl shadow-sm mb-6 flex-row justify-between items-center">
            <View>
                <Text className="text-orange-100 text-sm font-medium mb-1">Order Total</Text>
                <Text className="text-white text-3xl font-bold">Rs. {item.orderTotal}</Text>
            </View>
            <View className="bg-white/20 p-3 rounded-xl ml-4">
                 <Text className="text-white font-bold text-lg">#{item.id}</Text>
            </View>
        </View>

        {/* Details Card */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <DetailRow 
            icon={CalendarDaysIcon} 
            label="Order Date" 
            value={new Date(item.orderDate).toLocaleString()} 
          />
          <DetailRow 
            icon={BanknotesIcon} 
            label="Payment Status" 
            value={item.paymentStatus} 
          />
          <DetailRow 
            icon={MapPinIcon} 
            label="Delivery Address" 
            value={item.address} 
          />
        </View>

        {/* Food Items List */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-800 font-bold text-lg mb-4">Order Items</Text>
          {item.orderDetails && item.orderDetails.map((detail, index) => (
            <View key={index} className="flex-row justify-between items-center mb-3 border-b border-gray-50 pb-2 last:border-0 last:mb-0 last:pb-0">
              <View className="flex-1">
                <Text className="text-gray-800 font-medium text-base">{detail.foodItem.foodName}</Text>
                <Text className="text-gray-500 text-sm">Qty: {detail.count}</Text>
              </View>
              <Text className="text-gray-800 font-semibold">Rs. {detail.price}</Text>
            </View>
          ))}
        </View>

        {/* Actions - Conditional Rendering based on activeTab/Status */}
        <View className="mt-2 mb-10">
          {(activeTab === "Pending" || item.orderStatus === "Approved") && (
            <TouchableOpacity
              className="w-full bg-orange-500 py-4 rounded-xl shadow-md flex-row justify-center items-center space-x-2"
              onPress={handlePickOrder}
              disabled={loading}
            >
              <ClipboardDocumentCheckIcon size={24} color="white" />
              <Text className="text-white text-lg font-bold tracking-wide">
                {loading ? "Processing..." : "Pick Order"}
              </Text>
            </TouchableOpacity>
          )}

          {(activeTab === "Picked" || item.orderStatus === "Picked") && (
             <TouchableOpacity
               className="w-full bg-green-600 py-4 rounded-xl shadow-md flex-row justify-center items-center space-x-2"
               onPress={handleShippedOrder}
               disabled={loading}
             >
               <TruckIcon size={24} color="white" />
               <Text className="text-white text-lg font-bold tracking-wide">
                 {loading ? "Processing..." : "Complete Delivery"}
               </Text>
             </TouchableOpacity>
           )}
           
           {(activeTab === "Shipped" || item.orderStatus === "Shipped") && (
             <View className="w-full bg-gray-100 py-4 rounded-xl flex-row justify-center items-center">
                 <TruckIcon size={24} color="#9ca3af" />
                 <Text className="text-gray-500 text-lg font-bold ml-2">Delivery Completed</Text>
             </View>
           )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderConfirmation;
