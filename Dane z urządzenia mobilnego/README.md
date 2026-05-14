# Skaner kodów QR i kreskowych

Aplikacja mobilna napisana w React Native (Expo), realizująca zadanie **4.6 - Skaner kodów QR lub kodów kreskowych** z modułu "Dane z urządzenia mobilnego".

## 1. Opis celu aplikacji

Celem aplikacji jest umożliwienie użytkownikowi szybkiego odczytu kodów QR oraz kodów kreskowych przy użyciu aparatu wbudowanego w urządzenie mobilne. Aplikacja:

- uruchamia podgląd obrazu z aparatu w czasie rzeczywistym,
- automatycznie wykrywa kody pojawiające się w kadrze,
- prezentuje użytkownikowi treść odczytanego kodu wraz z jego typem (np. `qr`, `ean13`, `code128`),
- zabezpiecza przed wielokrotnym odczytem tego samego kodu poprzez zmienną `scanned`,
- pozwala na ponowne skanowanie po naciśnięciu przycisku "Skanuj ponownie",
- przechowuje lokalną **historię zeskanowanych kodów** wraz z datą i typem kodu,
- obsługuje stany błędów i odmowy uprawnień (informuje użytkownika oraz oferuje akcje naprawcze).

## 2. Opis wykorzystanych danych z urządzenia

Aplikacja korzysta z następujących źródeł danych:

- **Obraz z aparatu (kamera tylna)** - strumień wideo wykorzystywany do wykrywania kodów w czasie rzeczywistym. Dane obrazu są przetwarzane lokalnie przez moduł `expo-camera`, który zwraca rozpoznaną wartość kodu wraz z jego typem. Surowy obraz **nie jest zapisywany ani wysyłany na zewnątrz** - przetwarzane są wyłącznie metadane kodu.
- **Lokalna pamięć urządzenia (baza SQLite)** - wykorzystywana do trwałego zapisu historii skanów (treść kodu, typ kodu, znacznik czasu). Dane przechowywane są wyłącznie na urządzeniu użytkownika.
- **Uprawnienia systemowe** - aplikacja odczytuje stan uprawnień do aparatu poprzez hook `useCameraPermissions`.

## 3. Opis wykorzystanych bibliotek i API

Projekt opiera się na ekosystemie Expo (SDK 52) oraz React Native i wykorzystuje te same wersje zależności co pozostałe katalogi w repozytorium.

| Biblioteka | Wersja | Rola w projekcie |
|---|---|---|
| `expo` | ~52.0.49 | Środowisko uruchomieniowe i system konfiguracji aplikacji |
| `react` | 18.3.1 | Biblioteka komponentowa UI |
| `react-native` | 0.76.9 | Warstwa natywna komponentów mobilnych |
| `expo-camera` | ~16.0.18 | Dostęp do aparatu, podgląd z kamery i wykrywanie kodów w kadrze (`CameraView`, `onBarcodeScanned`) |
| `expo-sqlite` | ~15.0.6 | Lokalna baza danych do zapisu historii skanów |
| `expo-status-bar` | ~2.0.1 | Konfiguracja paska statusu |

### Wykorzystane API i komponenty

- **`useCameraPermissions()`** - hook z `expo-camera` zarządzający uprawnieniami do aparatu (odczyt aktualnego stanu, prośba o nadanie uprawnień).
- **`<CameraView />`** - komponent podglądu z kamery; obsługuje parametr `barcodeScannerSettings` (typy kodów do wykrywania) oraz zdarzenie `onBarcodeScanned`, które zwraca obiekt `{ type, data }`.
- **`expo-sqlite` (`openDatabaseAsync`)** - asynchroniczne API do pracy z bazą SQLite: tworzenie tabeli `scans (id, data, type, createdAt)`, wstawianie nowych rekordów, pobieranie i czyszczenie historii.
- **Komponenty React Native** - `View`, `Text`, `Pressable`, `FlatList`, `ActivityIndicator`, `StyleSheet`, `Alert` itd. wykorzystywane do budowy interfejsu.

