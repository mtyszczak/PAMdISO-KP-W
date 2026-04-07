import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

// ── Palety kolorow ─────────────────────────────────────────────────
const PALETA_JASNA = {
  tlo: '#F0EDE8',
  tloPowierzchni: '#FFFFFF',
  tekstGlowny: '#1C1917',
  tekstDrugorzedny: '#57534E',
  akcent: '#5B7E5A',
  akcentJasny: '#E8F0E8',
  akcentTekst: '#FFFFFF',
  obramowanie: '#D6D3D1',
  tloWejscia: '#FAFAF9',
  blad: '#DC2626',
  bladTlo: '#FEF2F2',
  sukces: '#16A34A',
  sukcesTlo: '#F0FDF4',
  wyloguj: '#991B1B',
  wylogujTlo: '#FEF2F2',
  tloNaglowka: '#5B7E5A',
  tekstNaglowka: '#FFFFFF',
  awatar: '#5B7E5A',
};

const PALETA_CIEMNA = {
  tlo: '#1A1A2E',
  tloPowierzchni: '#25253E',
  tekstGlowny: '#FAFAF9',
  tekstDrugorzedny: '#A1A1AA',
  akcent: '#7EC8A0',
  akcentJasny: '#1A2E2A',
  akcentTekst: '#1A1A2E',
  obramowanie: '#3F3F56',
  tloWejscia: '#20203A',
  blad: '#EF4444',
  bladTlo: '#3B1111',
  sukces: '#4ADE80',
  sukcesTlo: '#113B1A',
  wyloguj: '#FCA5A5',
  wylogujTlo: '#3B1111',
  tloNaglowka: '#2A2A4A',
  tekstNaglowka: '#F5F3FF',
  awatar: '#7EC8A0',
};

const LIMIT_BIO = 200;

// ── Komponent WierszUstawien ───────────────────────────────────────
function WierszUstawien({ etykieta, ikona, wartoscPrzelacznika, onPrzelacz, kolory }) {
  const czyPrzelacznik = wartoscPrzelacznika !== undefined;

  return (
    <Pressable
      onPress={czyPrzelacznik ? onPrzelacz : undefined}
      style={({ pressed }) => [
        styles.wierszUstawien,
        { borderBottomColor: kolory.obramowanie },
        pressed && czyPrzelacznik && { opacity: 0.7 },
      ]}
    >
      <View style={styles.wierszUstawienLewo}>
        <Text style={styles.wierszIkona}>{ikona}</Text>
        <Text style={[styles.wierszEtykieta, { color: kolory.tekstGlowny }]}>
          {etykieta}
        </Text>
      </View>
      {czyPrzelacznik ? (
        <View
          style={[
            styles.przelacznik,
            { backgroundColor: wartoscPrzelacznika ? kolory.akcent : kolory.obramowanie },
          ]}
        >
          <View
            style={[
              styles.przelacznikKulka,
              wartoscPrzelacznika && styles.przelacznikKulkaAktywna,
            ]}
          />
        </View>
      ) : (
        <Text style={[styles.wierszStrzalka, { color: kolory.tekstDrugorzedny }]}>
          {'\u203A'}
        </Text>
      )}
    </Pressable>
  );
}

