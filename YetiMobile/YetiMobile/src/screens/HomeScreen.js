import { useContext } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Carousel from "../components/Carousel";
import HomeHeader from "../components/HomeHeader";
import HouseholdProducts from "../components/HouseholdProducts";
import ListOfRestaurant from "../components/ListOfRestaurant";
import PopularItems from "../components/PopularItems";
import { AuthContext } from "../context/AuthContext";

const HomeScreen = () => {
  const { authData } = useContext(AuthContext);

  const SectionHeader = ({ title, onSeeAll }) => (
    <View className="flex-row justify-between items-center px-4 mt-6 mb-3">
      <Text className="font-bold text-xl text-gray-800">{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text className="text-orange-500 font-semibold text-sm">See All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="pb-32">
          <HomeHeader />
          
          <Carousel />

          <SectionHeader title="Categories" onSeeAll={() => {}} />
          <PopularItems />

          <SectionHeader title="Household Essentials" onSeeAll={() => {}} />
          <HouseholdProducts />

          <SectionHeader title="Top Restaurants" onSeeAll={() => {}} />
          <ListOfRestaurant />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
