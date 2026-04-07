// Zadanie 13 - Pobieranie danych o pogodzie z API
// Działa: fetch, async/await, try/catch, wyświetlanie temp i wiatru
// Rozszerzenie: funkcja z parametrami lat/lon + opis pogody na podstawie temp
// Trudność: obsługa odpowiedzi API i wyciąganie konkretnych pól

async function pobierzPogode(lat = 50.29, lon = 19.10, nazwaLokalizacji = "Katowice") {
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const dane = await response.json();
    const temp = dane.current.temperature_2m;
    const wiatr = dane.current.wind_speed_10m;
    const wilgotnosc = dane.current.relative_humidity_2m;

    // Rozszerzenie: opis na podstawie temperatury
    let opisTemp;
    if (temp < 0) {
      opisTemp = "Mróz - ubierz się ciepło!";
    } else if (temp < 10) {
      opisTemp = "Chłodno - weź kurtkę.";
    } else if (temp < 20) {
      opisTemp = "Umiarkowanie - przyjemna pogoda.";
    } else {
      opisTemp = "Ciepło - lekkie ubranie wystarczy.";
    }

    console.log(`=== Pogoda: ${nazwaLokalizacji} ===`);
    console.log(`Temperatura: ${temp}°C`);
    console.log(`Wiatr: ${wiatr} km/h`);
    console.log(`Wilgotność: ${wilgotnosc}%`);
    console.log(`Ocena: ${opisTemp}`);
  } catch (blad) {
    console.error(`Nie udało się pobrać pogody: ${blad.message}`);
  }
}

// Wywołanie dla Katowic
pobierzPogode();

// Wywołanie dla Warszawy (z opóźnieniem żeby nie mieszać outputów)
setTimeout(() => {
  pobierzPogode(52.23, 21.01, "Warszawa");
}, 1500);
