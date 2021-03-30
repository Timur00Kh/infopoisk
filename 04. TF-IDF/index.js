const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const tfIdf = require("./TFIDF");

const tokens = fs.readFileSync(
    './tokens.txt',
    {encoding: 'UTF-8'}
    ).split('\n');

let RESULT = 'word tf idf tf-idf\n';
console.log(RESULT);
const DIGITS = 10;


(async () => {
    for (let i = 0; i < tokens.length; i++) {
        const result = await getRank('./parsed_sites', tokens[i])
        console.log(`${i + 1}/${tokens.length} ${tokens[i]} ${result.tf.toFixed(DIGITS)} ${result.idf.toFixed(DIGITS)} ${result.tfidf.toFixed(DIGITS)}`)
        RESULT += `${tokens[i]} ${result.tf.toFixed(DIGITS)} ${result.idf.toFixed(DIGITS)} ${result.tfidf.toFixed(DIGITS)}` + '\n'
    }

    fs.writeFileSync('./tfidf.txt', RESULT);
})()

function getRank(path, term) {
    return new Promise((resolve, reject ) => {
        tfIdf.getRank(path, term, function (err, docRank) {
            if (err) {
                reject(err);
            }
            resolve(docRank);
        });
    })
}
