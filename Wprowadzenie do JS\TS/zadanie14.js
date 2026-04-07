// Zadanie 14 - Lista zadań "to do" z obsługą statusu
// Działa: dodawanie, zmiana statusu, filtrowanie - wszystko niemutowalnie
// Rozszerzenie: dodano pole "priority" + funkcja usuwania zadania
// Trudność: konsekwentne stosowanie podejścia niemutowalnego

let zadania = [
  { id: 1, title: "Oddać projekt", done: false, priority: "wysoki" },
  { id: 2, title: "Przeczytać rozdział", done: true, priority: "średni" },
  { id: 3, title: "Przygotować prezentację", done: false, priority: "wysoki" }
];

// Dodaj nowe zadanie (niemutowalnie)
function dodajZadanie(lista, tytul, priorytet = "średni") {
  const noweId = lista.length > 0 ? Math.max(...lista.map((z) => z.id)) + 1 : 1;
  return [...lista, { id: noweId, title: tytul, done: false, priority: priorytet }];
}

// Oznacz jako wykonane (niemutowalnie z map + spread)
function oznaczWykonane(lista, szukaneId) {
  return lista.map((z) =>
    z.id === szukaneId ? { ...z, done: true } : z
  );
}

// Zwróć niewykonane (filter)
function niewykonane(lista) {
  return lista.filter((z) => !z.done);
}

// Rozszerzenie: usuń zadanie (niemutowalnie)
function usunZadanie(lista, szukaneId) {
  return lista.filter((z) => z.id !== szukaneId);
}

// Wyświetlanie
function wyswietl(label, lista) {
  console.log(`\n=== ${label} ===`);
  lista.forEach((z) =>
    console.log(`  [${z.done ? "x" : " "}] #${z.id} ${z.title} (${z.priority})`)
  );
}

// Demonstracja
wyswietl("Stan początkowy", zadania);

zadania = dodajZadanie(zadania, "Kupić kawę", "niski");
wyswietl("Po dodaniu zadania", zadania);

zadania = oznaczWykonane(zadania, 1);
wyswietl("Po oznaczeniu #1 jako wykonane", zadania);

const doZrobienia = niewykonane(zadania);
wyswietl("Tylko niewykonane", doZrobienia);

zadania = usunZadanie(zadania, 2);
wyswietl("Po usunięciu #2", zadania);
