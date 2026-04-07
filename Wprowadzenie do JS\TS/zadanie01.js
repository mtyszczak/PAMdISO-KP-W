// Zadanie 1 - Wizytówka użytkownika
// Działa: obiekt użytkownika z 6 polami, 4 komunikaty console.log, template literals
// Rozszerzenie: dodano pole likezLang + funkcja pomocnicza generująca wizytówkę
// Trudność: wybór sensownego formatu wizytówki

const profil = {
  firstName: "Jan",
  lastName: "Kowalski",
  city: "Katowice",
  age: 21,
  fieldOfStudy: "informatyka",
  likezLang: "JavaScript"
};

// Pełne imię i nazwisko
console.log(`${profil.firstName} ${profil.lastName}`);

// Komunikat opisowy z template literal
console.log(`Mieszka w ${profil.city}, studiuje ${profil.fieldOfStudy}.`);

// Komunikat zależny od wieku
const ageMsg = profil.age >= 18
  ? `${profil.firstName} jest pełnoletni (${profil.age} lat).`
  : `${profil.firstName} nie jest jeszcze pełnoletni.`;
console.log(ageMsg);

// Rozszerzenie: funkcja pomocnicza generująca wizytówkę
function buildCard(osoba) {
  const separator = "=".repeat(30);
  return `${separator}
  ${osoba.firstName} ${osoba.lastName}
  Miasto: ${osoba.city}
  Kierunek: ${osoba.fieldOfStudy}
  Ulubiony język: ${osoba.likezLang}
  Wiek: ${osoba.age}
${separator}`;
}

console.log(buildCard(profil));
