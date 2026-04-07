// Zadanie 3 - Lista zakupów z priorytetami
// Działa: tablica obiektów, filter pilnych, map nazw uppercase
// Rozszerzenie: dodano pole "category" + filtrowanie po kategorii
// Trudność: łączenie kilku operacji bez mutowania oryginału

const listaZakupow = [
  { name: "chleb", quantity: 2, urgent: true, category: "spożywcze" },
  { name: "mleko", quantity: 1, urgent: false, category: "spożywcze" },
  { name: "jajka", quantity: 10, urgent: true, category: "spożywcze" },
  { name: "makaron", quantity: 3, urgent: false, category: "spożywcze" },
  { name: "szampon", quantity: 1, urgent: true, category: "chemia" }
];

// Wyświetl wszystkie produkty
console.log("=== Wszystkie produkty ===");
listaZakupow.forEach((prod) => {
  console.log(`- ${prod.name} (x${prod.quantity}) ${prod.urgent ? "[PILNE]" : ""}`);
});

// Filtruj pilne
const pilneItems = listaZakupow.filter((prod) => prod.urgent);
console.log(`\nPilnych pozycji: ${pilneItems.length}`);
pilneItems.forEach((p) => console.log(`  ! ${p.name}`));

// Nazwy uppercase
const nazwyUppercase = listaZakupow.map((prod) => prod.name.toUpperCase());
console.log(`\nNazwy po transformacji: ${nazwyUppercase.join(", ")}`);

// Rozszerzenie: filtrowanie po kategorii
function filtrujKategorie(lista, kat) {
  return lista.filter((prod) => prod.category === kat);
}

const chemia = filtrujKategorie(listaZakupow, "chemia");
console.log(`\nProdukty z kategorii "chemia":`);
chemia.forEach((p) => console.log(`  - ${p.name} (x${p.quantity})`));

// Oryginalna tablica nienaruszona
console.log(`\nOryginalna tablica ma nadal ${listaZakupow.length} elementów.`);
