# Localization

Dashboard and its modules are localized using [Translate Shell](https://github.com/soimort/translate-shell). 

# How to translate your own module

You can generate translations for your own Dashboard module by setting up a copy of Dashboard with it:

    $ git clone https://github.com/userdashboard/dashboard
    $ git clone https://github.com/userdashboard/localization
    # set up your module alongside them
    $ git clone https://github.com/you/your-module
    $ cd localization
    $ ADD_PROJECT=your-module bash localize.sh

# How to make and share a good translation

 Since these are automated translations my expectations are they are not very good.  You can make a perfect translation for any language and publish it as a module.

Firt set up a copy of Dashboard and each of the modules you wish to translate:

    $ for x in localization dashboard organizations stripe-connect stripe-subscriptions; do
        git clone https://github.com/userdashboard/$x.git
      done;

Second, create a folder for Dashboard:

    $ mkdir dashboard-LANG
    $ cd dashboard-LANG
    $ npm init
    $ mkdir -p languages
    $ cp -R ../dashboard/languages/LANG languages

Also for any modules you are creating translations for:

    $ mkdir organizations-LANG
    $ cd organizations-LANG
    $ npm init
    $ mkdir -p languages
    $ cp -R ../organizations/languages/LANG languages

Then edit your copy of the files and when you are finished publish to NPM:

    $ cd dashboard-LANG
    $ npm publish

    $ cd organizations-LANG
    $ npm publish

People may use your translations by installing them as modules:

    $ mkdir my-project
    $ cd my-project
    $ npm init
    $ npm install @userdashboard/dashboard @userdashboard/organizations dashboard-LANG organizations-LANG
    # edit package.json to activate organizations and -LANG modules
    $ node main.js

# How to run the translation software

The translation works by setting up a copy of Dashboard and each of the modules:

    $ for x in localization dashboard organizations stripe-connect stripe-subscriptions; do
        git clone https://github.com/userdashboard/$x.git
      done;
    $ cd localization
    $ bash localize.sh

Because the translating leans on Google Translate the process has been broken up into cache-heavy steps that avoid unnecessary requests to the web service.

First `create-text-manifest.js` scans each folder for HTML files like navigation bars, pages, templates etc and within each file it scans for tags containing `translate="yes"`.  These are cataloged into `text-manifest.json`.

Then `translate-text.js` processes the `text-manifest.json` and requests translations for any phrases that are missing a translation.  The translations are cataloged into `translations-cache-LANG.json`.

Finally `apply-translation.js` processes a `translation-cache-LANG.json` file and applies the translations to the original HTML file then writes the `/src/LANG/...` equivalent of `/src/www/...`

The `clean-translation-cache.js` checks the `text-manifest.json` and removes translated phrases that are no longer used.
