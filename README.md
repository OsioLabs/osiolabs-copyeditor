# osiolabs-copy editor

This repository contains a set of tools used for reviewing, and linting, Osio Labs content.

## Usage

For most use-cases you'll want to add this as a dependency to whichever content repo you want to use the tools with. And then execute them using `npm run`.

Note: Using the review tools requires that you have vale installed. See below.

```sh
npm install https://github.com/OsioLabs/osiolabs-copyeditor
```

Then add something like the following to your projects _package.json_ file:

```json
"scripts": {
  "lint": "node ./node_modules/osiolabs-copyeditor/osiolabs-lint.js --rc-path=./node_modules/osiolabs-copyeditor/.osiolabs-lintrc.yml",
  "lin:all": "npm run lint content/",
  "review": "vale --config='./node_modules/osiolabs-copyeditor/.vale.ini'",
  "review:all": "npm run review content/"
},
```

Use the tools to lint/review content:

```sh
npm run lint:all
npm run lint content/path/to/my-tutorial.md
# Or
npm run review:all
npm run review content/path/to/my-tutorial.md
```

--------------------------------------------------------------------------------

For more detailed information about the individual tools, and to work on development of these tools continue reading.

## Tutorial linter

This set of tools is intended to enforce Markdown and other formatting styles. Similar to how a code base might have coding standards. Violating linter styles should be considered an error not a warning, and should be fixed before the content is published.

Make it executable:

```sh
cd path/to/osiolabs-copyeditor/
chmod u+x ./osiolabs-lint.js
```

See help:

```sh
./osiolabs-lint.js --help
```

Usage example:

```sh
# Run the script from within the directory that contains the content you want to lint.
cd path/to/heynode.com_content/
path/to/osiolabs-copyeditor/osiolabs-lint.js --rc-path=path/to/osiolabs-copyeditor/.osiolabs-lintrc.yml content/
```

Alternatively, create an alias so you can run this from anywhere using something like this in your _.bashrc_:

```sh
alias osiolabs-lint="node /Users/joe/Sites/osiolabs-copyeditor/osiolabs-lint.js --rc-path=/Users/joe/Sites/osiolabs-copyeditor/.osiolabs-lintrc.yml"
```

## Tutorial copy review

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
vale --config="path/to/osiolabs-copyeditor/vale/.vale.ini" content/
```

### Modifying rules

You can read more about adding or modifying the existing copy review rules here: https://errata-ai.github.io/vale/styles/
