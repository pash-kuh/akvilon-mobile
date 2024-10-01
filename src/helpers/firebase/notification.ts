import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';
import {Alert} from 'react-native';
import InAppReview from '@src/modules/InAppReview';
/**
 * Подключение уведомлений Firebase
 *
 * @category Helper
 */
export class FirebaseNotification {
  authStatus: FirebaseMessagingTypes.AuthorizationStatus;
  token: string;

  requestUserPermission() {
    try {
      messaging()
        .requestPermission()
        .then(async (authStatus) => {
          const {AUTHORIZED, PROVISIONAL} = messaging.AuthorizationStatus;
          const enabled =
            authStatus === AUTHORIZED || authStatus === PROVISIONAL;
          if (enabled) {
            this.authStatus = authStatus;
            try {
              await this.getFCMToken();
            } catch (e) {
              console.error('getFCMToken: error');
              console.error(e);
            }
          }
        });
    } catch (e) {
      console.error('requestPermission: error');
      console.error(e);
    }
  }

  static async getToken(token) {
    const id = await messaging().getToken();
    const payload = {deviceId: id};
    await this.saveToken(payload, token);
  }

  static async saveToken(payload, token) {
    try {
      await apiMobile.post('/device/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getFCMToken() {
    try {
      await messaging().getAPNSToken();
      const token = await messaging().getToken();
      
      if (token) {
        this.token = token;
        this.createChannel();
        this.setMessageHandler();
      } else {
        console.log('Failed', 'No token received');
      }
    } catch (e) {
      console.log('token error');
    }
  }

  createChannel() {
    PushNotification.channelExists('default-channel-id', (exists) => {
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: 'default-channel-id',
            channelName: 'Default channel',
            channelDescription: 'A default channel',
            soundName: 'default',
            importance: Importance.HIGH,
            vibrate: true,
          },
          (created) =>
            console.log(
              `createChannel 'default-channel-id' returned '${created}'`,
            ),
        );
      } else {
        console.log('default-channel-id all ready exists');
      }
    });
    messaging()
      .subscribeToTopic('default-channel-id')
      .then(() => console.log('Subscribed to topic!'));
  }

  setMessageHandler() {
    // TODO: Пока закоментировал. Почему-то отправляется в бекграунде 2 сообщения
    // messaging().setBackgroundMessageHandler(this.getPushNotify);
    messaging().onMessage(this.getPushNotify);
    messaging().onNotificationOpenedApp(this.notificationOpenedApp);
  }

  async getPushNotify(notify) {
    try {
      await PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: notify.notification.title,
        message: notify.notification.body,
      });
    } catch (e) {
      console.error(`[NOTIFY ERROR]: ${e}`);
    }
  }

  async notificationOpenedApp({data}) {
    if (data.update === '1') {
      Alert.alert(
        'Обновить приложение',
        '"Это необходимо", чтобы приложение работало стабильно',
        [
          {
            text: 'Позже',
            style: 'cancel',
          },
          {
            text: 'Ок',
            onPress: async () => await InAppReview.RequestInAppReview(),
          },
        ],
      );
    }
  }
}
