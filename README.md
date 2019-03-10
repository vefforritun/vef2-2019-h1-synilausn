# Hópverkefni 1 – sýnilausn

Sýnilausn fyrir hópverkefni 1 í vefforritun 2 árið 2019.

## TODO

* [ ] Refactora út villuskilaboðsvirkni fyrir streng að lengd [min, max]
* [ ] Validate email virkni/pakki
* [ ] API fyrir users
* [ ] API fyrir products
* [ ] API fyrir cart
* [ ] API fyrir orders
* [ ] Staðfesta auth/admin virkni fyrir öll route
* [ ] Extracta alla fasta í env
* [ ] jsdoc

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
  a. útbúa gagnagrunn og fylla af gögnum búnum til með `faker`
  b. Færa allar myndir úr `img` í Cloudinary
  c. Útbúa grunn notanda með notandanafn `admin`, lykilorð `hóp1-2019-admin`
