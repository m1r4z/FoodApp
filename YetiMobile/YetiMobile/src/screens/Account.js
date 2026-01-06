import { useNavigation } from '@react-navigation/native';
import { useContext } from "react";
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftOnRectangleIcon, ChevronRightIcon } from 'react-native-heroicons/outline';
import { AuthContext } from "../context/AuthContext";

const Account = () => {
  const navigation = useNavigation();
  const { authData } = useContext(AuthContext);
  const { setAuthInfo } = useContext(AuthContext);

  const logout = () => {
    setAuthInfo(null);
    navigation.navigate("LogIn")
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className='mt-8 justify-between items-center flex-row'>
          <Text className='font-bold text-2xl text-center flex-1'>My Account</Text>
          <TouchableOpacity onPress={logout} className="absolute right-4">
            <ArrowLeftOnRectangleIcon color={'black'} size={24} />
          </TouchableOpacity>
        </View>
        <View className='flex-row items-center px-6 mt-8'>
          <Image source={require('../../assets/images/defultProfile.png')}
            className='w-20 h-20 rounded-full' />
          <View className='ml-4'>
            <Text className='text-xl font-bold text-gray-800'>{authData.fullName}</Text>
            <Text className='text-gray-500 text-sm'>{authData.email}</Text>
          </View>
        </View>

        {/*This view is for navigating to different account related things */}
        <View className="mt-10 px-6">
          <TouchableOpacity className='py-4 border-b border-gray-100' onPress={() => { navigation.navigate('Profile') }}>
            <View className='items-center flex-row justify-between'>
              <Text className='text-lg font-medium text-gray-700'>Profile</Text>
              <ChevronRightIcon color={'#9ca3af'} size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className='py-4 border-b border-gray-100'>
            <View className='items-center flex-row justify-between'>
              <Text className='text-lg font-medium text-gray-700'>Payment Settings</Text>
              <ChevronRightIcon color={'#9ca3af'} size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className='py-4 border-b border-gray-100'>
            <View className='items-center flex-row justify-between'>
              <Text className='text-lg font-medium text-gray-700'>Order History</Text>
              <ChevronRightIcon color={'#9ca3af'} size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className='py-4 border-b border-gray-100'>
            <View className='items-center flex-row justify-between'>
              <Text className='text-lg font-medium text-gray-700'>Delivery Address</Text>
              <ChevronRightIcon color={'#9ca3af'} size={20} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity className='py-4 border-b border-gray-100'>
            <View className='items-center flex-row justify-between'>
              <Text className='text-lg font-medium text-gray-700'>About Us</Text>
              <ChevronRightIcon color={'#9ca3af'} size={20} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className='bg-orange-500 mx-6 rounded-2xl h-14 items-center justify-center mt-12 shadow-lg shadow-orange-200' onPress={logout}>
          <Text className='text-xl font-bold text-white'>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Account