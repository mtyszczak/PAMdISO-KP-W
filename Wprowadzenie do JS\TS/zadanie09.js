// Zadanie 9 - Prosty koszyk sklepu
// Działa: map opisy, reduce suma, rabat warunkowy
// Rozszerzenie: dodano pole "category" + funkcja formatująca raport
// Trudność: poprawne obliczenie rabatu i czytelne formatowanie

const koszyk = [
  { name: "Chleb", price: 4.5, quantity: 2, category: "spożywcze" },
  { name: "Ser", price: 9.9, quantity: 1, category: "nabiał" },
  { name: "Sok", price: 6.2, quantity: 3, category: "napoje" }
];

const progRabatu = 30;
const procentRabatu = 10;

// Opisy pozycji
const opisyPozycji = koszyk.map(
  (item) => `${item.quantity} × ${item.name} = ${(item.price * item.quantity).toFixed(2)} zł`
);

console.log("=== Pozycje w koszyku ===");
opisyPozycji.forEach((opis) => console.log(`  ${opis}`));

// Suma koszyka
const sumaKoszyka = koszyk.reduce(
  (acc, item) => acc + item.price * item.quantity,
  0
);

// Rabat
const czyRabat = sumaKoszyka > progRabatu;
const kwotaRabatu = czyRabat ? sumaKoszyka * (procentRabatu / 100) : 0;
const sumaPoRabacie = sumaKoszyka - kwotaRabatu;

// Rozszerzenie: raport końcowy jako funkcja
function generujRaport(suma, rabat, poRabacie, czyMaRabat) {
  console.log("\n=== Podsumowanie koszyka ===");
  console.log(`Suma przed rabatem: ${suma.toFixed(2)} zł`);
  if (czyMaRabat) {
    console.log(`Rabat (${procentRabatu}%): -${rabat.toFixed(2)} zł`);
    console.log(`Do zapłaty: ${poRabacie.toFixed(2)} zł`);
  } else {
    console.log(`Brak rabatu (próg: ${progRabatu} zł)`);
    console.log(`Do zapłaty: ${suma.toFixed(2)} zł`);
  }
}

generujRaport(sumaKoszyka, kwotaRabatu, sumaPoRabacie, czyRabat);

// Rozszerzenie: podsumowanie per kategoria
const perKategoria = koszyk.reduce((acc, item) => {
  const wartosc = item.price * item.quantity;
  acc[item.category] = (acc[item.category] || 0) + wartosc;
  return acc;
}, {});

console.log("\n=== Wydatki per kategoria ===");
Object.entries(perKategoria).forEach(([kat, kwota]) =>
  console.log(`  ${kat}: ${kwota.toFixed(2)} zł`)
);
