Scenario:
=========

A developer on our team was working on integrating the TomTom API. They did a great job laying the groundwork, but they've recently been promoted to a new project that requires their full attention.

We are pretty confident the developer managed to complete the majority of the initial part of the integration, however there might be a bug or two to be discovered.

Your task is to finish off this implementation, ensuring the requirements are met with passing tests.


Task:
=====
To take a partial address input and return full address suggestions along with the address broken into its individual components using the TomTom API.


Resources:
==========

Place Search Documentation: https://developer.tomtom.com/search-api/documentation/search-service/search-service
API Key: TBC

Install:
========
1. yarn install
2. Create a copy of `env.example` and name it `.env`, place the TomTom Api key in it 

Test:
=====
1. yarn install
2. yarn test


Requirements:
=============

1. All tests should pass and ensure good coverage for new work
2. We only allow Australian addresses to be returned
3. Code should be maintainable and consistent
4. The result elements should contain important information about the place (country, municipality, etc)
5. The returned result should be typed and easily consumable via users of the library
6. No front-end requirements are necessary, this is purely a backend NodeJS library

TODOs:
=============
1. Implement code and tests
   - Exception handling
2. Improvements
   - Add coverage reports
   - Lint
3. Check package.json
   - Engines
   - Dependency versions
   - Audit/Vulnerabilities
4. Add GitHub Actions
5. Publish NPM Package

