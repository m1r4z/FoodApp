import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  MapPinIcon,
  PhoneIcon,
  ShoppingBagIcon,
  UserIcon
} from "react-native-heroicons/outline";

const CustomerOrderDetails = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();

  // Rider info is now included in the item from OrderHistory API
  const riderInfo = item.deliveryRider || item.rider;

  // Helper to safely display status
  const displayStatus = item.orderStatus;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "approved": return "text-blue-600 bg-blue-100";
      case "picked": return "text-indigo-600 bg-indigo-100";
      case "shipped": return "text-purple-600 bg-purple-100";
      case "completed": return "text-green-600 bg-green-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
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
             <Text className="text-xl font-bold text-gray-800">Order Details</Text>
             <Text className="text-gray-500 text-xs">#{item.id}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Status Banner */}
        <View className={`p-4 rounded-xl mb-6 flex-row items-center space-x-3 ${getStatusColor(item.orderStatus).split(' ')[1]}`}>
            <ShoppingBagIcon size={24} color={getStatusColor(item.orderStatus).includes('yellow') ? '#ca8a04' : getStatusColor(item.orderStatus).includes('blue') ? '#2563eb' : getStatusColor(item.orderStatus).includes('purple') ? '#9333ea' : getStatusColor(item.orderStatus).includes('green') ? '#16a34a' : '#4b5563'} />
            <View>
                <Text className={`font-bold ${getStatusColor(item.orderStatus).split(' ')[0]}`}>Order Status: {displayStatus}</Text>
                {item.orderStatus === 'Picked' && (
                    <Text className="text-indigo-600 text-xs mt-0.5">Your rider has picked up the order!</Text>
                )}
                 {item.orderStatus === 'Shipped' && (
                    <Text className="text-purple-600 text-xs mt-0.5">Your order is on the way!</Text>
                )}
            </View>
        </View>

        {/* Header Info Card */}
        <View className="bg-orange-500 p-6 rounded-2xl shadow-sm mb-6 flex-row justify-between items-center">
            <View>
                <Text className="text-orange-100 text-sm font-medium mb-1">Order Total</Text>
                <Text className="text-white text-3xl font-bold">Rs. {item.orderTotal}</Text>
                <Text className="text-white text-sm font-medium mt-1">from {item.restaurantName || 'Yeti Food'}</Text>
            </View>
            <View className="bg-white/20 p-3 rounded-xl ml-4">
                <Text className="text-white font-bold text-lg">#{item.id}</Text>
            </View>
        </View>

        {/* Restaurant Information */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-800 font-bold text-lg mb-4">Restaurant Information</Text>
          {item.orderDetails && item.orderDetails.length > 0 && (
            <>
              <DetailRow
                icon={MapPinIcon}
                label="Restaurant Name"
                value={item.restaurantName || "Yeti Food"}
              />
              <DetailRow
                icon={MapPinIcon}
                label="Pickup Address"
                value={item.orderDetails[0].foodItem.sellerProfile?.address || "N/A"}
              />
            </>
          )}
        </View>

        {/* Details Card */}
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <Text className="text-gray-800 font-bold text-lg mb-4">Order Information</Text>
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

        {/* Rider Information - Show only when order is accepted/picked/shipped and rider is assigned */}
        {riderInfo && (item.orderStatus === "Accepted" || item.orderStatus === "Picked" || item.orderStatus === "Shipped") && (
          <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <Text className="text-gray-800 font-bold text-lg mb-4">Delivery Rider Information</Text>

            <>
              <DetailRow
                icon={UserIcon}
                label="Rider Name"
                value={riderInfo.fullName || riderInfo.name || "N/A"}
              />
              <DetailRow
                icon={PhoneIcon}
                label="Rider Phone"
                value={riderInfo.phoneNumber || riderInfo.PhoneNumber || "N/A"}
              />
            </>
          </View>
        )}

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
        
        <View className="h-10" />

      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerOrderDetails;
