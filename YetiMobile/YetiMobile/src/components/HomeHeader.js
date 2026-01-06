import { Text, TouchableOpacity, View } from 'react-native'
import { BellIcon, MagnifyingGlassIcon, MapPinIcon } from 'react-native-heroicons/outline'

const HomeHeader = () => {
  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      {/* Location Section */}
      <View className="flex-1">
        <View className="flex-row items-center">
          <MapPinIcon size={18} color="#FF6347" />
          <Text className="text-gray-500 text-xs font-medium ml-1">Your Location</Text>
        </View>
        <Text className="text-black font-bold text-sm" numberOfLines={1}>
          MC47+RP8, Belbari 56600, Nepal
        </Text>
      </View>

      {/* Action Icons */}
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
          <MagnifyingGlassIcon size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
          <BellIcon size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeHeader