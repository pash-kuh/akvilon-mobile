import performance from '@react-native-firebase/perf';
/**
 * Подключение замера скорости работы приложения Firebase
 *
 * @category Helper
 */
export class FireBasePerformance {
  // crashlytics: any;

  constructor() {
    // this.crashlytics = crashlytics;
  }

  async initTrace(userToken) {
    try {
      const trace = await performance().startTrace('initial_trace');

      trace.putAttribute('user_token', userToken);

      await trace.stop();
    } catch (e) {
      console.error('initTracePerformance: error');
      console.error(e);
      // this.crashlytics.log('initTracePerformance: error');
    }
  }
}
