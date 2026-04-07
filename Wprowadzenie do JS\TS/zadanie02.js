// Zadanie 2 - Kalkulator budżetu tygodniowego
// Działa: suma, średnia, max z tablicy wydatków
// Rozszerzenie: dodano minimum + ile zostało z budżetu tygodniowego
// Trudność: zaokrąglanie wyników do 2 miejsc po przecinku

const wydatki = [18.5, 42, 9.99, 27, 61.3, 15, 33.5];

const sumaWydatkow = wydatki.reduce((acc, val) => acc + val, 0);
const sredniaWydatek = sumaWydatkow / wydatki.length;
const maxWydatek = Math.max(...wydatki);
const minWydatek = Math.min(...wydatki);

// Rozszerzenie: budżet tygodniowy i reszta
const budzet = 2_500;
const pozostalo = budzet - sumaWydatkow;

function formatPLN(kwota) {
  return kwota.toFixed(2) + " zł";
}

console.log("=== Raport budżetu tygodniowego ===");
console.log(`Liczba wydatków: ${wydatki.length}`);
console.log(`Suma: ${formatPLN(sumaWydatkow)}`);
console.log(`Średnia: ${formatPLN(sredniaWydatek)}`);
console.log(`Największy wydatek: ${formatPLN(maxWydatek)}`);
console.log(`Najmniejszy wydatek: ${formatPLN(minWydatek)}`);
console.log(`Budżet: ${formatPLN(budzet)}`);
console.log(`Pozostało: ${formatPLN(pozostalo)}`);
console.log(pozostalo >= 0 ? "Mieścisz się w budżecie." : "Przekroczono budżet!");
