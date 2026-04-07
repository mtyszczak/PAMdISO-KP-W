// Zadanie 15 - Prosty planer zajęć
// Działa: filter po dniu, map opisy, warunkowe oznaczenie trybu, liczba zajęć
// Rozszerzenie: dodano pole "instructor" + filtrowanie online/stacjonarne
// Trudność: łączenie wielu filtrów i formatowanie wyników

const planZajec = [
  { day: "poniedziałek", subject: "Programowanie", room: "A12", online: false, instructor: "dr Nowak" },
  { day: "wtorek", subject: "Bazy danych", room: "online", online: true, instructor: "dr Lis" },
  { day: "czwartek", subject: "Grafika", room: "B03", online: false, instructor: "dr Marek" },
  { day: "piątek", subject: "UX", room: "online", online: true, instructor: "mgr Kowal" },
  { day: "poniedziałek", subject: "Angielski", room: "C01", online: false, instructor: "mgr White" }
];

// Funkcja: zajęcia dla danego dnia
function zajeciaDnia(lista, dzien) {
  return lista.filter((z) => z.day === dzien);
}

// Funkcja: opisy zajęć z trybem
function opisZajec(lista) {
  return lista.map((z) => {
    const tryb = z.online ? "online" : "stacjonarne";
    return `${z.subject} — sala: ${z.room} — ${tryb} (${z.instructor})`;
  });
}

// Rozszerzenie: filtr po trybie
function zajeciaPoTrybie(lista, czyOnline) {
  return lista.filter((z) => z.online === czyOnline);
}

// Łączna liczba zajęć
console.log(`=== Plan tygodnia ===`);
console.log(`Łączna liczba zajęć: ${planZajec.length}`);

// Zajęcia w poniedziałek
const poniedzialek = zajeciaDnia(planZajec, "poniedziałek");
console.log(`\nZajęcia w poniedziałek (${poniedzialek.length}):`);
opisZajec(poniedzialek).forEach((opis) => console.log(`  - ${opis}`));

// Zajęcia w piątek
const piatek = zajeciaDnia(planZajec, "piątek");
console.log(`\nZajęcia w piątek (${piatek.length}):`);
opisZajec(piatek).forEach((opis) => console.log(`  - ${opis}`));

// Rozszerzenie: tylko online
const onlineZajecia = zajeciaPoTrybie(planZajec, true);
console.log(`\nZajęcia online (${onlineZajecia.length}):`);
opisZajec(onlineZajecia).forEach((opis) => console.log(`  - ${opis}`));

// Rozszerzenie: tylko stacjonarne
const stacjonarne = zajeciaPoTrybie(planZajec, false);
console.log(`\nZajęcia stacjonarne (${stacjonarne.length}):`);
opisZajec(stacjonarne).forEach((opis) => console.log(`  - ${opis}`));
