import type { Language } from './translations';

/**
 * Case-study storytelling copy for the three real projects. Every statement
 * is based on the project's repository and documentation.
 *
 * Visuals use the project's real screens:
 *   crops      the four build points on the blueprint image (x% y% zoom),
 *              in the same order as `build`
 *   detail     focal point of the detail figure (gallery[0])
 *   challenge  focal point of the challenge image (gallery[1])
 */
export type CaseStudyCopy = {
  statement: string;
  challengeTitle: string;
  challenge: string;
  approachTitle: string;
  approach: string;
  build: { title: string; text: string }[];
  closing: string;
};

type Focus = { x: number; y: number; zoom: number };
export type CaseStudyVisuals = {
  crops: Focus[];
  detail: Focus;
  challenge: Focus;
};

export const CASE_VISUALS: Record<string, CaseStudyVisuals> = {
  'eclipse-ink': {
    crops: [{ x: 30, y: 64, zoom: 2 }, { x: 76, y: 68, zoom: 2.2 }, { x: 76, y: 92, zoom: 2.3 }, { x: 80, y: 11, zoom: 2.4 }],
    detail: { x: 80, y: 52, zoom: 1.5 },
    challenge: { x: 60, y: 70, zoom: 1.08 },
  },
  sori: {
    crops: [{ x: 27, y: 52, zoom: 1.9 }, { x: 70, y: 52, zoom: 2.2 }, { x: 76, y: 82, zoom: 2.2 }, { x: 48, y: 7, zoom: 2.4 }],
    detail: { x: 36, y: 40, zoom: 1.4 },
    challenge: { x: 70, y: 70, zoom: 1.08 },
  },
  tasma: {
    crops: [{ x: 18, y: 20, zoom: 2.2 }, { x: 18, y: 52, zoom: 2.1 }, { x: 50, y: 45, zoom: 1.9 }, { x: 80, y: 55, zoom: 2 }],
    detail: { x: 50, y: 40, zoom: 1.35 },
    challenge: { x: 55, y: 45, zoom: 1.08 },
  },
};

