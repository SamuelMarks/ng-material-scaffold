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

## Configure a reverse proxy for server

Use a long [nginxctl](https://github.com/offscale/nginxctl) CLI command to create an nginx config and server it:

    python -m nginxctl serve --temp_dir '/tmp' -b 'server' --server_name 'localhost' --listen '8080' -b 'location' '/api' --proxy_pass 'http://localhost:3000' --proxy_redirect 'off' -} -b 'location' '/' --root '/tmp/wwwroot' --try_files '$uri$args $uri$args/ /index.html' -} -}

Or just write a config (below is what the command generates… with 2 newlines thrown in):

    server {
        server_name localhost;
        listen 8080;

        location /api {
            proxy_pass http://localhost:3000;
            proxy_redirect off;
        }

        location / {
            root /tmp/wwwroot;
            try_files $uri$args $uri$args/ /index.html;
        }
    }

For development server, run with:

    python -m nginxctl serve --temp_dir '/tmp' -b map '$http_upgrade $connection_upgrade' --default 'upgrade' --"''" close -} -b 'server' --server_name 'localhost' --listen '8080' -b 'location' '/api' --proxy_pass 'http://localhost:3000' --proxy_redirect 'off' -} -b 'location' '^~ /sockjs-node/' --proxy_pass 'http://127.0.0.1:4200' --proxy_set_header 'Upgrade $http_upgrade' --proxy_set_header 'Connection $connection_upgrade' --proxy_set_header 'Host $host' --proxy_http_version '1.1' --proxy_cache_bypass '$http_upgrade' -}  -b 'location' '/' --proxy_pass 'http://127.0.0.1:4200/' --proxy_set_header 'Upgrade $http_upgrade' --proxy_set_header 'Connection $connection_upgrade' --proxy_set_header 'Host $host' --proxy_http_version '1.1' --proxy_cache_bypass '$http_upgrade' -} -}

Or just write a config (below is what the command generates… with some newlines thrown in):

    map $http_upgrade $connection_upgrade {
        default upgrade;
        "''" close;
    }

    server {
        server_name localhost;
        listen 8080;

        location /api {
            proxy_pass http://localhost:3000;
            proxy_redirect off;
        }

        location ^~ /sockjs-node/ {
            proxy_pass http://127.0.0.1:4200;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_http_version 1.1;
            proxy_cache_bypass $http_upgrade;
        }

        location / {
            proxy_pass http://127.0.0.1:4200/;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_http_version 1.1;
            proxy_cache_bypass $http_upgrade;
        }
    }

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

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
