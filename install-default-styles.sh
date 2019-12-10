#!/usr/bin/env bash

# Helper script to download and install some of the Vale provided styles.
# As of Vale 2.0.0 these are no longer bundled with Vale itself so if we want to
# use them we need to grab a copy and put them in the styles/ directory.
#
# If you're on Windows this probably won't work, but you can manually download
# the .zip files below and unpack them into the styles/ directory.
#
# This script is run via `npm run postinstall`.

WORKING_DIR="${USE_DIR:=styles/}"
echo "Installing official Vale styles into: $WORKING_DIR";

cd $WORKING_DIR;

rm -r Joblint
curl -LO https://github.com/errata-ai/Joblint/releases/latest/download/Joblint.zip
unzip Joblint.zip
rm Joblint.zip

rm -r proselint
curl -LO https://github.com/errata-ai/proselint/releases/latest/download/proselint.zip
unzip proselint.zip
rm proselint.zip

rm -r write-good
curl -LO https://github.com/errata-ai/write-good/releases/latest/download/write-good.zip
unzip write-good.zip
rm write-good.zip
