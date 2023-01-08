import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

import { useAssets } from 'expo-asset';
import { useState } from 'react';
import { readAsStringAsync } from 'expo-file-system';

export default function App() {
  const [index, indexLoadingError] = useAssets(
    require('./index.html')
  );

  const [html, setHtml] = useState('');

  if (index) {
    readAsStringAsync(index[0].localUri).then((data) => {
      setHtml(data);
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
      <WebView
        source={{ html }}
      />
    </SafeAreaView>
  );
}
