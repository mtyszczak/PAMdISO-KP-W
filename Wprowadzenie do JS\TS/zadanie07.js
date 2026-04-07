// Zadanie 7 - Rejestr napraw w serwisie
// Działa: find, map + spread do niemutowalnej aktualizacji, zliczanie statusów
// Rozszerzenie: dodano pole "priority" + funkcja do dodawania nowego zgłoszenia
// Trudność: niemutowalna aktualizacja z zachowaniem oryginalnej tablicy

const naprawy = [
  { id: 1, client: "Anna", device: "laptop", status: "nowe", priority: "wysoki" },
  { id: 2, client: "Piotr", device: "telefon", status: "w trakcie", priority: "niski" },
  { id: 3, client: "Ola", device: "tablet", status: "zakończone", priority: "średni" }
];

// Znajdź zgłoszenie o id = 2
const znalezione = naprawy.find((n) => n.id === 2);
console.log("Znalezione zgłoszenie:", znalezione);

// Niemutowalna aktualizacja statusu id=1 na "w trakcie"
const zaktualizowane = naprawy.map((n) =>
  n.id === 1 ? { ...n, status: "w trakcie" } : n
);

// Policz zgłoszenia "w trakcie" w zaktualizowanej tablicy
const wTrakcieCount = zaktualizowane.filter((n) => n.status === "w trakcie").length;
console.log(`\nZgłoszenia "w trakcie": ${wTrakcieCount}`);

// Porównanie oryginalnej i zaktualizowanej
console.log("\n=== Oryginalna tablica ===");
naprawy.forEach((n) =>
  console.log(`  #${n.id} ${n.client} - ${n.device} [${n.status}]`)
);

console.log("\n=== Zaktualizowana tablica ===");
zaktualizowane.forEach((n) =>
  console.log(`  #${n.id} ${n.client} - ${n.device} [${n.status}]`)
);

// Rozszerzenie: funkcja dodająca nowe zgłoszenie (niemutowalnie)
function dodajZgloszenie(lista, client, device, priority = "średni") {
  const noweId = Math.max(...lista.map((n) => n.id)) + 1;
  const noweZgloszenie = { id: noweId, client, device, status: "nowe", priority };
  return [...lista, noweZgloszenie];
}

const rozszerzona = dodajZgloszenie(zaktualizowane, "Marek", "drukarka", "wysoki");
console.log("\n=== Po dodaniu nowego zgłoszenia ===");
rozszerzona.forEach((n) =>
  console.log(`  #${n.id} ${n.client} - ${n.device} [${n.status}] priorytet: ${n.priority}`)
);

console.log(`\nOryginał nadal ma ${naprawy.length} elementów.`);
