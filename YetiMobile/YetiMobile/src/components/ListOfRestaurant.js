import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ClockIcon, MagnifyingGlassIcon, StarIcon } from "react-native-heroicons/solid";
import { BaseUrl } from "../../Database/BaseUrl";

const RenderAllProducts = ({ item }) => {
  const navigation = useNavigation();

  if (!item || !item.id) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("ProductDetails", { 
        id: item.id,
        name: item.name,
        address: item.address
      })}
      className="bg-white rounded-2xl mx-4 my-2 shadow-sm border border-gray-100 overflow-hidden"
    >
      <View className="flex-row">
        <Image
          source={require("../../assets/images/5.jpg")}
          className="h-28 w-28 rounded-l-2xl"
          resizeMode="cover"
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
              {item.address}
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-lg">
              <StarIcon size={14} color="#10B981" />
              <Text className="text-green-700 text-xs font-bold ml-1">4.5</Text>
            </View>
            <View className="flex-row items-center">
              <ClockIcon size={14} color="#6B7280" />
              <Text className="text-gray-500 text-xs ml-1">25-30 min</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ListOfRestaurant = () => {
  const [sellerProfiles, setSellerProfiles] = useState([]);
  const [filteredSellerProfiles, setFilteredSellerProfiles] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchSellerProfiles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BaseUrl}SellerProfile`);
        if (response.data.isSuccess) {
          setSellerProfiles(response.data.result);
          setFilteredSellerProfiles(response.data.result);
          setFetchError(null);
        } else {
          setFetchError("Error fetching seller profiles: " + response.data.errorMessage);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setFetchError("No seller profiles found");
        } else {
          setFetchError("Error fetching seller profiles: " + error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchSellerProfiles();
  }, []);

  const searchSellerProfiles = (text) => {
    setSearchText(text);
    const filteredProfiles = sellerProfiles.filter((profile) =>
      profile.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSellerProfiles(filteredProfiles);
  };

  return (
    <View className="flex-1">
      <View className="px-4 py-2">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-12">
          <MagnifyingGlassIcon size={20} color="#6B7280" />
          <TextInput
            placeholder="Search for restaurants..."
            className="flex-1 ml-2 text-gray-800 text-base"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={searchSellerProfiles}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center py-10">
          <ActivityIndicator size="large" color="#FF6347" />
          <Text className="text-gray-500 mt-4">Finding local flavors...</Text>
        </View>
      ) : fetchError ? (
        <View className="flex-1 justify-center items-center py-10 px-4">
          <Text className="text-red-500 text-center">{fetchError}</Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={filteredSellerProfiles}
            renderItem={({ item }) => <RenderAllProducts item={item} />}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};

export default ListOfRestaurant;
