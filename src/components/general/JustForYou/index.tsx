import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import GoodItemCard from '../GoodItemCard';

type Props = {
  liquidation: boolean;
  justForYou: object;
};

const renderItem = (liquidation, item) => (
  <View style={{width: '49%', marginBottom: 24}}>
    <GoodItemCard liquidation={liquidation} item={item} />
  </View>
);

const getItemLayout = (data, index) => ({
  length: 244,
  offset: 244 * index,
  index,
});

function JusForYou({liquidation, justForYou}: Props) {
  const justForYouArray = [...justForYou.products.slice(0, 8)];
  return (
    <View style={style.justForYouContainer}>
      <View>
        <Text style={style.justForYouTitle}>{justForYou.name}</Text>
      </View>
      <FlatList
        getItemLayout={getItemLayout}
        listKey="justForYou"
        scrollEnabled={false}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={justForYouArray}
        renderItem={({item}) => renderItem(liquidation, item)}
        numColumns={2}
      />
    </View>
  );
}

export default React.memo(JusForYou);

const style = StyleSheet.create({
  justForYouContainer: {
    paddingHorizontal: 16,
  },
  justForYouTitle: {
    marginBottom: 16,
    fontFamily: 'PTRootUI-Bold',
    fontSize: 20,
    lineHeight: 24,
  },
});
