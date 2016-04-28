/*eslint-disable*/
export default {
  shared: {
    signIn: 'Zarejestruj się',
    forgot: 'Zapomniałeś hasło?',
    forgotIntro: 'Wypełnij swój email. Wkrótce otrzymasz potwierdzenie.',
    forgotComplete: 'Zaraz otrzymasz email z prośbą o zresetowanie hasła. ',
    send: 'Wyślij',
    updateProfileComplete: 'Zaktualizowano profil',
    add: 'Dodaj',
    users: 'Urzytkownicy',
    reset: 'Zresetuj hasło',
    resetIntro: 'Proszę wybierz nowe hasło',
    chooseCountry: 'Wybierz kraj',
  },
  global: {
    continue: 'Kontynuuj',
    back: 'Powrót',
    save: 'Zapisz',
    cancel: 'Anuluj',
    remove: 'Usuń',
    close: 'Zamknij',
    sure: 'Jesteś pewien?',
    yes: 'Tak',
    created: 'Stworzono'
  },
  header: {
    languages: {
      nl: 'Nederlands',
      fr: 'français',
      en: 'English',
      it: 'Italiano',
      pl: 'Polski',
    },
    title: 'Bożonarodzeniowe Targi Carrefour',
    myProfile: 'Mój profil',
    myRequest: 'Moja prośba',

    admin: 'Administrator',
    requests: 'Prośba',
    products: 'Produkty',
    logout: 'Wyloguj',
    signin: 'Zaloguj',
    status: 'Status',
    orderComplementaryItems: 'Zamów dodatkowe elementy'
  },
  signin: {
    intro: 'Witamy na platformie rejestracynej Bożonarodzeniowych Targów Carrefour! \nZarejestruj się lub zaloguj na swoim istaniejącym profilu.',
    existingUser: 'Zarejestrowany użytkownik',
    email: 'Email',
    password: 'Hasło',
    newUser: 'Nowy użytkownik',
    register: 'Zarejestruj',
    firstName: 'Imię',
    lastName: 'Nazwisko',
    incorrect: 'Nieprawidłowy login lub hasło'
  },
  profile: {
    clientInformation: 'Informacje o kliencie',
    salesContact: 'Osoba kontaktowa w sprawie sprzedaży',
    invoiceContact: 'Osoba kontaktowa w sprawie faktur',
    language: 'Język',
    exhibitorName: 'Nazwa wystawcy',
    sector: 'Sektor',
    subSector: 'Pod-sektor',
    chooseSector: 'Wybierz sektor',
    companyName: 'Nazwa firmy',
    address: 'Adres',
    zip: 'Kod pocztowy',
    city: 'Miasto',
    country: 'Kraj',
    belgium: 'Belgia',
    otherCountry: 'Inny kraj',
    vat: 'NIP',
    invoiceSame: 'Dane to faktury są takie same jak do sprzedaży',
    updateProfile: 'Zaktualizuj profil',
    chooseLanguage: 'Wybierz język',
    chooseSubSector: 'Wybierz pod-sektor',
    mobile: 'Numer telefonu komórkowego',
    phone: 'Numer telefonu'
  },
  packages: {
    welcome: 'Witaj, proszę wybierz odpowiedni pakiet i wypełnij formularz rejestracyjny.',
    title: 'Pakiet',
    nakedStand: 'Stoisko surowe',
    furnishedStand: 'Stoisko umeblowane',
    sharedStand: 'Stoisko dzielone z innym wystawcą',
    fresh: 'Fresh Market',
    expressConcept: 'Koncept Express',
    selectType: 'Wybierz pakiet',
    definition: 'Definicja',
    exhibitors: 'Wystawcy',
    typologies: 'Typologia',
    includes: 'Zawiera',
    surface: 'powierzchnia',
    rates: 'Stawka',
    seeRegistration: 'Zobacz formularz rejestracyjny',
    category: 'Kategoria',
    vatExclusive: 'W cenę nie jest wloczony VAT (21%)',
    requiredPackages: 'Odpowiedni pakiet',
    info: {
      nakedStand: {
        definition: '<ul><li>Od 9m²</li><li>Od 1 215 zł</li><li>Cena za m² maleje</li></ul>',
        standPrice: 'Cena stoiska zawiera dywan, ściany, nazwę na ścianie frontowej, gniazdo elektryczne 1x16A, kosz na śmieci',
      },
      furnishedStand: {
        definition: '<ul><li>From 9m² od 9m²</li><li>From € 3641,25</li><li>Cena za m² maleje</li></ul>',
        standPrice: 'Cena stoiska zawiera dywan, ściany, meble, oświetlenie, nazwę na ścianie frontowej, gniazdo elektryczne 1x16A, kosz na śmieci',
      },
      sharedStand: {
        definition: '<ul><li>Przestrzeń dzielona między dwóch wystawców</li><li>6m² (2m Szer. * 3m Dł.)</li><li>Cena 6 600 zł',
        standPrice: 'Cena stoiska zawiera dywan, ściany, oświetlenie, 1 stół wysoki, 1 krzesło wysokie, nazwę na ścianie frontowej, gniazdo elektryczne 1x16A, kosz na śmieci – brak podziału między wystawcami',
      },
      fresh: {
        definition: '<ul><li>Produkty w strefie Fresh Market (dedykowana przestrzeń w ladach)</li><li>Cena zależna od ilości prezentowanych numerów referencyjnych </li><li>Dodatkowo: stoisko / lada degustacyjna</li>',
        costOfParticipation: {
          title: 'Koszty urzestnictwa',
          1: 'Od 1 do 7 produktów w strefie Freah Market',
          2: 'Od 8 do 15 produktów w strefie Fresh Market',
          3: 'Ponad 15 produktów w strefie Fresh Market'
        },
        additionalVisibility: {
          title: 'Dodatkowo',
          stand: 'Stoisko (950 zł/ m²)',
          standDescription: 'Cena stoiska zawiera dywan, ściany, meble, oświetlenie, nazwę na ścianie frontowej, gniazdo elektryczne 1x16A, kosz na śmieci, lodówkę (w zależności od dostępności)',
          tastingDesk: 'Lada degustacyjna (1000 zł)',
        }
      },
      concept: {
        definition: '<ul><li>Uczestnictwo w stoisku Koncept Express</li></ul>',
        costOfParticipation: {
          title: 'Koszt uczestnictwa',
          description: 'Wyślij prośbę'
        }
      }
    },
    priceInfo: 'Informacja o kosztach',
    priceInfoDescription: 'Kliknij tutaj aby uzyskać więcej informacji',
    type: 'Typ',
    bareStand: 'Stoisko surowe',
    basicStand: 'Stoisko umeblowane',
    preferredStandNumber: 'Preferowany numer stoiska',
    surfaceAreaWidth: 'Głębokość',
    surfaceAreaHeight: 'Szerokość',
    floorPlan: 'Plan stoisk',
    floorPlanDescription: 'Kliknij tutaj aby zobaczyć plan stoisk',
    administrativePackage: {
      included: {
        title: 'Zawiera',
        1: 'Opłata administracyjna',
        2: 'Przewodnik',
        3: 'Ubezpieczenie OC',
        4: 'Identyfikatory'
      }
    },
    priceOverview: {
      administrativeCosts: 'Opłata administracyjna zawiera przewodnik, ubezpiecznie OC, identyfikatowy, parking',
      standPrice: 'Koszt pakietu',
      totalPrice: 'Całkowity koszt'
    }
  },
  complementary: {
    title: 'Materiały dodatkowe',
    intro: 'Wybierz dodatkowe wyposażenie.',
    included: 'Zawarty w pakiecie',
    electrical: 'Dodatkowa moc elektryczna 1600W jest zawarta w przypadku domówienia sprzętu elektrycznego.'
  },
  confirm: {
    numberOfProducts: 'Ilość produktów',
    additionalVisibility: 'Dodatkowa widoczność',
    stand: 'Stoisko',
    tastingDesk: 'Lada degustacyjna',
    surfaceAreaWidth: 'Głębokość',
    surfaceAreaHeight: 'Szerokość',
    preferredStandNumber: 'Preferowany numer stoiska',
    administrativeCost: 'Opłata administracyjna zawiera przewodnik, ubezpiecznie OC, identyfikatowy, parking',
    standCost: 'Cena pakietu',
    cleaningCost: 'Cena za sprzątanie',
    transportCost: 'Koszt transportu',
    totalPackagePrice: 'Koszt pakietu',
    totalPrice: 'Koszt całkowity',
    confirmation: 'Potwierdzenie',
    package: 'Pakiet',
    complementary: 'Dodatkowe zamówienia',
    unitPrice: 'Cena jednostkowa',
    totalPriceWithComplementaryProducts: 'Cena całkowita (z dodatkowymi zamówieniami)',
    readAndAccept: 'Przeczytaj I zaakceptuj:',
    codeOfConduct: 'CKodeks postępowania',
    generalConditions: 'Warunki ogólne',
    submitRequest: 'Złóż wniosek',
    complete: {
      title: 'Wniosek wypełniony!',
      intro: 'Kolejna prośba została zaakceptowana',
      help: {
        1: 'Idź do',
        2: 'Strona startowa'
      }
    },
  },
  order: {
    approve: 'Potwierdź',
    decline: 'Usuń',
    edit: 'Edytuj',
    accept: 'Akcetruj',
    close: 'Zamknij',
    generateInvoice: 'Wygeneruj fakturę',
    print: 'Drukuj PDF',
    comment: 'Komentarz',
    saveComment: 'Zapisz komentarz',
    admin: {
      status: {
        requested: 'Potwierdź lub edytuj tą prośbę.',
        approved: 'Twoja oferta została wysłana do klienta. Proszę Poczekaj na akceptację przed wysłaniem faktury.',
        accepted: 'Twoja oferta została zaakceptowana. Możesz teraz wygenerować fakturę.',
        closed: 'Zamów fakturę',
        declined: 'Twoje zamówienie zostało anulowane'
      }
    },
    client: {
      status: {
        requested: 'Twój wniosek został złożony. Otrzymasz e-maila, gdy zostanie zatwierdzony.',
        approved: ' Twoja prośba została zaakceptowana. Proszę potwierdzić, czy możemy wystawić fakturę.',
        accepted: 'Wystawiamy fakturę. Otrzymasz ją niedługo drogą mailową.',
        closed: 'Twoja faktura została wysłana.',
        declined: 'To zamówienie zostało anulowane.'
      }
    },
    poNumber: 'Numer PO',
    noPoNumber: 'Brak numeru PO',
    customerReference: 'Referencja',
    vatNumber: 'Numer NIP',
    reference: 'Referencja',
    unitPrice: 'Cena jednostkowa',
    quantity: 'Ilość',
    price: 'Cena',
    request: 'Prośba',
    offer: 'Oferta',
    order: 'Zamówienie',
    chooseProduct: 'Wybierz produkt',
    addProduct: 'Dodaj produkt',
    addComment: 'Dodaj komentarz',
    total: 'Koszt całkowity (bez VAT)',
    vat: 'VAT',
    totalWithVat: 'Koszt całkowity z VAT',
    noPoNumberSelected: 'Wybrano “Brak numeru PO”'
  },
  timeline: {
    changedFrom: 'Zmień formularz',
    changedTo: 'na',
    status: 'status',
    requested: 'prośba',
    approved: 'zatwierdzono',
    accepted: 'zaakceptowano',
    closed: 'zamknięty',
    price: 'Cena',
    quantity: 'Ilość',
    by: 'przez',
    item: 'Pozycja'
  }
}
