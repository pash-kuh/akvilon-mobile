import React from 'react';
import {

  StyleSheet,
  Text,
  View
} from 'react-native';





function App(): React.JSX.Element {


  return (

    <View>
      <Text style={styles.text}>HHHHHHHHHHHHHHHHHHello</Text>
      <Text style={styles.text}>HHHHHHHHHHHHHHHHHHello</Text>
      <Text style={styles.text}>HHHHHHHHHHHHHHHHHHello</Text>

    </View>





  );
}

const styles = StyleSheet.create({
  text: {
    color: 'red'
  },

});

export default App;
