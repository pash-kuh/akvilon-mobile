import {createNavigatorFactory} from '@react-navigation/native';
import TabNavigator from '@src/helpers/router/TabRouter/navigator';

// ...

export const createTabNavigator = createNavigatorFactory(TabNavigator);
