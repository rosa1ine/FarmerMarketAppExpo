import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const SalesReportGraph = ({ data }) => {
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // Optional: Customize graph line width
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth - 20} // Adjust to fit screen
        height={250}
        chartConfig={chartConfig}
        bezier
        fromZero={true} // Start graph from 0
        xLabelsOffset={-10} // Adjust label position
        verticalLabelRotation={45} // Rotate labels for readability
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default SalesReportGraph;