const en: Record<string, CaseStudyCopy> = {
  'eclipse-ink': {
    statement: 'An archive of original tattoo artwork, staged like an exhibition and built like a shop.',
    challengeTitle: 'Let the drawings lead, and keep the business underneath honest.',
    challenge: 'The artist needed one place for three things: showing original designs, taking custom commissions and, later, selling licences. The artwork had to stay the strongest element on every page, and nothing could look for sale before the legal and payment side was ready.',
    approachTitle: 'One archive, three ways in.',
    approach: 'A Three.js entry scene built from the artist’s own stencils opens the site. The gallery and plate pages read one catalogue in Postgres, managed from a private office with two-factor sign-in. Inquiry forms go straight to the studio inbox. The licence store sits behind a server-side switch: in portfolio mode every checkout is refused before an order or payment is created.',
    build: [
      { title: 'Plate viewer', text: 'Each design opens on its own plate: the master scan at 300 DPI on a 5 mm grid, with a loupe and deep inspection.' },
      { title: 'Classification', text: 'Placement, scale, discipline and deliverable, written for the person who will wear it and the artist who will tattoo it.' },
      { title: 'Planned availability', text: 'Open Access and Exclusive licences in euro. An Exclusive is reserved in one atomic database update, so it can never sell twice. Sales stay closed until launch.' },
      { title: 'Archive navigation', text: 'Breadcrumbs and previous and next plates keep the 26 designs one continuous archive.' },
    ],
    closing: 'Live as a portfolio and commission site, with the licence store built and waiting for launch.',
  },
  sori: {
    statement: 'A skincare store that starts from the skin, not from the shelf.',
    challengeTitle: 'Make Korean skincare easy to choose, in Polish.',
    challenge: 'Korean routines come with many steps, unfamiliar brands and long ingredient lists. The concept had to help someone choose with confidence, without pressure tactics, invented reviews or promises the data could not support.',
    approachTitle: 'Fewer steps, clear ingredients.',
    approach: 'Every product carries its INCI list and a short Polish description. The catalogue filters by skin type and concern, and a six-question quiz suggests a routine. Cart, wishlist and comparison are kept in the browser, so the whole concept works without accounts. Demonstration data is labelled wherever it appears.',
    build: [
      { title: 'Product gallery', text: 'A neutral packshot stage with swipe, thumbnails and enlarge, on phones and on desktop.' },
      { title: 'Labelled data', text: 'Ratings, prices and stock are marked as examples right next to the numbers.' },
      { title: 'Cart and wishlist', text: 'Quantity, add to cart and save stay within reach; the cart is stored on the device.' },
      { title: 'Ways to browse', text: 'Shop, skin type, skin concern and routines: four ways into the same catalogue.' },
    ],
    closing: 'A complete storefront concept, ready for real stock, payments and accounts when a merchant brings them.',
  },
  tasma: {
    statement: 'Counting the till should take seconds, even when the connection does not.',
    challengeTitle: 'A small business needs to close the day, not run a POS.',
    challenge: 'Many small shops take card, cash and online payments but have no point-of-sale system. Totals end up on paper or in a phone calculator. The tool had to be faster than that, exact to the grosz, and keep working without signal.',
    approachTitle: 'Integer money, offline first.',
    approach: 'Today the app is one installable screen. Amounts are stored as whole grosze, entries wait in a queue on the device and sync to Cloudflare D1 when the network returns, and the API accepts writes only from its own origin. The next stage, already in the codebase, adds shifts: opening and closing cash, payouts and a receipt-style report.',
    build: [
      { title: 'Daily total', text: 'The day’s takings and the number of entries, readable at a glance.' },
      { title: 'Amount entry', text: 'Type “12,50 + 30”, choose card, cash or online, add. The parser works in whole grosze, never in floating point.' },
      { title: 'The tape', text: 'Every entry in order with its method and amount, removable one by one.' },
      { title: 'Summary to copy', text: 'Totals per method and a plain-text summary to paste into a message at the end of the day.' },
    ],
    closing: 'Working today as a takings calculator; the shift settlement version is being built now.',
  },
};

