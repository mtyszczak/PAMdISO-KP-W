// Zadanie 6 - Katalog filmów do obejrzenia
// Działa: filter nieobejrzanych, filter ocena > 8.0, map tytułów
// Rozszerzenie: dodano pole "year" + filtrowanie po kategorii + sortowanie po ocenie
// Trudność: łączenie wielu filtrów bez mutowania oryginału

const filmy = [
  { title: "Arrival", category: "sci-fi", rating: 8.1, watched: true, year: 2016 },
  { title: "Whiplash", category: "drama", rating: 8.5, watched: false, year: 2014 },
  { title: "Dune", category: "sci-fi", rating: 8.0, watched: false, year: 2021 },
  { title: "Inside Out", category: "animation", rating: 8.1, watched: true, year: 2015 },
  { title: "Oppenheimer", category: "drama", rating: 8.4, watched: false, year: 2023 }
];

// Filmy nieobejrzane
const nieobejrzane = filmy.filter((f) => !f.watched);
console.log("=== Nieobejrzane filmy ===");
nieobejrzane.forEach((f) => console.log(`  - ${f.title} (${f.year})`));

// Filmy z oceną > 8.0
const wysokaOcena = filmy.filter((f) => f.rating > 8.0);
console.log("\n=== Filmy z oceną > 8.0 ===");
wysokaOcena.forEach((f) => console.log(`  - ${f.title}: ${f.rating}`));

// Tablica samych tytułów z nieobejrzanych
const tytuly = nieobejrzane.map((f) => f.title);
console.log(`\nTytuły do obejrzenia: ${tytuly.join(", ")}`);

// Rozszerzenie: filtrowanie po kategorii
function filmyWKategorii(lista, kat) {
  return lista.filter((f) => f.category === kat);
}

const sciFi = filmyWKategorii(filmy, "sci-fi");
console.log(`\nFilmy sci-fi: ${sciFi.map((f) => f.title).join(", ")}`);

// Rozszerzenie: top film po ocenie
const topFilm = [...filmy].sort((a, b) => b.rating - a.rating)[0];
console.log(`\nNajwyżej oceniony: ${topFilm.title} (${topFilm.rating})`);

console.log(`\nOryginalna tablica: ${filmy.length} filmów (nienaruszona).`);
