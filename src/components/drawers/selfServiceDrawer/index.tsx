import React from 'react';
import { BRAND_RED_50, GREY_3, WHITE } from '@src/assets/style/variable.style';
import DrawerComponent from '@src/components/general/drawer/DrawerComponent';
import { SelfServiceIcon } from '@src/components/icons/selfServiceDrawerIcon';
import { RootState } from '@src/store';
import { setSelfServices } from '@src/store/modules/selfServiceData/SelfServiceReducer';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-native-paper';
import { StackActions, useNavigation } from '@react-navigation/native';
import {
  setRoute,
  setTab,
  setAction,
} from '@src/store/modules/webview/WebviewReducer';
import SelfServiceItemCard from './item';
import { typography } from "@src/assets/style/typography.style";

/**
 * Всплывающее окно для уточнения самооплаты
 * @category Drawer
 */

const textData = {
  titleText: 'Возьмите товар с собой на кассу',
  contentText:
    'Это товар для самообслуживания. Для ускорения покупки просто возьмите его с собой на кассу, не добавляя в корзину.',
};

interface SelfServiceInterface {
  close: () => void;
  onPressTakeIt: () => void;
}

export const SelfServiceDrawer = ({
  close,
  onPressTakeIt,
}: SelfServiceInterface) => {
  let { selfService } = useSelector((s: RootState) => s);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (!selfService) {
    return null;
  }

  const clearSelfServiceData = () => dispatch(setSelfServices(null));
  const onPressProductHandle = () => {
    dispatch(setRoute(`redirect|/p/${selfService.code}`));
    dispatch(setTab('Catalog'));
    dispatch(setAction('return'));
    navigation.dispatch(
      StackActions.push('CatalogMainScreen', {
        isWebPage: true,
        route: `/p/${selfService.code}`,
      }),
    );
    clearSelfServiceData();
  };
  const closeHandle = () => {
    clearSelfServiceData();
    close();
  };
  const onPressTakeItHandler = () => {
    closeHandle();
    onPressTakeIt();
  };

  if (selfService.discount.value > 0) {
    selfService = {
      ...selfService,
      badges: ["Акция"]
    }
  }

  return (
    <DrawerComponent
      title=""
      close={closeHandle}
      borderRadius={{ topLeft: 12, topRight: 12 }}
      margin={0}
      content={
          <View style={style.modalContent}>
            <View style={style.textBlockMain}>
              <View style={style.icon}>
                <SelfServiceIcon width={96} height={96} />
              </View>

              <Text style={style.header}>{textData.titleText}</Text>
              <Text style={style.text}>{textData.contentText}</Text>
            </View>

            <Pressable onPress={onPressProductHandle}>
              <View style={style.product}>
                <SelfServiceItemCard
                  item={selfService}
                  // Проверка на то, является ли item с распродажей
                  liquidation={selfService.badges[0] === "Акция"}
                />
              </View>
            </Pressable>

            <Button onPress={onPressTakeItHandler} style={style.button}>
              <Text style={style.buttonText}>Возьму с собой</Text>
            </Button>
          </View>
      }
    />
  );
};

const style = StyleSheet.create({
  /** Контейнер */

  modalContent: {
    paddingTop: 0,
    paddingLeft: 16,
    paddingBottom: 50,
    paddingRight: 16,
  },
  textBlockMain: {
    marginBottom: 32,
  },
  header: {
    fontFamily: 'PTRootUI-Bold',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.01,
    textAlign: 'center',
    marginBottom: 8,
  },
  text: {
    fontFamily: 'PTRootUI-Regular',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  icon: {
    marginBottom: 12,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  product: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: GREY_3,
  },
  button: {
    marginTop: 32,
    height: 48,
    borderRadius: 4,
    backgroundColor: BRAND_RED_50,
  },
  buttonText: {
    letterSpacing: 0,
    ...typography('lg', 'medium'),
    color: WHITE,
    textTransform: 'none',
  },
});
