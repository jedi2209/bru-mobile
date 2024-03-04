/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/core/App';
import './src/core/lang/index';
import {name as appName} from './app.json';

import {attachLogger} from 'effector-logger';

attachLogger();

AppRegistry.registerComponent(appName, () => App);
