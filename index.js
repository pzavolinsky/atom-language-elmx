'use babel';

const path = require('path');
const fs = require('fs');
const R = require('ramda');
const parse = require('elmx');

// === CONFIG ============================================================== //
const config = {
  elmxCompile: {
    title: 'Compile `file.elmx` into `file.elm` in the same directory and retain the compiled file.',
    description: 'If set to `true`, will create a `.elm` file in the same directory where `.elmx` is and will not remove the `.elm` file after linting. Otherwise ti will create a temp file while linting and then remove the file.',
    type: 'boolean',
    default: true
  }
};

// === AUTOCOMPLETE========================================================= //
const langPath = atom.packages.resolvePackagePath('language-elm');
const autocompleteProviders = langPath && require(langPath).provide() || [];

// === LINTER ============================================================== //
const linterPath = atom.packages.resolvePackagePath('linter-elm-make');
const elmLinter = linterPath && require(linterPath+'/lib/linter-elm-make.js');

const mapError = R.curry((filePath, error) => R.merge(error, {
  filePath,
  range: [
    [error.range[0][0], 0],
    [error.range[1][0], 80]
  ]
}));

const removeFile = R.curry((filePath, arg) => {
  fs.unlinkSync(filePath);
  return arg;
});

module.exports = {
  config,
  activate() {
    if (!elmLinter) return;
    elmLinter.activate();
  },
  provideLinter() {
    if (!elmLinter) return;

    const linter = elmLinter.provideLinter();
    return {
      grammarScopes: ['source.elm.elmx'],
      scope: linter.scope,
      lintOnFly: linter.lintOnFly,
      lint(textEditor) {

        const filePath = textEditor.getPath();

        const elmxContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        const elmContent = parse(elmxContent);

        const retain = atom.config.get('language-elmx.elmxCompile');
        const prefix = retain
          ? ''
          : '.__lint__.';

        const newFilePath = path.join(
          path.dirname(filePath),
          prefix + path.basename(filePath, '.elmx') + '.elm');

        const deleteFile = retain
          ? a => a
          : removeFile(newFilePath);

        fs.writeFileSync(newFilePath, elmContent);

        try {
          return linter
            .lint({ getPath: () => newFilePath })
            .then(rs => rs.map(mapError(filePath)))
            .then(deleteFile, deleteFile);
        }
        catch (e) {
          deleteFile();
          throw e;
        }
      }
    };
  },
  provide() {
    return R.map(
      R.flip(R.merge)({ selector: '.source.elm.elmx' }),
      autocompleteProviders);
  }
};

