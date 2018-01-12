ng-material-scaffold
====================

Simple scaffold generated with `@angular/cli` then implemented manually.

## Update version

    sed -i "/this.serverStatus =/c\    this.serverStatus = {version: 'App $(jq -r .version package.json); '};" src/app/server-status/server-status.component.ts

## Deploy distribution
Clone [ng-material-scaffold-dist](https://github.com/SamuelMarks/ng-material-scaffold-dist) one directory above, then:

    rm -rf dist; ng build -prod && d=../ng-material-scaffold-dist && rm -rf "$d/dist" && mv "$PWD/dist" "$d" && cd "$d" && (git add .; git status) || ( >&2 echo BUILD FAILED )
