# Frontend Bootstrap

## How to: Setup development environment
1. Make sure the following is installed on your machine:
    - [Node.js](http://nodejs.org/)
2. Run these commands to install the project-specific dependencies:
    ```
    npm install
    ```
3. Done! You can now start your development server.


## How to: Start the development server
```
npm start
```
Then point your browser to `http://localhost:3000/`


## How to: Build
```
npm run build
```

## How to: Linting
```
npm run lint
```
The linting tools currently cover:
- JavaScript code linting
- Sass file code linting


## How to: Unit tests
```
npm test
```
Javascript files in the component folder ending with `.Spec.js` will be run through Mocha.

## How to: Upload
Add a `.env` file to the project root with your FTP credentials:
```
UPLOAD_HOST=ftp.example.org
UPLOAD_USER=username
UPLOAD_PASSWORD=password
```
Then run:
```
gulp upload
```

## How to: Component library
Components are visible in the component library when they contain a YAML (.yml) file.
The YAML file should have the same name as the component's .html file and contains the following parameters:
```
title: Title of the component shown in the library
description: Component description text
demo: |
  <div style="width:100%;height:200px;background:#f2f2f2">{}</div>
implementation: Implementation instructions
```
Note that `demo` should at least contain `{}` as this gets replaced with the component's HTML.
The component is rendered for each `{}` you provide within the demo parameter.

Components can be nested either with or without a sub-folder. Currently folders can only be nested one level deep.
```
nav/
  nav.html
  nav.yml
  anotherNav.html
  anotherNav.yml
  footerNav/
    footerNav.html
    footerNav.yml
```
