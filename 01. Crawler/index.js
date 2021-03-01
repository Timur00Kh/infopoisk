const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const axios = require('axios')
const rimraf = require('rimraf')
const path = require('path')

const filePath = argv.f ||  argv.file;

if (!filePath) {
    throw new Error('Вы не ввели файл!?')
}

const linksText = fs.readFileSync(filePath, { encoding: 'UTF-8' });
const links = linksText.split('\n');
const outDir = 'out';



(async () => {

    if (fs.existsSync(outDir)) {
        try {
            await new Promise((resolve, reject) => {
                rimraf(path.normalize(outDir), () => resolve())
            })
        } catch(e) {
            console.error(e)
        }
    }

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    let indexTxt = '';
    let index = 0;
    for (let i = 0; i < links.length - 1; i++) {
        const url = `http://${links[i]}`;
        const fileName = `${('000'+index).slice(-3)}.txt`;
        try {

            let { data } = await axios.get(url);

            fs.writeFileSync(path.join(outDir, fileName), data);
            indexTxt += `${fileName} - ${url}\n`
            index++;
        } catch (e) {
            console.error(i, 'error', url)
        }
    }
    fs.writeFileSync(path.join(outDir, 'index.txt'), indexTxt);
})()



function getLinks(text) {
    return text.split('\n').map(e => e.split('\t')[1])
}

