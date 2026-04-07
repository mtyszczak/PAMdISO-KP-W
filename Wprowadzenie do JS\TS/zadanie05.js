// Zadanie 5 - Generator planu dnia
// Działa: funkcja z parametrami, parametr domyślny, return, 2+ wywołania
// Rozszerzenie: numerowanie zadań + info o liczbie zadań + priorytet
// Trudność: formatowanie numerowanej listy w stringu

const zadaniaDnia = ["zajęcia", "zakupy", "trening"];

function stworzPlanDnia(imie, listaZadan = ["odpoczynek"]) {
  const numerowane = listaZadan
    .map((zad, idx) => `  ${idx + 1}. ${zad}`)
    .join("\n");

  const iloscInfo = listaZadan.length === 1
    ? "1 zadanie"
    : `${listaZadan.length} zadań`;

  return `Plan dnia dla: ${imie} (${iloscInfo})\n${numerowane}`;
}

// Rozszerzenie: funkcja oznaczająca priorytetowe zadanie
function oznaczPriorytet(plan, priorytet) {
  return `${plan}\n  >> Priorytet: ${priorytet}`;
}

// Wywołanie 1
const planKacpra = stworzPlanDnia("Kacper", zadaniaDnia);
console.log(planKacpra);
console.log();

// Wywołanie 2
const planEwy = stworzPlanDnia("Ewa", ["wykład", "biblioteka", "kolacja"]);
console.log(planEwy);
console.log();

// Wywołanie 3 - domyślny parametr
const planDomyslny = stworzPlanDnia("Tomek");
console.log(planDomyslny);
console.log();

// Rozszerzenie - z priorytetem
const planZPriorytetem = oznaczPriorytet(
  stworzPlanDnia("Ania", ["projekt", "nauka", "bieganie"]),
  "projekt"
);
console.log(planZPriorytetem);
