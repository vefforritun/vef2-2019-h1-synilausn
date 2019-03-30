# Hópverkefni 1 – sýnilausn

Sýnilausn á [hópverkefni 1 í vefforritun 2 árið 2019](https://github.com/vefforritun/vef2-2019-h1). Lausnin keyrir á [`https://vefforritun2-2019-h1-synilausn.herokuapp.com/`](https://vefforritun2-2019-h1-synilausn.herokuapp.com/).

## Umhverfisbreytur

Eftirfarandi breyta er krafist:

* `DATABASE_URL`
  * Slóð á gagnagrunn með auðkenningu
* `CLOUDINARY_URL`
  * Slóð á Cloudinary uppsetningu með auðkenningu
* `JWT_SECRET`
  * Langur, handahófskenndur strengur fyrir leyndarmál sem notað er fyrir JWT token

Eftirfarandi breytur eru valkvæmar:

* `HOST`
  * Gildi sem notað er til að útbúa slóð á vefþjón
  * Sjálfgefið `127.0.0.1`
* `PORT`
  * Gildi fyrir port sem forrit keyrir á
  * Sjálfgefið `3000`
* `BASE_URL`
  * Gildi fyrir slóð á vefþjón, á forminu `https://example.org`
  * Notað fyrir lýsigögn (paging) fyrir síður
  * Sjálfgefið óskilgreint
* `JWT_TOKEN_LIFETIME`
  * Hversu lengi JWT token er gildur
  * Sjálfgefið sjö dagar eða `60 * 60 * 24 * 7` sekúndur
* `BCRYPT_ROUNDS`
  * Hversu oft á að hasha bcryptuð lykilorð
  * Sjálfgefið `11`
* `DEBUG`
  * Hvort birta eigi auka debug gögn í keyrslu
  * Sjálfgefið `false`
* `NUMBER_OF_FAKE_CATEGORIES`
  * Fjöldi gervi flokka sem búa á til
  * Sjálfgefið `12`
* `NUMBER_OF_FAKE_PRODUCTS`
  * Fjöldi gervi vara sem búa á til
  * Sjálfgefið `100`
* `IMAGE_FOLDER`
  * Mappa með myndum fyrir gervivörur
  * Sjálfgefið `./img`

## Uppsetning

1. Búa til gagnagrunn, t.d. `createdb 2019-h1-synilausn`
2. Búa til Cloudinary aðgang
3. Afrita `.env_example` í `.env` og setja upplýsingar fyrir
  a. Gagnagrunn
  b. Cloudinary
4. Keyra `npm run setup` til að:
  a. Útbúa gagnagrunn og fylla af gögnum búnum til með `faker`
  b. Færa allar myndir úr `img` í Cloudinary
  c. Útbúa grunn notendur
  d. Útbúa pantanir og körfu fyrir notendur

```bash
createdb 2019-h1-synilausn
cp .env_example .env # Stilla breytur sem er krafist
npm install
npm test -s
npm run setup -s
npm run dev
```

### Notendur

* Stjórnandi með notandanafn `admin`, lykilorð `hóp1-2019-admin`
* Ekki stjórnandi með notandanafn `oli`, lykilorð `hallóheimur`
  * Á pantanir og körfu

## Að eyða gögnum

Þessi lausn leyfir ekki að eyða gögnum ef einhver önnur gögn vísa í þau, t.d. er ekki hægt að eyða flokk ef a.m.k. ein vara er í þeim flokk. Lausn leyfir hinsvegar að breyta vörum _eftir_ að þær eru komnar í körfu eða pöntun. Það er augljóslega ekki frábært.

Það eru nokkrar leiðir til að meðhöndla það að eyða gögnum eða breyta þeim þar sem við höfum venslaðan grunn með tímaháðum gögnum. Tek það fram að ég er engin gagnagrunns sérfræðingur og slíkir munu að öllum líkindum hrylla sig við þessu yfirliti.

### Soft delete

_Soft delete_, leyfir okkur að fjarlægja gögn úr birtingu án þess að eyða þeim í raun og veru. Bætum við dálk, t.d. `deleted` á töflu og setjum sem `true` ef röð hefur verið eytt. Leyfir okkur að „eyða“ gögnum á kostnað þess að þurfa að hafa `deleted = FALSE` skilyrði á öllum fyrirspurnum. Leysir ekki breytingar á gögnum.

### „Denormalize“

Að denormalizea gagnagrunn getur verið lausn á vandamálum sem koma upp, bæði vegna breytinga á gögnum og hraða á fyrirspurnum. Ef það er lesið mjög oft (read) úr grunninum okkar hversu margar vörur eru til (og við höfum _mjög margar_ vörur) en við uppfærum það sjaldan (write) getur verið hagstæðara að uppfæra talningu við skrifa í staðinn fyrir að lesa það oft.

Ef við notum ekki vísanir í t.d. vöru en í staðinn _afritum_ gildin á þeim tímapunkti sem þau eru notuð (pöntun búin til, vara sett í körfu) þurfum við ekki að hafa áhyggjur af því að breyta vörunni á seinni tíma. Þetta þýðir samt að við höfum fleiri en eitt afrit af gögnum á mismunandi stöðum í gagnagrunni og getur það valdið ósamræmi.

### Saga

Við getum útbúið gagnagrunninn okkar þannig að við höfum leiðir til að fylgjast með sögu hverjar raðar. Ef röð er breytt höfum við einhverja leið til að sjá fyrri útgáfur af röðinni, sama ef henni er eytt. Þetta eykur flækjustig í hönnun á gagnagrunni og fyrirspurnum en leyfir okkur að vita nákvæmlega hvað og hvenær eitthvað gerðist.
