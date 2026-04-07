// Zadanie 12 - Wyszukiwarka kontaktów
// Działa: filter po mieście, filter ulubionych, map formatowanie, 2+ wywołania
// Rozszerzenie: wyszukiwanie po fragmencie nazwy kontaktu
// Trudność: łączenie wielu funkcji filtrujących i formatujących

const kontakty = [
  { name: "Anna Nowak", phone: "500-100-200", city: "Katowice", favorite: true },
  { name: "Piotr Lis", phone: "501-300-700", city: "Sosnowiec", favorite: false },
  { name: "Ola Marek", phone: "502-400-900", city: "Katowice", favorite: true },
  { name: "Jan Kozłowski", phone: "503-500-100", city: "Gliwice", favorite: false },
  { name: "Anna Wiśniewska", phone: "504-600-200", city: "Sosnowiec", favorite: true }
];

// Funkcja: kontakty z wybranego miasta
function kontaktyZMiasta(lista, miasto) {
  return lista.filter((k) => k.city === miasto);
}

// Funkcja: tylko ulubione
function ulubioneKontakty(lista) {
  return lista.filter((k) => k.favorite);
}

// Funkcja formatująca
function formatujKontakty(lista) {
  return lista.map((k) => `${k.name} — ${k.phone}`);
}

// Rozszerzenie: wyszukiwanie po fragmencie nazwy
function szukajPoNazwie(lista, fraza) {
  const frazaLower = fraza.toLowerCase();
  return lista.filter((k) => k.name.toLowerCase().includes(frazaLower));
}

// Wywołanie 1: kontakty z Katowic
console.log("=== Kontakty z Katowic ===");
const katowice = kontaktyZMiasta(kontakty, "Katowice");
formatujKontakty(katowice).forEach((k) => console.log(`  ${k}`));

// Wywołanie 2: kontakty z Sosnowca
console.log("\n=== Kontakty z Sosnowca ===");
const sosnowiec = kontaktyZMiasta(kontakty, "Sosnowiec");
formatujKontakty(sosnowiec).forEach((k) => console.log(`  ${k}`));

// Wywołanie 3: ulubione
console.log("\n=== Ulubione kontakty ===");
const fav = ulubioneKontakty(kontakty);
formatujKontakty(fav).forEach((k) => console.log(`  ${k}`));

// Wywołanie 4: szukaj po fragmencie
console.log('\n=== Szukaj: "anna" ===');
const wyniki = szukajPoNazwie(kontakty, "anna");
formatujKontakty(wyniki).forEach((k) => console.log(`  ${k}`));
