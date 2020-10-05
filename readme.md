# Documentation for localization 

#### Index

- [Introduction](#introduction)
- [Module contents](#module-contents)
- [Import this module](#import-this-module)
- [Adding languages to your application](#adding-supported-languages)
- [Improving translations](#improving-translations)
- [How to run the translation software](#translating-your-own-module)
- [Storage engine](#storage-engine)
- [Access the API](#access-the-api)
- [Github repository](https://github.com/userdashboard/localization)
- [NPM package](https://npmjs.org/userdashboard/localization)


# Introduction

Dashboard bundles everything a web app needs, all the "boilerplate" like signing in and changing passwords, into a parallel server so you can write a much smaller packageJSON

At this point if the route is to your application server the `x-language` header will inform you which language is being used.  If the route is to a page on your Dashboard server the translations will be applied automatically.

# Module contents 

Dashboard modules can add pages and API routes.  For more details check the `sitemap.txt` and `api.txt` or `env.txt` also contained in the online documentation.

| Content type             |     |
|--------------------------|-----|
| Proxy scripts            | Yes |
| Server scripts           | Yes |
| Content scripts          |     |
| User pages               | Yes |
| User API routes          | Yes | 
| Administrator pages      | Yes |
| Administrator API routes | Yes | 

# Import this module

Install the module with NPM:

    $ npm install @userdashboard/localization

Edit your `package.json` to activate the module:

    "dashboard": {
      "modules": [
        "@userdashboard/localization"
      ]
    }

# Adding languages to your application

The owner or an administrator may then activate new languages in the administration system.  Adding a language will allow users to select it from a dropdown:

    ENABLE_LANGUAGE_PREFERENCE=true

Or you may specify it as the default or only language for all users:

    LANGUAGE=fr

When a language is activated all requests are intercepted with a server script that checks whether the default English content should be swapped out for a transalation.

Your application server can identify a user's language preference via the `x-language` header added by the proxy script.

# Improving translations

The administration interface allows you to edit translations to correct errors.  If you would like to share your corrections the administration interface allows you to download your updated `translations-cache-LANG.json` file, which can be submitted via pull-request to the [localization repository](https://github.com/userdashboard/localization).  Corrected translations are stored in your database so they are accessible to multiple Dashboard server instances.

# How to run the translation software

You will need to install [Translate Shell](https://github.com/soimort/translate-shell) which is a command-line interface for Google Translate, Bing and Yandex.  Because the translating uses Google Translate the process has been broken up into cache-heavy steps that avoid unnecessary requests to their web service.  

The translation software expects a folder structure like so:

    /<path-to-somewhere>/localization
    /<path-to-somewhere>/dashboard
    /<path-to-somewhere>/your-module
    /<path-to-somewhere>/another-module

You can either run the localization software with NodeJS to translate a single language, or the Bash script will translate all languages:

    $ node localize.js es /<path-to-somewhere>
    $ bash localize.sh

If you are translating your own module(s) they may be specified in environment variables:

    $ ADD_PROJECT1=your-module \
      ADD_PROJECT2=another-module \
      node localize.js fr /<path-to-somewhere>

First `create-text-manifest.js` scans each `src` folder for HTML files like navigation bars, pages, templates etc and within each file it scans for HTML tags designated `translate="yes"`.  These are cataloged into `text-manifest.json`.

Second `translate-text.js` processes the `text-manifest.json` and requests translations for any phrases that aren't translated yet.  The translations are saved into `translations-cache-LANG.json`.

Finally `clean-translation-cache.js` checks the `text-manifest.json` and removes translated phrases that are no longer used.

## Storage engine

By default this module will share whatever storage you use for Dashboard.  You can specify an alternate storage module to use instead, or the same module with a separate database.

    SUBSCRIPTIONS_STORAGE=@userdashboard/storage-postgresql
    SUBSCRIPTIONS_DATABASE_URL=postgres://localhost:5432/subscriptions

### Access the API

Dashboard and official modules are completely API-driven and you can access the same APIs on behalf of the user making requests.  You perform `GET`, `POST`, `PATCH`, and `DELETE` HTTP requests against the API endpoints to fetch or modify data.  This example changes the user's language preference using NodeJS, you can do this with any language:

You can view API documentation within the NodeJS modules' `api.txt` files, or on the [documentation site](https://userdashboard.github.io/localization-api).

    await proxy(`/api/user/localization/set-account-language?accountid=${accountid}`, accountid, sessionid, 'fr')

    const proxy = util.promisify((path, accountid, sessionid, language, callback) => {
      const postData = `language=${language}`
        const requestOptions = {
            host: 'dashboard.example.com',
            path: path,
            port: '443',
            method: 'PATCH',
            headers: {
                'x-application-server': 'application.example.com',
                'x-application-server-token': process.env.APPLICATION_SERVER_TOKEN,
                'x-accountid': accountid,
                'x-sessionid': sessionid,
                'content-length': postData.length,
                'content-type': 'application/x-www-form-urlencoded'
            }
        }
        const proxyRequest = require('https').request(requestOptions, (proxyResponse) => {
            let body = ''
            proxyResponse.on('data', (chunk) => {
                body += chunk
            })
            return proxyResponse.on('end', () => {
                return callback(null, JSON.parse(body))
            })
        })
        proxyRequest.on('error', (error) => {
            return callback(error)
        })
        proxyRequest.write(postData)
        return proxyRequest.end(postData)
      })
    }
