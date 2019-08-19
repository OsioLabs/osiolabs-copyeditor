# osiolabs-copy editor

This repository contains a set of tools used for reviewing, and linting, Osio Labs content.

Clone this repository to whatever machine you're using to perform the tutorial review.

## Tutorial linter

Status: BROKEN - See https://spectrum.chat/unified/unified/i-cant-seem-to-get-a-unified-args-based-cli-script-to-locate-external-files~4c3cc72d-b925-4704-8b09-f1305f658a9e

This set of tools is intended to enforce Markdown and other formatting styles. Similar to how a code base might have coding standards. Violating linter styles should be considered an error not a warning, and should be fixed before the content is published.

`./osiolabs-lint.js --help`

Usage example:

```sh
cd path/to/osiolabs-copyeditor/
chmod u+x ./osiolabs-lint.js
./osiolabs-lint.js path/to/content/dir/
```

Alternatively, create an alias so you can run this from anywhere using something like this in your _.bashrc_:

```sh
alias="node /path/to/osiolabs-copyeditor/osiolabs-lint.js --rc-path=/path/to/osiolabs-copyeditor/.osiolabs-lintrc.yml"
```

## Tutorial copy review

Status: working

This set of tools is intended to provide recommendations for improving a tutorial, and for conforming to both Osio Labs general, and product specific, style guides. Violating the copy review styles should be considered a warning not an error, and should at least be reviewed before the content is published. There are likely to be many exceptions to these rules.

For now we provide a set of vale rules that implement the Osio Labs style guide, provide other recommendations. You'll need to install [vale](https://errata-ai.github.io/vale/) to use them.

If you're on a Mac:

```sh
brew tap ValeLint/vale
brew install vale
```

Or: https://errata-ai.github.io/vale/#installation

Then run vale from within the content repository like so:

```sh
cd ~/heynode.com_content/
vale --config=path/to/osiolabs-copyeditor/vale/.vale.ini content/
```
