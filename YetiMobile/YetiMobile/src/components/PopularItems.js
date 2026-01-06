import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'

const PopularItems = () => {
  const popularItems = [
    {
      id: '01',
      image: require("../../assets/images/biryani.jpg"),
      name: 'Biryani',
      bgColor: '#FFEBEE'
    }, {
      id: '02',
      image: require("../../assets/images/friedrice.jpg"),
      name: 'Fried Rice',
      bgColor: '#E3F2FD'
    }, {
      id: '03',
      image: require("../../assets/images/momos.jpg"),
      name: 'Momo',
      bgColor: '#F1F8E9'
    }, {
      id: '04',
      image: require("../../assets/images/chowmien.jpg"),
      name: 'Chowmien',
      bgColor: '#FFF3E0'
    }, {
      id: '05',
      image: require("../../assets/images/saugages.jpg"),
      name: 'Saugages',
      bgColor: '#F3E5F5'
    }, {
      id: '06',
      image: require("../../assets/images/friedchicken.jpg"),
      name: 'Fried Chicken',
      bgColor: '#EFEBE9'
    },
    {
      id: '07',
      image: require("../../assets/images/fries.jpg"),
      name: 'Fries',
      bgColor: '#ECEFF1'
    }
  ]
  const renderPopularItems = ({ item }) => {
    return (
      <View className="items-center mx-2 mb-2">
        <TouchableOpacity 
          activeOpacity={0.7}
          style={{ backgroundColor: item.bgColor }}
          className="p-1 rounded-full shadow-sm"
        >
          <View className="bg-white rounded-full p-2">
            <Image
              className="rounded-full"
              source={item.image}
              style={{ height: 60, width: 60 }}
            />
          </View>
        </TouchableOpacity>
        <Text className="text-gray-700 text-xs font-semibold mt-2">{item.name}</Text>
      </View>
    )
  }
  return (
    <View className="mt-2">
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={popularItems}
        renderItem={renderPopularItems}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  )
}

export default PopularItems