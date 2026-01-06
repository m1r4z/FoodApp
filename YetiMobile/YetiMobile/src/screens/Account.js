import { useNavigation } from '@react-navigation/native';
import { useContext } from "react";
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import {
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon,
  ClockIcon,
  CreditCardIcon,
  InformationCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  UserIcon
} from 'react-native-heroicons/outline';
import { AuthContext } from "../context/AuthContext";

const Account = () => {
  const navigation = useNavigation();
  const { authData } = useContext(AuthContext);
  const { setAuthInfo } = useContext(AuthContext);

  const logout = () => {
    setAuthInfo(null);
    navigation.navigate("LogIn")
  }

  const MenuItem = ({ icon: Icon, title, onPress, showBorder = true }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row items-center justify-between py-4 ${showBorder ? 'border-b border-gray-50' : ''}`}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-orange-50 rounded-xl items-center justify-center mr-4">
          <Icon size={22} color="#f97316" />
        </View>
        <Text className="text-[16px] font-semibold text-gray-800">{title}</Text>
      </View>
      <ChevronRightIcon color={'#9ca3af'} size={18} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header Background */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-orange-500 rounded-b-[40px]" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header Title */}
        <View className="px-6 pt-6 flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">Profile</Text>
          <TouchableOpacity 
            onPress={logout}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <ArrowLeftOnRectangleIcon color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View className="mx-6 mt-8 bg-white rounded-[30px] p-6 shadow-xl shadow-black/5">
          <View className="flex-row items-center">
            <View className="relative">
              <Image 
                source={require('../../assets/images/defultProfile.png')}
                className="w-20 h-20 rounded-full border-4 border-orange-50" 
              />
              <View className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                <ShieldCheckIcon size={12} color="white" />
              </View>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-800">{authData?.fullName || 'John Doe'}</Text>
              <Text className="text-gray-500 text-sm mt-0.5">{authData?.email || 'john.doe@example.com'}</Text>
              <TouchableOpacity className="mt-2 self-start py-1.5 px-3 bg-orange-100 rounded-lg">
                <Text className="text-orange-600 text-[12px] font-bold">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View className="mt-8 px-6">
          <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Account Settings</Text>
          <View className="bg-white rounded-[30px] p-4 shadow-sm">
            <MenuItem 
              icon={UserIcon} 
              title="Personal Information" 
              onPress={() => navigation.navigate('Profile')} 
            />
            <MenuItem 
              icon={CreditCardIcon} 
              title="Payment Methods" 
              onPress={() => {}} 
            />
            <MenuItem 
              icon={ClockIcon} 
              title="Order History" 
              onPress={() => navigation.navigate('OrderHistory')} 
            />
            <MenuItem 
              icon={MapPinIcon} 
              title="Delivery Address" 
              onPress={() => {}} 
              showBorder={false}
            />
          </View>
        </View>

        {/* Support & Others */}
        <View className="mt-6 px-6">
          <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Support & More</Text>
          <View className="bg-white rounded-[30px] p-4 shadow-sm">
            <MenuItem 
              icon={InformationCircleIcon} 
              title="About Us" 
              onPress={() => {}} 
            />
            <MenuItem 
              icon={ShieldCheckIcon} 
              title="Privacy Policy" 
              onPress={() => {}} 
              showBorder={false}
            />
          </View>
        </View>

        {/* Logout Section */}
        <TouchableOpacity 
          className="mt-10 mx-6 bg-red-50 py-4 rounded-2xl items-center justify-center border border-red-100"
          onPress={logout}
        >
          <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>

        <View className="mt-8 items-center">
          <Text className="text-gray-400 text-xs">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Account;