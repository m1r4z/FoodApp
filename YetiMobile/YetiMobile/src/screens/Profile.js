import { useNavigation } from '@react-navigation/native';
import { useContext } from "react";
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, EnvelopeIcon, MapPinIcon, PhoneIcon, UserIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const navigation = useNavigation();
  const { authData } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const InfoItem = ({ icon: Icon, label, value }) => (
    <View className="flex-row items-center p-4 bg-white rounded-2xl mb-4 shadow-sm shadow-black/5">
      <View className="w-12 h-12 bg-orange-50 rounded-xl items-center justify-center mr-4">
        <Icon size={24} color="#f97316" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</Text>
        <Text className="text-gray-800 text-lg font-semibold mt-0.5">{value || 'Not provided'}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header Background - Increased height to ensure text fits */}
      <View className="absolute top-0 left-0 right-0 h-80 bg-orange-500 rounded-b-[40px]" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Top Navbar */}
        <View 
          style={{ paddingTop: insets.top + 10 }} 
          className="px-6 flex-row items-center"
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <ChevronLeftIcon color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white ml-4">My Profile</Text>
        </View>

        {/* Profile Image Section */}
        <View className="items-center mt-6">
          <View className="relative">
            <View className="p-1 bg-white/30 rounded-full">
              <Image 
                source={require('../../assets/images/defultProfile.png')}
                className="w-32 h-32 rounded-full border-4 border-white" 
              />
            </View>
            <TouchableOpacity className="absolute bottom-1 right-1 w-10 h-10 bg-orange-500 rounded-full border-4 border-white items-center justify-center">
              <UserIcon size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View className="items-center mt-4">
            <Text className="text-2xl font-bold text-white">{authData?.fullName}</Text>
            <Text className="text-orange-100 font-medium opacity-90">{authData?.email}</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View className="px-6 mt-8">
          <InfoItem 
            icon={UserIcon} 
            label="Full Name" 
            value={authData?.fullName} 
          />
          <InfoItem 
            icon={PhoneIcon} 
            label="Phone Number" 
            value={authData?.phoneNumber} 
          />
          <InfoItem 
            icon={EnvelopeIcon} 
            label="Email Address" 
            value={authData?.email} 
          />
          <InfoItem 
            icon={MapPinIcon} 
            label="Location" 
            value="London, United Kingdom" 
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity className="mx-6 mt-6 bg-orange-500 py-4 rounded-2xl items-center justify-center shadow-lg shadow-orange-200">
          <Text className="text-white font-bold text-lg">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

export default Profile;