## 4. Opis przepływu danych w aplikacji

1. **Weryfikacja uprawnień** - przy starcie aplikacja sprawdza, czy ma dostęp do aparatu. Jeśli nie, prosi użytkownika o zgodę. W przypadku odmowy prezentowany jest ekran informacyjny z możliwością ponowienia prośby.
2. **Inicjalizacja bazy danych** - przy pierwszym uruchomieniu tworzona jest tabela `scans` w lokalnej bazie SQLite.
3. **Skanowanie** - komponent `CameraView` analizuje obraz w czasie rzeczywistym. Po wykryciu kodu wywoływane jest zdarzenie `onBarcodeScanned`, które przekazuje obiekt `{ type, data }`.
4. **Zabezpieczenie przed duplikatami** - flaga stanu `scanned` blokuje kolejne odczyty, dopóki użytkownik nie kliknie "Skanuj ponownie". Dzięki temu jeden kod nie jest dodawany do historii wielokrotnie w jednej sesji odczytu.
5. **Zapis wyniku** - wynik zapisywany jest w bazie SQLite wraz ze znacznikiem czasu.
6. **Prezentacja historii** - odczytane kody są dostępne w widoku historii, posortowane malejąco wg daty.

## 5. Lista ograniczeń i problemów napotkanych podczas realizacji

- **Wsparcie platform** - `expo-camera` w wariancie skanowania kodów działa pełnoprawnie na urządzeniach fizycznych (Android, iOS). W przeglądarce (`expo start --web`) funkcjonalność wykrywania kodów może być ograniczona lub niedostępna ze względu na różnice w API kamery przeglądarki.
- **Brak `expo-sqlite` na webie** - moduł natywny `ExpoSQLite` nie jest dostępny w środowisku przeglądarkowym (wymagałby konfiguracji WASM w Metro). Aplikacja wykrywa platformę i na webie używa fallbacku w pamięci sesji (`useState`); historia nie jest wtedy trwała. Na Androidzie/iOS wykorzystywany jest pełnoprawny SQLite.
- **Emulator vs. urządzenie fizyczne** - emulator Androida nie zapewnia rzeczywistego strumienia z kamery; testowanie skanowania wymaga urządzenia fizycznego lub kamery wirtualnej.
- **Trwała odmowa uprawnień** - jeżeli użytkownik trwale odmówi zgody na dostęp do aparatu, `requestPermission()` nie otworzy ponownie systemowego okna dialogowego. Konieczne jest ręczne włączenie uprawnień w ustawieniach systemowych - aplikacja informuje o tym komunikatem.
- **Wielokrotny odczyt tego samego kodu** - bez flagi `scanned` `onBarcodeScanned` jest wywoływany wielokrotnie na sekundę, co prowadziłoby do zalania bazy danych duplikatami. Rozwiązano to przez blokadę stanu i jawne odblokowanie przyciskiem "Skanuj ponownie".
- **Wydajność listy historii** - przy bardzo dużej liczbie skanów lista mogłaby działać wolniej; ograniczono to wykorzystaniem `FlatList` z wirtualizacją oraz sortowaniem zapytaniem SQL po stronie bazy.
- **Migracje SQLite** - w przypadku zmian schematu tabeli w przyszłych wersjach aplikacji konieczne byłoby wprowadzenie mechanizmu wersjonowania (`PRAGMA user_version`); w obecnej wersji schemat jest minimalny i tworzony idempotentnie (`CREATE TABLE IF NOT EXISTS`).
- **Brak walidacji treści kodu** - aplikacja prezentuje surową zawartość odczytanego kodu. Nie jest sprawdzane, czy treść (np. URL) jest bezpieczna - interpretacja zawartości pozostaje po stronie użytkownika.

## Uruchomienie

```bash
pnpm install
pnpm start
```

Następnie należy zeskanować kod QR z terminala aplikacją **Expo Go** na urządzeniu fizycznym (Android/iOS) lub uruchomić emulator komendą `pnpm android` / `pnpm ios`.