const pl: Record<string, CaseStudyCopy> = {
  'eclipse-ink': {
    statement: 'Archiwum oryginalnych projektów tatuaży, pokazane jak wystawa i zbudowane jak sklep.',
    challengeTitle: 'Niech prowadzą rysunki, a biznes pod spodem będzie uczciwy.',
    challenge: 'Artysta potrzebował jednego miejsca na trzy rzeczy: pokazywanie oryginalnych projektów, przyjmowanie zamówień i, w przyszłości, sprzedaż licencji. Praca artysty miała być najmocniejszym elementem każdej strony, a nic nie mogło wyglądać na dostępne w sprzedaży, zanim strona prawna i płatności będą gotowe.',
    approachTitle: 'Jedno archiwum, trzy wejścia.',
    approach: 'Stronę otwiera scena w Three.js zbudowana z własnych szablonów artysty. Galeria i karty projektów czytają jeden katalog w Postgresie, zarządzany z prywatnego panelu z logowaniem dwuskładnikowym. Formularze trafiają prosto do skrzynki studia. Sklep z licencjami stoi za przełącznikiem po stronie serwera: w trybie portfolio każda próba zakupu jest odrzucana, zanim powstanie zamówienie czy płatność.',
    build: [
      { title: 'Karta projektu', text: 'Każdy projekt otwiera się na własnej karcie: skan w 300 DPI na siatce 5 mm, z lupą i dokładnym podglądem.' },
      { title: 'Klasyfikacja', text: 'Miejsce na ciele, skala, styl i zakres plików, opisane dla osoby, która będzie nosić tatuaż, i dla tatuatora.' },
      { title: 'Planowana dostępność', text: 'Licencje Open Access i Exclusive w euro. Exclusive jest rezerwowany jedną atomową operacją w bazie, więc nie da się go sprzedać dwa razy. Sprzedaż pozostaje zamknięta do startu.' },
      { title: 'Nawigacja po archiwum', text: 'Ścieżka i przejścia do poprzedniej i następnej karty łączą 26 projektów w jedno archiwum.' },
    ],
    closing: 'Działa jako portfolio i strona zamówień, a sklep z licencjami jest zbudowany i czeka na start.',
  },
  sori: {
    statement: 'Sklep z pielęgnacją, który zaczyna od skóry, a nie od półki.',
    challengeTitle: 'Ułatwić wybór koreańskiej pielęgnacji po polsku.',
    challenge: 'Koreańskie rutyny to wiele kroków, mało znane marki i długie składy. Koncepcja miała pomóc wybrać z pewnością, bez presji sprzedażowej, wymyślonych opinii i obietnic, których dane nie potwierdzają.',
    approachTitle: 'Mniej kroków, czytelny skład.',
    approach: 'Każdy produkt ma pełny skład INCI i krótki opis po polsku. Katalog filtruje według typu skóry i potrzeb, a quiz z sześcioma pytaniami podpowiada rutynę. Koszyk, lista życzeń i porównywarka zapisują się w przeglądarce, więc cała koncepcja działa bez kont. Dane demonstracyjne są oznaczone wszędzie, gdzie się pojawiają.',
    build: [
      { title: 'Galeria produktu', text: 'Neutralna scena dla zdjęć produktu z przesuwaniem, miniaturami i powiększeniem na telefonie i komputerze.' },
      { title: 'Oznaczone dane', text: 'Oceny, ceny i stany są oznaczone jako przykładowe tuż przy liczbach.' },
      { title: 'Koszyk i lista życzeń', text: 'Ilość, dodanie do koszyka i zapis są pod ręką; koszyk zapisuje się na urządzeniu.' },
      { title: 'Sposoby przeglądania', text: 'Sklep, typ skóry, potrzeby skóry i rutyny: cztery wejścia do tego samego katalogu.' },
    ],
    closing: 'Kompletna koncepcja sklepu, gotowa na prawdziwy asortyment, płatności i konta, gdy wniesie je sprzedawca.',
  },
  tasma: {
    statement: 'Policzenie kasy powinno zająć sekundy, nawet gdy zasięg zawodzi.',
    challengeTitle: 'Mała firma musi zamknąć dzień, a nie obsługiwać POS.',
    challenge: 'Wiele małych sklepów przyjmuje płatności kartą, gotówką i online, ale nie ma systemu sprzedaży. Sumy lądują na kartce albo w kalkulatorze telefonu. Narzędzie miało być od tego szybsze, dokładne co do grosza i działać bez zasięgu.',
    approachTitle: 'Pieniądze w liczbach całkowitych, najpierw offline.',
    approach: 'Dziś aplikacja to jeden ekran, który można zainstalować na telefonie. Kwoty są zapisywane w całych groszach, wpisy czekają w kolejce na urządzeniu i synchronizują się z Cloudflare D1 po odzyskaniu połączenia, a API przyjmuje zapisy tylko z własnej domeny. Kolejny etap, już obecny w kodzie, dodaje zmiany: stan kasy na otwarcie i zamknięcie, wypłaty i raport w formie paragonu.',
    build: [
      { title: 'Łączny utarg', text: 'Utarg z całego dnia i liczba wpisów, czytelne od razu.' },
      { title: 'Wpisywanie kwot', text: 'Wpisz „12,50 + 30”, wybierz kartę, gotówkę albo online i dodaj. Parser liczy w całych groszach, nigdy na liczbach zmiennoprzecinkowych.' },
      { title: 'Taśma wpisów', text: 'Każdy wpis po kolei, z metodą i kwotą, do usunięcia pojedynczo.' },
      { title: 'Podsumowanie do skopiowania', text: 'Sumy dla każdej metody i zwykły tekst do wklejenia w wiadomość na koniec dnia.' },
    ],
    closing: 'Działa jako kalkulator utargu; wersja do rozliczania zmian jest teraz budowana.',
  },
};

export const CASE_STUDIES: Record<Language, Record<string, CaseStudyCopy>> = { en, pl };
