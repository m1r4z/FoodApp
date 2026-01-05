import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { BaseUrl } from "../../Database/BaseUrl";

const RenderAllProducts = ({ item, index }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetails", { id: item.sellerProfileId })}
      className="ml-3 mr-3 "
      style={{ height: 230, width: 180 }}
    >
      <View className="">
        <View className="">
          <Image
            className="rounded-3xl"
            source={{ uri: item.imageUrl }}
            style={{ height: 170, width: 180 }}
          />
        </View>
        <View className="">
          <Text className="font-bold">{item.foodName}</Text>
          <Text>Rs.{item.foodPrice}</Text>
          <Text className="text-gray-500">{item.sellerProfile?.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HouseholdProducts = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BaseUrl}FoodItem/GetAllFoodItem`);
      if (response.data.isSuccess) {
        setAllProducts(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allProducts}
        renderItem={({ item }) => <RenderAllProducts item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default HouseholdProducts;
