import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ClockIcon,
  MapPinIcon,
} from "react-native-heroicons/outline";
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
} from "react-native-heroicons/solid";
import { BaseUrl } from "../../Database/BaseUrl";
import { AuthContext } from "../context/AuthContext";

const ProductDetails = ({ route }) => {
  const navigation = useNavigation();
  const { id, name, address } = route.params || {}; // Assuming these might come from route params now
  const [foodItems, setFoodItems] = useState([]);
  const [filteredFoodItems, setFilteredFoodItems] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authData } = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      const fetchFoodItems = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${BaseUrl}FoodItem/GetAllFoodItem?id=${id}`
          );
          if (response.data.isSuccess) {
            setFoodItems(response.data.result);
            setFilteredFoodItems(response.data.result);
            setFetchError(null);
          } else {
            setFetchError(response.data.errorMessage);
          }
        } catch (error) {
          setFetchError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFoodItems();
    }
  }, [id]);

  // Helper function to actually add the item after clearing or directly
  const performAddToCart = async (cartItem) => {
      try {
          const response = await axios.post(`${BaseUrl}ShoppingCart`, cartItem, {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authData.token}`,
              },
          });
          if (response.data.isSuccess) {
              Alert.alert("Success", "Added to your cart!");
          } else {
              Alert.alert("Error", "Failed to add to cart.");
          }
      } catch (error) {
          if (error.response && error.response.status === 409) {
             // Conflict - Mixed Seller
             Alert.alert(
                 "Clear Cart?",
                 "Your cart contains items from another restaurant. Do you want to clear your cart and add this item?",
                 [
                     { text: "Cancel", style: "cancel" },
                     { 
                         text: "Yes, Clear Cart", 
                         onPress: async () => {
                             try {
                                 // Call Clear Cart API
                                 await axios.delete(`${BaseUrl}ShoppingCart/ClearCart`, {
                                    headers: { Authorization: `Bearer ${authData.token}` }
                                 });
                                 // Retry Adding Item
                                 await performAddToCart(cartItem);
                             } catch (clearError) {
                                 console.error("Error clearing cart:", clearError);
                                 Alert.alert("Error", "Failed to clear cart.");
                             }
                         }
                     }
                 ]
             );
          } else {
              console.error("Error adding to cart:", error);
              Alert.alert("Error", "Something went wrong.");
          }
      }
  };

  const addTocart = async (foodId) => {
    const cartItem = {
      FoodItemId: foodId,
      Count: 1,
    };
    await performAddToCart(cartItem);
  };

  const searchFoodItems = (text) => {
    const filteredItems = foodItems.filter((item) =>
      item.foodName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFoodItems(filteredItems);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-4 pt-2 pb-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 bg-gray-100 rounded-full"
          >
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 flex-1 ml-4" numberOfLines={1}>
            {name || "Restaurant Details"}
          </Text>
        </View>

        {/* Restaurant Info Summary */}
        <View className="mt-4 flex-row items-center">
            <View className="flex-row items-center mr-4">
                <StarIcon size={18} color="#FBBF24" />
                <Text className="ml-1 font-semibold text-gray-700">4.5</Text>
            </View>
            <View className="flex-row items-center mr-4">
                <ClockIcon size={18} color="#9CA3AF" />
                <Text className="ml-1 text-gray-500">25-30 min</Text>
            </View>
            <View className="flex-row items-center flex-1">
                <MapPinIcon size={18} color="#9CA3AF" />
                <Text className="ml-1 text-gray-500" numberOfLines={1}>{address || "Local"}</Text>
            </View>
        </View>

        {/* Search Bar */}
        <View className="mt-6 flex-row items-center bg-gray-100 rounded-2xl px-4 h-12">
          <MagnifyingGlassIcon size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search food items..."
            className="flex-1 ml-2 text-gray-800 text-base"
            placeholderTextColor="#9CA3AF"
            onChangeText={searchFoodItems}
          />
        </View>
      </View>

      {fetchError ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center text-lg">{fetchError}</Text>
        </View>
      ) : isLoading ? (
          <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400">Loading menu...</Text>
          </View>
      ) : (
        <FlatList
          data={filteredFoodItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <RenderAllFoodItem item={item} addTocart={addTocart} />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mt-20 items-center">
                <Text className="text-gray-400 text-lg font-medium">No items found</Text>
            </View>
          }
        />
      )}

      {/* Floating Cart Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Cart")}
        activeOpacity={0.8}
        className="absolute bottom-8 right-6 bg-orange-500 rounded-full w-14 h-14 items-center justify-center shadow-lg shadow-orange-300"
      >
        <ShoppingCartIcon size={28} color="white" />
        <View className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 items-center justify-center border border-orange-500">
            <Text className="text-[10px] font-bold text-orange-500">!</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const RenderAllFoodItem = ({ item, addTocart }) => {
  return (
    <View className="flex-row items-center bg-white rounded-3xl mb-4 p-3 shadow-sm border border-gray-100">
      <View className="mr-4">
        <Image
          className="rounded-2xl"
          source={{ uri: item.imageUrl }}
          style={{ height: 100, width: 100 }}
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 justify-between h-24 py-1">
        <View>
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.foodName}</Text>
          <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>Deliciously prepared with fresh ingredients.</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-orange-600 font-extrabold text-lg">Rs. {item.foodPrice}</Text>
          <TouchableOpacity
            className="bg-orange-500 p-2 rounded-xl flex-row items-center px-3"
            onPress={() => addTocart(item.id)}
            activeOpacity={0.7}
          >
            <PlusIcon size={16} color="white" />
            <Text className="text-white font-bold ml-1 text-xs">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductDetails;
