import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
const SQLite = isNative ? require('expo-sqlite') : null;

const BARCODE_TYPES = [
  'qr',
  'ean13',
  'ean8',
  'upc_a',
  'upc_e',
  'code39',
  'code93',
  'code128',
  'codabar',
  'itf14',
  'pdf417',
  'aztec',
  'datamatrix',
];

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [view, setView] = useState('scanner'); // 'scanner' | 'history'
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null); // { type, data }
  const [history, setHistory] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const dbRef = useRef(null);

  // Inicjalizacja bazy SQLite (tylko na platformach natywnych)
  useEffect(() => {
    if (!isNative) {
      // Na webie historia jest tylko w pamięci sesji
      setDbReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const db = await SQLite.openDatabaseAsync('scans.db');
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data TEXT NOT NULL,
            type TEXT NOT NULL,
            createdAt TEXT NOT NULL
          );
        `);
        if (cancelled) return;
        dbRef.current = db;
        setDbReady(true);
      } catch (err) {
        if (cancelled) return;
        setDbError(err.message || 'Nie udało się zainicjalizować bazy danych');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadHistory = async () => {
    if (!isNative) {
      // Na webie historia jest juz w stanie komponentu
      return;
    }
    if (!dbRef.current) return;
    setLoadingHistory(true);
    try {
      const rows = await dbRef.current.getAllAsync(
        'SELECT id, data, type, createdAt FROM scans ORDER BY id DESC;'
      );
      setHistory(rows);
    } catch (err) {
      Alert.alert('Blad', err.message || 'Nie udało się wczytać historii');
    } finally {
      setLoadingHistory(false);
    }
  };

  const saveScan = async (data, type) => {
    const createdAt = new Date().toISOString();
    if (!isNative) {
      setHistory((prev) => [
        { id: Date.now(), data, type, createdAt },
        ...prev,
      ]);
      return;
    }
    if (!dbRef.current) return;
    try {
      await dbRef.current.runAsync(
        'INSERT INTO scans (data, type, createdAt) VALUES (?, ?, ?);',
        [data, type, createdAt]
      );
    } catch (err) {
      Alert.alert('Blad zapisu', err.message || 'Nie udało się zapisać wyniku skanowania');
    }
  };

  const doClearHistory = async () => {
    if (!isNative) {
      setHistory([]);
      return;
    }
    try {
      await dbRef.current.runAsync('DELETE FROM scans;');
      setHistory([]);
    } catch (err) {
      Alert.alert('Błąd', err.message || 'Nie udało się wyczyscić historii');
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Wyczyścić historię?',
      'Tej operacji nie da się cofnąć.',
      [
        { text: 'Anuluj', style: 'cancel' },
        { text: 'Wyczyść', style: 'destructive', onPress: doClearHistory },
      ]
    );
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setResult({ type, data });
    saveScan(data, type);
  };

  const rescan = () => {
    setResult(null);
    setScanned(false);
  };

  useEffect(() => {
    if (view === 'history' && dbReady) {
      loadHistory();
    }
  }, [view, dbReady]);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  // --- Obsluga uprawnien ---
  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4a90d9" />
        <Text style={styles.infoText}>Sprawdzanie uprawnień...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <Text style={styles.header}>Brak dostępu do aparatu</Text>
        <Text style={styles.infoText}>
          Aby skanować kody, aplikacja potrzebuje dostępu do aparatu urządzenia.
        </Text>
        {permission.canAskAgain ? (
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Nadaj uprawnienia</Text>
          </Pressable>
        ) : (
          <>
            <Text style={styles.warningText}>
              Uprawnienia zostały trwale odmówione. Włącz je ręcznie w ustawieniach systemowych.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={() => Linking.openSettings()}
            >
              <Text style={styles.buttonText}>Otwórz ustawienia</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  if (dbError) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <Text style={styles.header}>Błąd bazy danych</Text>
        <Text style={styles.errorText}>{dbError}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4a90d9" />
        <Text style={styles.infoText}>Inicjalizacja bazy danych...</Text>
      </View>
    );
  }

  // --- Glowny widok ---
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.topBar}>
        <Text style={styles.header}>Skaner kodów</Text>
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, view === 'scanner' && styles.tabActive]}
            onPress={() => setView('scanner')}
          >
            <Text style={[styles.tabText, view === 'scanner' && styles.tabTextActive]}>
              Skaner
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, view === 'history' && styles.tabActive]}
            onPress={() => setView('history')}
          >
            <Text style={[styles.tabText, view === 'history' && styles.tabTextActive]}>
              Historia
            </Text>
          </Pressable>
        </View>
      </View>

      {view === 'scanner' ? (
        <View style={styles.scannerWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
          >
            <View style={styles.overlay}>
              <View style={styles.frame} />
            </View>
          </CameraView>

          {result && (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Odczytany kod</Text>
              <Text style={styles.resultType}>Typ: {result.type}</Text>
              <Text style={styles.resultData} selectable>
                {result.data}
              </Text>
              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={rescan}
              >
                <Text style={styles.buttonText}>Skanuj ponownie</Text>
              </Pressable>
            </View>
          )}

          {!result && (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>
                Umieść kod w kadrze - aplikacja odczyta go automatycznie.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.historyWrapper}>
          {loadingHistory ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#4a90d9" />
              <Text style={styles.infoText}>Wczytywanie historii...</Text>
            </View>
          ) : history.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.infoText}>Brak zapisanych skanów.</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historyItem}>
                    <Text style={styles.historyType}>{item.type}</Text>
                    <Text style={styles.historyData} selectable>
                      {item.data}
                    </Text>
                    <Text style={styles.historyDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                )}
                contentContainerStyle={styles.listContent}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.clearButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={clearHistory}
              >
                <Text style={styles.buttonText}>Wyczyść historię</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
    paddingTop: 50,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f1419',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topBar: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1c2733',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#4a90d9',
  },
  tabText: {
    color: '#9aa8b6',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#fff',
  },
  scannerWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 240,
    height: 240,
    borderWidth: 3,
    borderColor: '#4a90d9',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  hintBox: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  hintText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
  },
  resultBox: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  resultType: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  resultData: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  button: {
    backgroundColor: '#4a90d9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#c0392b',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  historyWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  historyItem: {
    backgroundColor: '#1c2733',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyType: {
    fontSize: 11,
    color: '#7fb3e6',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  historyData: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  historyDate: {
    fontSize: 11,
    color: '#9aa8b6',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoText: {
    color: '#cfd6dd',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  warningText: {
    color: '#f1c40f',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
