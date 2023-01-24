# osiolabs-copy editor

This repository contains a set of tools used for reviewing, and linting, Osio Labs content.

## Usage

_Note:_ You shouldn't use this project directly, rather, you should include it as a dependency for a content repo, and run the commands from within that repo. For details about adding this to a content repo see the installation section below.

Before you can use the tools you need to install all the dependencies:

1. Run `npm install` in the root directory of the content repo
1. Install Vale. https://vale.sh/docs/vale-cli/installation/

### Tutorial linter (remark-lint)

The linter enforces Markdown and other objective formatting styles. Violating linter styles should be considered an error, and should be fixed before the content is published.

The linter consists of a configuration file for remark-cli, a custom remark plugin for handing Osio Labs specific tags like `[# summary #]`. And some instructions about how to use them.

### Use the linter

- `npm run lint path/to/file.md`: Lint an individual file.
- `npm run lint:all`: Lint all files in the content repo.
- `npm run lint:fix path/to/file.md`: Automate fixing as many linting errors in a file as possible. Note: this will not get all of them.

### Tutorial review (Vale)

This set of rules is intended to provide recommendations for improving a tutorial's content. As well as checking for things like `Drupal` vs. `drupal`. Violating the copy review styles should be considered a warning not an error, and should at least be reviewed before the content is published. There are likely to be many exceptions to these rules.

For now we provide a set of vale rules that implement the Osio Labs style guide, and provide other copy editing recommendations. You'll need to install [vale](https://vale.sh/docs/vale-cli/installation/) to use them.

### Use the review tools

- `npm run review path/to/file.md`: Output a Vale review for a specific file.
- `npm run review:all`: Output a Vale review for all files in a content repo.

## HTML exporter

The /to-html.js script can be used to export tutorial markdown files to HTML. It is currently intended used to export Drupalize.Me content for use on Thinkific.

Example:

```sh
npm run export-html path/to/file.md
```

It can convert most of our special tags like `[# summary #]` and `[# steps #]` to HTML. And handles transforming links and video embeds for Thinkific.

When a tutorial links to another .md file in the same repository this will open the .md file that the link points to and look for a thinkific URL tag in the linked tutorial. If it finds one, then it will replace the link in the original tutorial with Thinkific link. If a thinkific link can not be found then the anchor tag is stripped from the link and a warning is output.

Example thinkific URL tag:

```markdown
<!-- thinkific-url:https://example.com/thinkific-thing -->
```

If a tutorial .md file contains a video embed like:

```markdown
[# video #]
id: 1235
title: Video title
[# endvideo #]
```

And a special block like the following anywhere in the .md file:

```markdown
<!-- thinkific-video-embed -->
<p>EXAMPLE EMBED CODE STORED HERE</p>
<!-- /thinkific-video-embed -->
```

The content of the `[# video #]` tag will be replaced with the content of the `<!-- thinkific-video-embed -->` block.

## Install copyeditor into a content repo

For most use-cases you'll want to add this as a dependency to whichever content repo you want to use the tools with. And then execute them using `npm run`.

Note: Using the review tools requires that you have vale installed. See below.

```sh
npm install https://github.com/OsioLabs/osiolabs-copyeditor
```

Then add something like the following to your projects _package.json_ file:

```json
"scripts": {
  "lint": "remark --rc-path=./node_modules/osiolabs-copyeditor/.remarkrc.yml",
  "lint:all": "remark --rc-path=./node_modules/osiolabs-copyeditor/.remarkrc.yml content/",
  "lint:fix": "remark --output --rc-path=./node_modules/osiolabs-copyeditor/.remarkrc.yml",
  "review": "vale --config='./node_modules/osiolabs-copyeditor/.vale.ini'",
  "review:all": "npm run review content/"
},
```

## Modifying rules

You can read more about adding or modifying the existing Vale rules here: https://vale.sh/docs/topics/styles/
