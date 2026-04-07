import React, { useState, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

// ── Dane wydarzen ──────────────────────────────────────────────────
const KATALOG_WYDARZEN = [
  {
    id: 'evt_a1',
    tytul: 'Hackathon Politechniki',
    data: '2026-04-18',
    kategoria: 'Nauka',
    miejsce: 'Aula Glowna, Budynek A',
    ulubione: false,
    plakietka: 'Nowe',
  },
  {
    id: 'evt_b2',
    tytul: 'Turniej Pilki Siatkowej',
    data: '2026-04-22',
    kategoria: 'Sport',
    miejsce: 'Hala Sportowa AWF',
    ulubione: false,
    plakietka: 'Popularne',
  },
  {
    id: 'evt_c3',
    tytul: 'Koncert Jazzowy',
    data: '2026-05-03',
    kategoria: 'Muzyka',
    miejsce: 'Filharmonia Miejska',
    ulubione: true,
    plakietka: null,
  },
  {
    id: 'evt_d4',
    tytul: 'Maraton Filmowy Sci-Fi',
    data: '2026-05-10',
    kategoria: 'Film',
    miejsce: 'Kino Studyjne Muza',
    ulubione: false,
    plakietka: 'Nowe',
  },
  {
    id: 'evt_e5',
    tytul: 'Wyklad o Sztucznej Inteligencji',
    data: '2026-04-25',
    kategoria: 'Nauka',
    miejsce: 'Sala 204, Wydzial Informatyki',
    ulubione: false,
    plakietka: 'Popularne',
  },
  {
    id: 'evt_f6',
    tytul: 'Bieg Nocny 10km',
    data: '2026-05-15',
    kategoria: 'Sport',
    miejsce: 'Park Miejski im. Pilsudskiego',
    ulubione: false,
    plakietka: null,
  },
  {
    id: 'evt_g7',
    tytul: 'Festiwal Muzyki Elektronicznej',
    data: '2026-06-01',
    kategoria: 'Muzyka',
    miejsce: 'Hangar 646',
    ulubione: true,
    plakietka: 'Popularne',
  },
  {
    id: 'evt_h8',
    tytul: 'Premiera Dokumentu "Kod Przyszlosci"',
    data: '2026-05-20',
    kategoria: 'Film',
    miejsce: 'Centrum Kultury Zamek',
    ulubione: false,
    plakietka: 'Nowe',
  },
  {
    id: 'evt_i9',
    tytul: 'Warsztaty Robotyki',
    data: '2026-04-30',
    kategoria: 'Nauka',
    miejsce: 'Laboratorium Mechatroniki',
    ulubione: false,
    plakietka: null,
  },
  {
    id: 'evt_j10',
    tytul: 'Pokaz Filmu Niezaleznego',
    data: '2026-06-05',
    kategoria: 'Film',
    miejsce: 'Galeria Sztuki Nowoczesnej',
    ulubione: false,
    plakietka: null,
  },
];

const LISTA_KATEGORII = ['Wszystkie', 'Nauka', 'Sport', 'Muzyka', 'Film'];

// ── Palety kolorow ─────────────────────────────────────────────────
const PALETA_JASNA = {
  tlo: '#F4F1EC',
  tloPowierzchni: '#FFFFFF',
  tloKarty: '#FFFFFF',
  tekstGlowny: '#1C1917',
  tekstDrugorzedny: '#57534E',
  akcent: '#6D28D9',
  akcentJasny: '#EDE9FE',
  akcentTekst: '#FFFFFF',
  obramowanie: '#D6D3D1',
  tloWejscia: '#FAFAF9',
  ulubioneTak: '#DC2626',
  ulubioneNie: '#A8A29E',
  plakietkaNowe: '#059669',
  plakietkaPopularne: '#D97706',
  cienKarty: '#00000018',
  tloNaglowka: '#6D28D9',
  tekstNaglowka: '#FFFFFF',
};

const PALETA_CIEMNA = {
  tlo: '#18181B',
  tloPowierzchni: '#27272A',
  tloKarty: '#27272A',
  tekstGlowny: '#FAFAF9',
  tekstDrugorzedny: '#A1A1AA',
  akcent: '#A78BFA',
  akcentJasny: '#2E1065',
  akcentTekst: '#FFFFFF',
  obramowanie: '#3F3F46',
  tloWejscia: '#1F1F23',
  ulubioneTak: '#EF4444',
  ulubioneNie: '#71717A',
  plakietkaNowe: '#34D399',
  plakietkaPopularne: '#FBBF24',
  cienKarty: '#00000040',
  tloNaglowka: '#2E1065',
  tekstNaglowka: '#F5F3FF',
};

const IKONY_KATEGORII = {
  Wszystkie: '\u2605',
  Nauka: '\uD83D\uDD2C',
  Sport: '\u26BD',
  Muzyka: '\uD83C\uDFB5',
  Film: '\uD83C\uDFAC',
};

// ── Komponent KartaWydarzenia ──────────────────────────────────────
function KartaWydarzenia({ tytul, data, kategoria, miejsce, ulubione, plakietka, onToggleUlubione, kolory }) {
  return (
    <View style={[styles.karta, { backgroundColor: kolory.tloKarty, borderColor: kolory.obramowanie }]}>
      <View style={styles.naglowekKarty}>
        <View style={styles.kategoriaIOznaczenie}>
          <Text style={[styles.kategoriaEtykieta, { color: kolory.akcent }]}>
            {IKONY_KATEGORII[kategoria] || ''} {kategoria}
          </Text>
          {plakietka && (
            <View
              style={[
                styles.plakietka,
                {
                  backgroundColor:
                    plakietka === 'Nowe'
                      ? kolory.plakietkaNowe
                      : kolory.plakietkaPopularne,
                },
              ]}
            >
              <Text style={styles.plakietkaTekst}>{plakietka}</Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={onToggleUlubione}
          style={({ pressed }) => [
            styles.przyciskUlubione,
            { backgroundColor: kolory.tlo },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text
            style={[
              styles.ikonaUlubione,
              { color: ulubione ? kolory.ulubioneTak : kolory.ulubioneNie },
            ]}
          >
            {ulubione ? '\u2764' : '\u2661'}
          </Text>
          <Text
            style={[
              styles.etykietaUlubione,
              { color: ulubione ? kolory.ulubioneTak : kolory.ulubioneNie },
            ]}
          >
            Ulubione
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.tytulKarty, { color: kolory.tekstGlowny }]}>{tytul}</Text>

      <View style={styles.szczegolyKarty}>
        <Text style={[styles.dataKarty, { color: kolory.tekstDrugorzedny }]}>{'\uD83D\uDCC5'} {data}</Text>
        <Text style={[styles.miejsceKarty, { color: kolory.tekstDrugorzedny }]}>{'\uD83D\uDCCD'} {miejsce}</Text>
      </View>
    </View>
  );
}

// ── Glowna aplikacja ───────────────────────────────────────────────
export default function App() {
  const [frazaWyszukiwania, ustawFrazeWyszukiwania] = useState('');
  const [wybranaKategoria, ustawWybranaKategorie] = useState('Wszystkie');
  const [wydarzenia, ustawWydarzenia] = useState(KATALOG_WYDARZEN);
  const [trybUlubionych, ustawTrybUlubionych] = useState(false);
  const [ciemnyMotyw, ustawCiemnyMotyw] = useState(false);

  const kolory = ciemnyMotyw ? PALETA_CIEMNA : PALETA_JASNA;

  const filtrowaneLista = useMemo(() => {
    let wynik = wydarzenia;

    if (wybranaKategoria !== 'Wszystkie') {
      wynik = wynik.filter((w) => w.kategoria === wybranaKategoria);
    }

    if (frazaWyszukiwania.trim().length > 0) {
      const fraza = frazaWyszukiwania.toLowerCase().trim();
      wynik = wynik.filter((w) => w.tytul.toLowerCase().includes(fraza));
    }

    if (trybUlubionych) {
      wynik = wynik.filter((w) => w.ulubione);
    }

    return wynik;
  }, [wydarzenia, wybranaKategoria, frazaWyszukiwania, trybUlubionych]);

  const przelaczUlubione = useCallback((identyfikator) => {
    ustawWydarzenia((prev) =>
      prev.map((w) =>
        w.id === identyfikator ? { ...w, ulubione: !w.ulubione } : w
      )
    );
  }, []);

  const renderujKarte = useCallback(
    ({ item }) => (
      <KartaWydarzenia
        tytul={item.tytul}
        data={item.data}
        kategoria={item.kategoria}
        miejsce={item.miejsce}
        ulubione={item.ulubione}
        plakietka={item.plakietka}
        onToggleUlubione={() => przelaczUlubione(item.id)}
        kolory={kolory}
      />
    ),
    [kolory, przelaczUlubione]
  );

  const wyodrebnijKlucz = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={[styles.kontener, { backgroundColor: kolory.tlo }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={kolory.tloNaglowka}
      />

      {/* Naglowek */}
      <View style={[styles.naglowek, { backgroundColor: kolory.tloNaglowka }]}>
        <View style={styles.naglowekGornyWiersz}>
          <View style={styles.naglowekTeksty}>
            <Text style={[styles.naglowekTytul, { color: kolory.tekstNaglowka }]}>
              Katalog Wydarzen
            </Text>
            <Text style={[styles.naglowekOpis, { color: kolory.tekstNaglowka }]}>
              Przegladaj i zapisuj interesujace Cie wydarzenia
            </Text>
          </View>
          <Pressable
            onPress={() => ustawCiemnyMotyw((prev) => !prev)}
            style={({ pressed }) => [
              styles.przyciskMotywu,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={styles.ikonaMotywu}>
              {ciemnyMotyw ? '\u2600\uFE0F' : '\uD83C\uDF19'}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.licznikWynikow, { color: kolory.tekstNaglowka }]}>
          Wyniki: {filtrowaneLista.length}{' '}
          {filtrowaneLista.length === 1
            ? 'wydarzenie'
            : filtrowaneLista.length < 5
            ? 'wydarzenia'
            : 'wydarzen'}
        </Text>
      </View>

      {/* Pole wyszukiwania */}
      <View style={styles.sekcjaWyszukiwania}>
        <TextInput
          style={[styles.poleWyszukiwania, {
            backgroundColor: kolory.tloWejscia,
            color: kolory.tekstGlowny,
            borderColor: kolory.obramowanie,
          }]}
          placeholder="Szukaj wydarzen po nazwie..."
          placeholderTextColor={kolory.tekstDrugorzedny}
          value={frazaWyszukiwania}
          onChangeText={ustawFrazeWyszukiwania}
        />
      </View>

      {/* Pasek kategorii */}
      <View style={styles.pasekKategorii}>
        {LISTA_KATEGORII.map((kat) => {
          const czyAktywna = wybranaKategoria === kat;
          return (
            <Pressable
              key={kat}
              onPress={() => ustawWybranaKategorie(kat)}
              style={({ pressed }) => [
                styles.przyciskKategorii,
                { backgroundColor: kolory.tloPowierzchni, borderColor: kolory.obramowanie },
                czyAktywna && { backgroundColor: kolory.akcent, borderColor: kolory.akcent },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text
                style={[
                  styles.tekstKategorii,
                  { color: kolory.tekstDrugorzedny },
                  czyAktywna && { color: kolory.akcentTekst },
                ]}
              >
                {IKONY_KATEGORII[kat]} {kat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Przycisk Tylko Ulubione */}
      <Pressable
        onPress={() => ustawTrybUlubionych((prev) => !prev)}
        style={({ pressed }) => [
          styles.przyciskTrybUlubionych,
          { borderColor: kolory.obramowanie, backgroundColor: kolory.tloPowierzchni },
          trybUlubionych && { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text
          style={[
            styles.tekstTrybUlubionych,
            { color: kolory.tekstDrugorzedny },
            trybUlubionych && { color: '#DC2626' },
          ]}
        >
          {trybUlubionych ? '\u2764' : '\u2661'} Tylko ulubione
        </Text>
      </Pressable>

      {/* Lista wydarzen */}
      <FlatList
        data={filtrowaneLista}
        renderItem={renderujKarte}
        keyExtractor={wyodrebnijKlucz}
        contentContainerStyle={styles.kontenerListy}
        ListEmptyComponent={
          <View style={styles.pustaLista}>
            <Text style={styles.pustaListaIkona}>{'\uD83D\uDD0D'}</Text>
            <Text style={[styles.pustaListaTekst, { color: kolory.tekstDrugorzedny }]}>
              Brak wydarzen spelniajacych kryteria
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ── Style ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  kontener: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  naglowek: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  naglowekGornyWiersz: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  naglowekTeksty: {
    flex: 1,
  },
  naglowekTytul: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  naglowekOpis: {
    fontSize: 13,
    opacity: 0.85,
    marginTop: 3,
  },
  przyciskMotywu: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  ikonaMotywu: {
    fontSize: 22,
  },
  licznikWynikow: {
    fontSize: 13,
    opacity: 0.9,
    marginTop: 10,
    fontWeight: '600',
  },
  sekcjaWyszukiwania: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  poleWyszukiwania: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  pasekKategorii: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    flexWrap: 'wrap',
  },
  przyciskKategorii: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tekstKategorii: {
    fontSize: 13,
    fontWeight: '600',
  },
  przyciskTrybUlubionych: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  tekstTrybUlubionych: {
    fontSize: 14,
    fontWeight: '600',
  },
  kontenerListy: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },
  pustaLista: {
    alignItems: 'center',
    marginTop: 48,
  },
  pustaListaIkona: {
    fontSize: 48,
    marginBottom: 12,
  },
  pustaListaTekst: {
    fontSize: 15,
    textAlign: 'center',
  },
  // Style karty
  karta: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  naglowekKarty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kategoriaIOznaczenie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kategoriaEtykieta: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  plakietka: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  plakietkaTekst: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  przyciskUlubione: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  ikonaUlubione: {
    fontSize: 16,
    marginRight: 4,
  },
  etykietaUlubione: {
    fontSize: 12,
    fontWeight: '600',
  },
  tytulKarty: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  szczegolyKarty: {
    gap: 4,
  },
  dataKarty: {
    fontSize: 13,
  },
  miejsceKarty: {
    fontSize: 13,
  },
});
