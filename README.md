ng-material-scaffold
====================
[![License](https://img.shields.io/badge/license-Apache--2.0%20OR%20MIT-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![David dependency status for latest release](https://david-dm.org/SamuelMarks/ng-material-scaffold.svg)
![Angular builds](https://github.com/SamuelMarks/ng-material-scaffold/workflows/Angular%20builds/badge.svg)

Simple scaffold generated with `@angular/cli` then implemented manually.

## Update version

    sed -i "/this.serverStatus =/c\    this.serverStatus = { version: '@ $(jq -r .version package.json); '};" src/app/server-status/server-status.component.ts

## Deploy distribution
Clone [ng-material-scaffold-dist](https://github.com/SamuelMarks/ng-material-scaffold-dist) one directory above, then:

    rm -rf dist; ng build --prod && d=../ng-material-scaffold-dist && rm -rf "$d/dist" && mv "$PWD/dist/${PWD##*/}/" "$d/dist" && cd "$d" && (git add .; git status) || ( >&2 echo BUILD FAILED )

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

---

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or <https://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <https://opensource.org/licenses/MIT>)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
