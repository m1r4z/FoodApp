import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const carouselData = [
    {
      id: "01",
      image: require("../../assets/images/Burger1.jpg")
    },
    {
      id: "02",
      image: require("../../assets/images/Pizza.jpg")
    }, {
      id: "03",
      image: require("../../assets/images/Noodles.jpg")
    }
  ]

  useEffect(() => {
    let interval = setInterval(() => {
      if (activeIndex === carouselData.length - 1) {
        flatListRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      } else {
        flatListRef.current.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index: index,
  });

  const renderCarouselItems = ({ item, index }) => {
    return (
      <View style={{ width: width, paddingHorizontal: 16 }}>
        <TouchableOpacity activeOpacity={0.9}>
          <View className="shadow-lg shadow-black/40">
            <Image
              className="rounded-3xl"
              source={item.image}
              style={{ height: 200, width: '100%' }}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  }

  return (
    <View className="mt-4">
      <FlatList
        ref={flatListRef}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        data={carouselData}
        renderItem={renderCarouselItems}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      {/* Pagination Indicators */}
      <View className="flex-row justify-center items-center mt-3">
        {carouselData.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${activeIndex === index ? 'bg-orange-500 w-6' : 'bg-gray-300 w-2'}`}
          />
        ))}
      </View>
    </View>
  )
}

export default Carousel