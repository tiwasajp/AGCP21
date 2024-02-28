# Neo CSS Framework

### Package managers

To download NEO into your project via Node Package Manager (npm), run the following command:

`npm install @avaya/neo`.

## Add Neo to Your Page

Add the compiled and minified CSS to the `<head>` element of your HTML5 document.

```html
<link rel="stylesheet" type="text/css" href="dist/css/neo/neo.min.css" />
```

## What's included

Both compiled and it's minified version are available:

```text
neo/
└── dist/
    └── css/
        └── neo/
            ├── neo.css
            └── neo.min.css
```

_Note_: Icon set is also included in `neo.css`.

## Code requirements

Use HTML5 doctype:

```html
<!DOCTYPE html>
```

Add the responsive viewport meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Browser support

Neo is set to support the last 2 versions of each browser, with the exception of IE (only IE11 is supported).
