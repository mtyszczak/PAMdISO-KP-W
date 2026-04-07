// Zadanie 10 - Dziennik aktywności sportowej
// Działa: filter, reduce, template literals, raport z 3+ wartościami
// Rozszerzenie: najbardziej kaloryczny trening + średnie kalorie na minutę
// Trudność: łączenie wielu obliczeń w spójny raport

const aktywnosci = [
  { type: "bieg", minutes: 35, calories: 320, day: "poniedziałek" },
  { type: "rower", minutes: 50, calories: 410, day: "wtorek" },
  { type: "spacer", minutes: 20, calories: 90, day: "środa" },
  { type: "siłownia", minutes: 60, calories: 450, day: "piątek" }
];

// Łączny czas
const lacznyczas = aktywnosci.reduce((acc, a) => acc + a.minutes, 0);

// Łączne kalorie
const laczneKalorie = aktywnosci.reduce((acc, a) => acc + a.calories, 0);

// Aktywności dłuższe niż 30 min
const dluzsze = aktywnosci.filter((a) => a.minutes > 30);

// Rozszerzenie: najbardziej kaloryczny trening
const topKalorie = aktywnosci.reduce((best, curr) =>
  curr.calories > best.calories ? curr : best
);

// Rozszerzenie: średnie kalorie na minutę
const kalNaMin = (laczneKalorie / lacznyczas).toFixed(1);

// Raport
console.log(`=== Raport aktywności sportowej ===`);
console.log(`Liczba aktywności: ${aktywnosci.length}`);
console.log(`Łączny czas: ${lacznyczas} min`);
console.log(`Łączne spalone kalorie: ${laczneKalorie} kcal`);
console.log(`Średnio kalorii na minutę: ${kalNaMin} kcal/min`);

console.log(`\nAktywności dłuższe niż 30 min:`);
dluzsze.forEach((a) =>
  console.log(`  - ${a.type} (${a.minutes} min, ${a.calories} kcal) - ${a.day}`)
);

console.log(`\nNajbardziej kaloryczny trening: ${topKalorie.type} (${topKalorie.calories} kcal)`);
