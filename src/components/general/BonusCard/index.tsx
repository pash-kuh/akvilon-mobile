import {GREY_3, GREY_90} from '@src/assets/style/variable.style';
import QrCodeDrawer from '@src/components/drawers/qrCodeDrawer';
import morphHelper from '@src/helpers/morphHelper';
import React, {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InstructionsModal from '../InstructionsModal';
import analytics from '@react-native-firebase/analytics';
import {UserState} from '@src/store/modules/user/UserTypes';

type Props = {
  points: number;
  user: UserState;
};

export default function BonusCard({points, user}: Props) {
  const [open, setOpen] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const showQrCode = async () => {
    if (user?.loyalty && user?.loyalty?.number) {
      await analytics().logEvent('main_QR');
      setOpen(true);
    } else {
      setInstructions(true);
    }
  };

  return (
    <Pressable onPress={showQrCode} style={style.bonusCardContainer}>
      {user?.loyalty?.number ? (
        <>
          <Image
            source={require('@src/assets/image/newbonus.png')}
            style={style.imageContainer}
          />
          <View style={style.pointsContainer}>
            <Text style={style.bonusCardDescription}>
              {points} балл{morphHelper('', 'а', 'ов', points)}
            </Text>
          </View>
        </>
      ) : (
        <View style={style.emptyState}>
          <Image
            source={require('@src/assets/image/newbonus.png')}
            style={style.emptyImageContainer}
          />
          <View style={style.transparent}></View>
          <View style={style.emptyCard}>
            <Text style={style.emptyText}>
              Место для вашей карты АКВИЛОН.BONUS
            </Text>
          </View>
        </View>
      )}
      <TouchableOpacity onPress={showQrCode} style={style.bottomPart}>
        <Text style={style.bottomText}>
          {user?.loyalty?.number ? 'Открыть QR-код' : 'Как получить'}
        </Text>
      </TouchableOpacity>
      {open && <QrCodeDrawer open={open} setOpen={setOpen} />}
      {instructions && (
        <InstructionsModal
          setInstructions={setInstructions}
          instructions={instructions}
        />
      )}
    </Pressable>
  );
}

const style = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 14,
  },
  emptyImageContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
  emptyState: {
    width: '100%',
    height: 200,
    backgroundColor: GREY_3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  bonusCardContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 4,
  },
  pointsContainer: {
    position: 'absolute',
    top: 104,
    right: 20,
    width: 300,
  },
  emptyCard: {
    position: 'absolute',
    top: 56,
    width: 300,
  },
  transparent: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(211,211,211,0.5)',
    borderRadius: 14,
  },
  pointsText: {
    color: 'white',
    textAlign: 'right',
    fontSize: 29,
    fontFamily: 'PTRootUI-Medium',
  },
  bottomPart: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#0A79CB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomEndRadius: 14,
    borderBottomStartRadius: 14,
  },
  bottomText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontFamily: 'PTRootUI-Regular',
  },
  bonusCardDescriptionContainer: {},
  bonusCardDescriptionTitle: {
    fontFamily: 'PTRootUI-Medium',
    fontSize: 13,
  },
  bonusCardDescription: {
    color: 'white',
    fontFamily: 'PTRootUI-Regular',
    fontSize: 29,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: GREY_90,
    fontSize: 17,
    fontFamily: 'PTRootUI-Bold',
  },
});
