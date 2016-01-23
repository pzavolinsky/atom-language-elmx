# language-elm Atom package

Syntax highlighting, auto-completion and lint for the Elm language extended with embedded HTML ([elmx](https://github.com/pzavolinsky/elmx)).

Note: while this package provides standalone support for [elmx](https://github.com/pzavolinsky/elmx) files, additional functionality such as auto-completion and linting require additional packages. If these packages are not installed this functionality will be disabled.

## Installation

1. `apm install language-elmx`
1. [Install `language-elm`](https://atom.io/packages/language-elm) - required for auto-completion.
1. [Install `linter-elm-make`](https://atom.io/packages/linter-elm-make) - required for linting and in-place compilation.

## Credits

The `elmx` grammar in this package is heavily inspired in the `jsx` grammar from the [react](https://atom.io/packages/react) package and the `html` grammar from the [language-html](https://atom.io/packages/language-html) package.

Linting is provided thanks to [linter-elm-make](https://atom.io/packages/linter-elm-make), this package just pre-compiles the input `.elmx` into `.elm` and then updates the lint results.

Auto-completion is provided thanks to [language-elm](https://atom.io/packages/language-elm), this package just proxies the call to adjust file names.
