// Zadanie 11 - Podział kosztów wyjazdu
// Działa: reduce agregacja, suma per osoba, identyfikacja max płatnika
// Rozszerzenie: równy podział kosztów - kto ile powinien oddać/otrzymać
// Trudność: logika rozliczeń i agregacja do obiektu

const kosztyWyjazdu = [
  { label: "nocleg", amount: 420, paidBy: "Anna" },
  { label: "paliwo", amount: 260, paidBy: "Piotr" },
  { label: "jedzenie", amount: 180, paidBy: "Anna" },
  { label: "bilety", amount: 140, paidBy: "Ola" },
  { label: "pamiątki", amount: 60, paidBy: "Piotr" }
];

// Całkowity koszt
const calkowityKoszt = kosztyWyjazdu.reduce((acc, k) => acc + k.amount, 0);

// Suma wydatków per osoba
const wydatkiPerOsoba = kosztyWyjazdu.reduce((acc, k) => {
  acc[k.paidBy] = (acc[k.paidBy] || 0) + k.amount;
  return acc;
}, {});

// Kto zapłacił najwięcej
const osoby = Object.entries(wydatkiPerOsoba);
const maxPlatnik = osoby.reduce((best, curr) =>
  curr[1] > best[1] ? curr : best
);

console.log("=== Raport kosztów wyjazdu ===");
console.log(`Całkowity koszt: ${calkowityKoszt} zł`);

console.log("\nWydatki per osoba:");
osoby.forEach(([imie, kwota]) =>
  console.log(`  ${imie}: ${kwota} zł`)
);

console.log(`\nNajwięcej zapłacił/a: ${maxPlatnik[0]} (${maxPlatnik[1]} zł)`);

// Rozszerzenie: równy podział
const liczbaOsob = osoby.length;
const rownyUdzial = calkowityKoszt / liczbaOsob;

console.log(`\nRówny udział na osobę: ${rownyUdzial.toFixed(2)} zł`);
console.log("Rozliczenie:");
osoby.forEach(([imie, kwota]) => {
  const roznica = kwota - rownyUdzial;
  if (roznica > 0) {
    console.log(`  ${imie}: powinien/na otrzymać ${roznica.toFixed(2)} zł`);
  } else if (roznica < 0) {
    console.log(`  ${imie}: powinien/na oddać ${Math.abs(roznica).toFixed(2)} zł`);
  } else {
    console.log(`  ${imie}: rozliczona`);
  }
});