// ── Glowna aplikacja ───────────────────────────────────────────────
export default function App() {
  const [ciemnyMotyw, ustawCiemnyMotyw] = useState(false);
  const [powiadomienia, ustawPowiadomienia] = useState(true);
  const [prywatnosc, ustawPrywatnosc] = useState('Minimalna');

  const [imie, ustawImie] = useState('Jan');
  const [email, ustawEmail] = useState('jan.kowalski@email.pl');
  const [miasto, ustawMiasto] = useState('Wrocław');
  const [bio, ustawBio] = useState('Student informatyki, fan gier z lat 1800-1810.');
  const [haslo, ustawHaslo] = useState('');
  const [pokazHaslo, ustawPokazHaslo] = useState(false);

  const [zapisaneDane, ustawZapisaneDane] = useState({
    imie: 'Jan',
    email: 'jan.kowalski@email.pl',
    miasto: 'Wrocław',
    bio: 'Student informatyki, fan gier z lat 1800-1810.',
  });

  const [bledy, ustawBledy] = useState({});
  const [komunikatSukcesu, ustawKomunikatSukcesu] = useState('');
  const [zalogowany, ustawZalogowany] = useState(true);

  const kolory = ciemnyMotyw ? PALETA_CIEMNA : PALETA_JASNA;

  const waliduj = () => {
    const noweBledy = {};

    if (!imie.trim()) {
      noweBledy.imie = 'Imię nie może być puste';
    }
    if (!email.includes('@')) {
      noweBledy.email = 'Email musi zawierać znak @';
    }
    if (bio.length > LIMIT_BIO) {
      noweBledy.bio = 'Bio przekracza limit ' + LIMIT_BIO + ' znaków';
    }

    ustawBledy(noweBledy);
    return Object.keys(noweBledy).length === 0;
  };

  const zapiszZmiany = () => {
    ustawKomunikatSukcesu('');
    if (waliduj()) {
      ustawZapisaneDane({ imie, email, miasto, bio });
      ustawKomunikatSukcesu('Dane zostały zapisane pomyślnie!');
      setTimeout(() => ustawKomunikatSukcesu(''), 3000);
    }
  };

  const wyloguj = () => {
    ustawZalogowany(false);
  };

  if (!zalogowany) {
    return (
      <SafeAreaView style={[styles.kontener, { backgroundColor: kolory.tlo }]}>
        <View style={styles.ekranWylogowania}>
          <Text style={styles.ekranWylogowaniaIkona}>{'\uD83D\uDC4B'}</Text>
          <Text style={[styles.ekranWylogowaniaTekst, { color: kolory.tekstGlowny }]}>
            Zostałeś wylogowany
          </Text>
          <Pressable
            onPress={() => ustawZalogowany(true)}
            style={({ pressed }) => [
              styles.przyciskZaloguj,
              { backgroundColor: kolory.akcent },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.przyciskZalogujTekst, { color: kolory.akcentTekst }]}>
              Zaloguj ponownie
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const inicjaly = zapisaneDane.imie
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={[styles.kontener, { backgroundColor: kolory.tlo }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={kolory.tloNaglowka}
      />

      <ScrollView contentContainerStyle={styles.scrollZawartosc}>
        {/* Naglowek */}
        <View style={[styles.naglowek, { backgroundColor: kolory.tloNaglowka }]}>
          <Text style={[styles.naglowekTytul, { color: kolory.tekstNaglowka }]}>
            Panel Użytkownika
          </Text>
        </View>

        {/* Karta profilu */}
        <View style={[styles.sekcja, { backgroundColor: kolory.tloPowierzchni, borderColor: kolory.obramowanie }]}>
          <View style={styles.profilKontener}>
            <View style={[styles.awatar, { backgroundColor: kolory.awatar }]}>
              <Text style={styles.awatarTekst}>{inicjaly}</Text>
            </View>
            <View style={styles.profilInfo}>
              <Text style={[styles.profilImie, { color: kolory.tekstGlowny }]}>
                {zapisaneDane.imie}
              </Text>
              <Text style={[styles.profilMiasto, { color: kolory.tekstDrugorzedny }]}>
                {'\uD83D\uDCCD'} {zapisaneDane.miasto}
              </Text>
              <Text style={[styles.profilBio, { color: kolory.tekstDrugorzedny }]}>
                {zapisaneDane.bio}
              </Text>
            </View>
          </View>
        </View>

        {/* Formularz edycji */}
        <View style={[styles.sekcja, { backgroundColor: kolory.tloPowierzchni, borderColor: kolory.obramowanie }]}>
          <Text style={[styles.sekcjaTytul, { color: kolory.tekstGlowny }]}>
            Edycja danych
          </Text>

          {komunikatSukcesu ? (
            <View style={[styles.komunikat, { backgroundColor: kolory.sukcesTlo, borderColor: kolory.sukces }]}>
              <Text style={[styles.komunikatTekst, { color: kolory.sukces }]}>
                {'\u2705'} {komunikatSukcesu}
              </Text>
            </View>
          ) : null}

          {/* Imię */}
          <Text style={[styles.etykietaPola, { color: kolory.tekstDrugorzedny }]}>Imię</Text>
          <TextInput
            style={[
              styles.poleFormularza,
              { backgroundColor: kolory.tloWejscia, color: kolory.tekstGlowny, borderColor: bledy.imie ? kolory.blad : kolory.obramowanie },
            ]}
            value={imie}
            onChangeText={(t) => { ustawImie(t); ustawBledy((p) => ({ ...p, imie: undefined })); }}
            placeholder="Wpisz imie"
            placeholderTextColor={kolory.tekstDrugorzedny}
          />
          {bledy.imie ? (
            <Text style={[styles.bladTekst, { color: kolory.blad }]}>{bledy.imie}</Text>
          ) : null}

          {/* Email */}
          <Text style={[styles.etykietaPola, { color: kolory.tekstDrugorzedny }]}>E-mail</Text>
          <TextInput
            style={[
              styles.poleFormularza,
              { backgroundColor: kolory.tloWejscia, color: kolory.tekstGlowny, borderColor: bledy.email ? kolory.blad : kolory.obramowanie },
            ]}
            value={email}
            onChangeText={(t) => { ustawEmail(t); ustawBledy((p) => ({ ...p, email: undefined })); }}
            placeholder="Wpisz email"
            placeholderTextColor={kolory.tekstDrugorzedny}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {bledy.email ? (
            <Text style={[styles.bladTekst, { color: kolory.blad }]}>{bledy.email}</Text>
          ) : null}

          {/* Miasto */}
          <Text style={[styles.etykietaPola, { color: kolory.tekstDrugorzedny }]}>Miasto</Text>
          <TextInput
            style={[
              styles.poleFormularza,
              { backgroundColor: kolory.tloWejscia, color: kolory.tekstGlowny, borderColor: kolory.obramowanie },
            ]}
            value={miasto}
            onChangeText={ustawMiasto}
            placeholder="Wpisz miasto"
            placeholderTextColor={kolory.tekstDrugorzedny}
          />

          {/* Bio */}
          <View style={styles.bioNaglowek}>
            <Text style={[styles.etykietaPola, { color: kolory.tekstDrugorzedny }]}>Bio</Text>
            <Text
              style={[
                styles.licznikZnakow,
                { color: bio.length > LIMIT_BIO ? kolory.blad : kolory.tekstDrugorzedny },
              ]}
            >
              {bio.length}/{LIMIT_BIO}
            </Text>
          </View>
          <TextInput
            style={[
              styles.poleFormularza,
              styles.poleBio,
              { backgroundColor: kolory.tloWejscia, color: kolory.tekstGlowny, borderColor: bledy.bio ? kolory.blad : kolory.obramowanie },
            ]}
            value={bio}
            onChangeText={(t) => { ustawBio(t); ustawBledy((p) => ({ ...p, bio: undefined })); }}
            placeholder="Napisz cos o sobie"
            placeholderTextColor={kolory.tekstDrugorzedny}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {bledy.bio ? (
            <Text style={[styles.bladTekst, { color: kolory.blad }]}>{bledy.bio}</Text>
          ) : null}

          {/* Hasło */}
          <Text style={[styles.etykietaPola, { color: kolory.tekstDrugorzedny }]}>Hasło</Text>
          <View style={styles.hasloKontener}>
            <TextInput
              style={[
                styles.poleFormularza,
                styles.poleHaslo,
                { backgroundColor: kolory.tloWejscia, color: kolory.tekstGlowny, borderColor: kolory.obramowanie },
              ]}
              value={haslo}
              onChangeText={ustawHaslo}
              placeholder="Nowe haslo (opcjonalnie)"
              placeholderTextColor={kolory.tekstDrugorzedny}
              secureTextEntry={!pokazHaslo}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => ustawPokazHaslo((p) => !p)}
              style={({ pressed }) => [
                styles.przyciskPokazHaslo,
                { backgroundColor: kolory.obramowanie },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.przyciskPokazHasloTekst, { color: kolory.tekstGlowny }]}>
                {pokazHaslo ? 'Ukryj' : 'Pokaz'}
              </Text>
            </Pressable>
          </View>

          {/* Przycisk Zapisz */}
          <Pressable
            onPress={zapiszZmiany}
            style={({ pressed }) => [
              styles.przyciskZapisz,
              { backgroundColor: kolory.akcent },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.przyciskZapiszTekst, { color: kolory.akcentTekst }]}>
              Zapisz zmiany
            </Text>
          </Pressable>
        </View>

        {/* Ustawienia */}
        <View style={[styles.sekcja, { backgroundColor: kolory.tloPowierzchni, borderColor: kolory.obramowanie }]}>
          <Text style={[styles.sekcjaTytul, { color: kolory.tekstGlowny }]}>
            Ustawienia
          </Text>

          <WierszUstawien
            etykieta="Powiadomienia"
            ikona={'\uD83D\uDD14'}
            wartoscPrzelacznika={powiadomienia}
            onPrzelacz={() => ustawPowiadomienia((p) => !p)}
            kolory={kolory}
          />
          <View style={[styles.wierszUstawien, { borderBottomColor: kolory.obramowanie }]}>
            <View style={styles.wierszUstawienLewo}>
              <Text style={styles.wierszIkona}>{'\uD83D\uDD12'}</Text>
              <Text style={[styles.wierszEtykieta, { color: kolory.tekstGlowny }]}>Prywatność</Text>
            </View>
            <View style={styles.prywatKontener}>
              {['Minimalna', 'Zaawansowana'].map((opcja) => (
                <Pressable
                  key={opcja}
                  onPress={() => ustawPrywatnosc(opcja)}
                  style={[
                    styles.prywatOpcja,
                    { borderColor: kolory.obramowanie },
                    prywatnosc === opcja && { backgroundColor: kolory.akcent, borderColor: kolory.akcent },
                  ]}
                >
                  <Text style={[
                    styles.prywatOpcjaTekst,
                    { color: kolory.tekstDrugorzedny },
                    prywatnosc === opcja && { color: kolory.akcentTekst },
                  ]}>
                    {opcja}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <WierszUstawien
            etykieta="Ciemny motyw"
            ikona={ciemnyMotyw ? '\uD83C\uDF19' : '\u2600\uFE0F'}
            wartoscPrzelacznika={ciemnyMotyw}
            onPrzelacz={() => ustawCiemnyMotyw((p) => !p)}
            kolory={kolory}
          />
          <WierszUstawien
            etykieta="O aplikacji"
            ikona={'\u2139\uFE0F'}
            kolory={kolory}
          />
        </View>

        {/* Wyloguj */}
        <View style={[styles.sekcja, styles.sekcjaWyloguj, { backgroundColor: kolory.wylogujTlo, borderColor: kolory.blad }]}>
          <Pressable
            onPress={wyloguj}
            style={({ pressed }) => [
              styles.przyciskWyloguj,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.przyciskWylogujTekst, { color: kolory.wyloguj }]}>
              {'\uD83D\uDEAA'} Wyloguj się
            </Text>
          </Pressable>
        </View>

        <View style={styles.stopka} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Style ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  kontener: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollZawartosc: {
    paddingBottom: 40,
  },
  naglowek: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  naglowekTytul: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sekcja: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
  },
  sekcjaTytul: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  profilKontener: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  awatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  awatarTekst: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profilInfo: {
    flex: 1,
  },
  profilImie: {
    fontSize: 20,
    fontWeight: '700',
  },
  profilMiasto: {
    fontSize: 13,
    marginTop: 2,
  },
  profilBio: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  etykietaPola: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  poleFormularza: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    borderWidth: 1,
  },
  poleBio: {
    minHeight: 80,
    paddingTop: 11,
  },
  bioNaglowek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  licznikZnakow: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
  },
  bladTekst: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  komunikat: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 4,
  },
  komunikatTekst: {
    fontSize: 14,
    fontWeight: '600',
  },
  hasloKontener: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  poleHaslo: {
    flex: 1,
  },
  przyciskPokazHaslo: {
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  przyciskPokazHasloTekst: {
    fontSize: 13,
    fontWeight: '600',
  },
  przyciskZapisz: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  przyciskZapiszTekst: {
    fontSize: 16,
    fontWeight: '700',
  },
  wierszUstawien: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  wierszUstawienLewo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wierszIkona: {
    fontSize: 20,
  },
  wierszEtykieta: {
    fontSize: 15,
    fontWeight: '500',
  },
  wierszStrzalka: {
    fontSize: 24,
    fontWeight: '300',
  },
  przelacznik: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
    justifyContent: 'center',
  },
  przelacznikKulka: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  przelacznikKulkaAktywna: {
    alignSelf: 'flex-end',
  },
  prywatKontener: {
    flexDirection: 'row',
    gap: 6,
  },
  prywatOpcja: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  prywatOpcjaTekst: {
    fontSize: 12,
    fontWeight: '600',
  },
  sekcjaWyloguj: {
    alignItems: 'center',
  },
  przyciskWyloguj: {
    paddingVertical: 4,
  },
  przyciskWylogujTekst: {
    fontSize: 16,
    fontWeight: '700',
  },
  ekranWylogowania: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ekranWylogowaniaIkona: {
    fontSize: 64,
    marginBottom: 16,
  },
  ekranWylogowaniaTekst: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  przyciskZaloguj: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  przyciskZalogujTekst: {
    fontSize: 16,
    fontWeight: '700',
  },
  stopka: {
    height: 20,
  },
});
