// Zadanie 4 - Decyzja: co zabrać na uczelnię
// Działa: if/else, operator ?:, &&, komunikaty warunkowe
// Rozszerzenie: dodano zmienną hasWater + funkcja sprawdzGotowość
// Trudność: łączenie różnych konstrukcji warunkowych w spójny raport

const maLaptopa = true;
const maLadowarke = false;
const maZeszyt = true;
const typDnia = "laboratorium";
const maWode = true;

// if...else: sprawdzenie gotowości
if (maLaptopa && maZeszyt) {
  console.log("Masz podstawowe rzeczy - jesteś w miarę gotowy.");
} else {
  console.log("Brakuje Ci podstawowych rzeczy na zajęcia!");
}

// Operator trójargumentowy
const statusGotowosci = (maLaptopa && maLadowarke && maZeszyt)
  ? "W pełni gotowy"
  : "Niegotowy - czegoś brakuje";
console.log(`Status: ${statusGotowosci}`);

// Operator && do warunkowego ostrzeżenia
!maLadowarke && console.log("Uwaga: nie masz ładowarki! Bateria może nie wystarczyć.");
maWode && console.log("Dobrze, masz wodę - pamiętaj o nawodnieniu.");

// Komunikat zależny od typu dnia
if (typDnia === "laboratorium") {
  console.log("Dzisiaj laboratorium - upewnij się, że masz laptopa i środowisko dev.");
} else if (typDnia === "wykład") {
  console.log("Dzisiaj wykład - zeszyt i długopis wystarczą.");
} else {
  console.log(`Typ dnia: ${typDnia} - przygotuj się standardowo.`);
}

// Rozszerzenie: funkcja pomocnicza
function sprawdzGotowosc(laptop, ladowarka, zeszyt, woda) {
  const brakujace = [];
  if (!laptop) brakujace.push("laptop");
  if (!ladowarka) brakujace.push("ładowarka");
  if (!zeszyt) brakujace.push("zeszyt");
  if (!woda) brakujace.push("woda");

  return brakujace.length === 0
    ? "Wszystko masz, powodzenia!"
    : `Brakuje: ${brakujace.join(", ")}`;
}

console.log(sprawdzGotowosc(maLaptopa, maLadowarke, maZeszyt, maWode));
