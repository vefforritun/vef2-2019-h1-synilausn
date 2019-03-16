# Hópverkefni 1 – sýnilausn

Sýnilausn fyrir hópverkefni 1 í vefforritun 2 árið 2019.

## TODO

* [ ] Cascade delete / banna delete ef references
* [ ] Validate email virkni/pakki
* [ ] Refactora cloudinary kóða í eina skrá
* [ ] Refactora products, of margar línur
* [ ] jsdoc
* [ ] Test?
* [ ] Heroku

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
  * Notað fyrir lýsigögn fyrir síður
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

### Notendur

* Stjórnandi með notandanafn `admin`, lykilorð `hóp1-2019-admin`
* Ekki stjórnandi með notandanafn `oli`, lykilorð `hallóheimur`
  * Á pantanir og körfu

## Að eyða gögnum

TODO

* soft delete
* de-normalize history
* history

## Bearer tokens

ekki admin
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTUyNzMxMzE0LCJleHAiOjE1NTMzMzYxMTR9.aHr_QD19wPZBVTOfUbPFcM1A56DahF_WzMVIaNyVF-k

admin
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTUyNzQzMTEwLCJleHAiOjE1NTMzNDc5MTB9.xFxUQobxtyUPj675P2S2Yu6s9xRYbnU9ru_AJKfsOXQ