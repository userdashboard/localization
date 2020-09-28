#!/bin/sh
# this script updates the translated HTML pages and navigation 
# bars in the nominated or all projects.

# Requirements:
# 1) dashboard project must be installed to access HTML parser
# 2) install 'trans' from https://github.com/soimort/translate-shell

for LOCALE in `cat languages`; do
  time node localize.js "$LOCALE" `cd .. && pwd`
done
