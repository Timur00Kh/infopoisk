const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const path = require('path')
const sanitizeHtml = require("sanitize-html");
const rimraf = require('rimraf')

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const WordNet = require('node-wordnet');
const wordnet = new WordNet({ dataDir: path.join(__dirname, 'rwn3')})
// const wordnet = new WordNet();

console.log(path.join(__dirname, 'rwn3'))




const {DIR, OUT_DIR = 'out'} = argv;
const filesPaths = fs.readdirSync(DIR);
let Tokens = [];

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR)
} else {
    throw new Error(`Directory "${OUT_DIR}" already exists`)
}

for (let i = 0; i < filesPaths.length; i++) {
    try{
        const text = getText(fs.readFileSync(path.join(DIR, filesPaths[i])))
        Tokens = [...Tokens, ...tokenizer.tokenize(text)]
    } catch (e) {
        console.error(e)
    }
}

fs.writeFileSync(path.join(OUT_DIR, 'tokens.txt'), Tokens.join('\n'));
let Lemmas = '';
Tokens.forEach((token) => {
    wordnet.lookup(token, function(results) {
        Lemmas += token

        results.forEach(function(result) {
            if (result) {
                Lemmas += ' ' + result.lemma
            }
        });
        Lemmas += ' \n';

    });
})


function getText(html) {
    return sanitizeHtml(html, {
        allowedTags: []
    })
        .replace(/[\n\t]/g, '')
        .replace(/ +/g, ' ')
}

