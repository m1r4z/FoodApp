import { useContext } from "react";
import { ScrollView, Text, View } from "react-native";
import HomeHeader from "../components/HomeHeader";
import HouseholdProducts from "../components/HouseholdProducts";
import ListOfRestaurant from "../components/ListOfRestaurant";
import PopularItems from "../components/PopularItems";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = () => {
  const { authData } = useContext(AuthContext);

  return (
    <ScrollView>
      <View className="mt-12">
        <HomeHeader />
        <Text className="ml-4 font-semibold text-xl mt-3 mb-2">
          Most Popular
        </Text>
        <PopularItems />
        <Text className="ml-4 font-semibold text-xl mt-3 mb-2">
          Household Products
        </Text>
        <HouseholdProducts />
        <Text className="ml-4 font-semibold text-xl mt-3 mb-2">
          List of Restaurants
        </Text>
        <ListOfRestaurant />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
