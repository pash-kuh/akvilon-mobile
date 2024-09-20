import {Linking, Share} from 'react-native';

export interface IMessage {
  message: string;
  body: IPageMessage & IAuthMessage & string & {message: string};
}

export interface IAuthMessage {
  token: string;
}

export interface IPageMessage {
  screen: string;
  title: {
    code: string;
    value: string;
  };
  param: {
    code: string;
    value: string;
  };
}
/**
 * Работа с Webview
 *
 * @category Helper
 */
export class MessageParser {
  private readonly message: string;
  private readonly body: IPageMessage &
    IAuthMessage &
    string & {message: string};

  constructor(data: IMessage) {
    this.message = data.message;
    this.body = data.body;
  }

  public init() {
    switch (this.message) {
      case 'auth':
        return MessageParser.authMethod();
      case 'page':
        return MessageParser.pageMethod(this.body);
      case 'city':
        return MessageParser.cityMethod();
      case 'cart':
        return MessageParser.cartMethod(this.body);
      case 'linking':
        return MessageParser.linkingMethod(this.body);
      case 'share':
        return MessageParser.shareMethod(this.body);
      case 'review':
        return MessageParser.reviewMethod();
      case 'back':
        return MessageParser.backMethod();
      case 'camera':
        return MessageParser.cameraMethod();
      case 'logout':
        return MessageParser.logoutMethod();
      case 'qrCode':
        return MessageParser.qrCodeMethod(this.body);
      case 'favorites':
        return MessageParser.favoritesMethod(this.body);
      default:
        console.error('[helper/webview/MessageParser] Не найден такой тип');
    }
  }

  private static async linkingMethod(link: string) {
    try {
      if (link.includes('homecredit') || link.includes('estim')) {
        console.log(link.replace('https//', ''))
        await Linking.openURL(`https://${link.slice(8)}`);
      } else {
        await Linking.openURL(`https://${link}`);
      }
    } catch (e) {
      console.error(e);
    }
    return {type: ''};
  }

  private static authMethod() {
    return {
      type: 'auth',
    };
  }

  private static pageMethod(payload: IPageMessage) {
    return {
      type: 'page',
      ...payload,
    };
  }

  private static cityMethod() {
    return {};
  }

  private static reviewMethod() {
    return {
      type: 'review',
    };
  }

  private static cameraMethod() {
    return {
      type: 'camera',
    };
  }

  private static logoutMethod() {
    return {
      type: 'logout',
    };
  }

  private static async shareMethod({message}: {message: string}) {
    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  private static cartMethod(body: object) {
    return {
      type: 'cart',
      body,
    };
  }

  private static qrCodeMethod(body: object) {
    return {
      type: 'qrCode',
      ...body,
    };
  }

  private static backMethod() {
    return {
      type: 'back',
    };
  }

  private static favoritesMethod(body: object) {
    return {
      type: 'favorites',
      ...body,
    }
  }
}
