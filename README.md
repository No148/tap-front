# Webapp 

### Tests

1. start app: 
> npm run dev
2. start cypress:
> npm run cy

It open Cypress UI where u can run specs

Add your specs to /cypress/e2e/\*.cy.js

https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test

#### Silence mode

> npm run cy:run

It run tests without UI

For production test, build app:

> npm run build

And run script

> npm run test
