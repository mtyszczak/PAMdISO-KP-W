// Zadanie 8 - System ocen studentów
// Działa: reduce do średniej, funkcja zwracająca obiekt z wynikiem, status zaliczenia
// Rozszerzenie: klasyfikacja (bardzo dobry / dobry / dostateczny / niedostateczny)
// Trudność: logika wielopoziomowej klasyfikacji

const oceny = [3.0, 4.0, 5.0, 3.5, 4.5];

const progZaliczenia = 3.0;

function ocenStudenta(listaOcen) {
  const suma = listaOcen.reduce((acc, val) => acc + val, 0);
  const srednia = suma / listaOcen.length;
  const zaliczone = srednia >= progZaliczenia;

  // Rozszerzenie: klasyfikacja
  let klasyfikacja;
  if (srednia >= 4.5) {
    klasyfikacja = "bardzo dobry";
  } else if (srednia >= 3.5) {
    klasyfikacja = "dobry";
  } else if (srednia >= 3.0) {
    klasyfikacja = "dostateczny";
  } else {
    klasyfikacja = "niedostateczny";
  }

  return {
    oceny: listaOcen,
    srednia: parseFloat(srednia.toFixed(2)),
    status: zaliczone ? "zaliczone" : "niezaliczone",
    klasyfikacja
  };
}

// Test 1
const wynik1 = ocenStudenta(oceny);
console.log("=== Student 1 ===");
console.log(`Oceny: ${wynik1.oceny.join(", ")}`);
console.log(`Średnia: ${wynik1.srednia}`);
console.log(`Status: ${wynik1.status}`);
console.log(`Klasyfikacja: ${wynik1.klasyfikacja}`);

// Test 2 - słabsze oceny
const wynik2 = ocenStudenta([2.0, 2.5, 3.0, 2.0]);
console.log("\n=== Student 2 ===");
console.log(`Oceny: ${wynik2.oceny.join(", ")}`);
console.log(`Średnia: ${wynik2.srednia}`);
console.log(`Status: ${wynik2.status}`);
console.log(`Klasyfikacja: ${wynik2.klasyfikacja}`);
