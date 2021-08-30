const puppeteer = require('puppeteer');
const fs = require('fs');

async function robo() {
    console.log('Inicializando o robozinho');

    const base_link = 'http://www.agenda2030.com.br/ods/';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    let all_metas = { 'targets': [] }

    for (let i = 1; i <= 17; i++) {
        let link_ods = base_link + i + '/';

        console.log('Acessando página ' + link_ods);
        await page.goto(link_ods);

        all_metas.target = all_metas.target.concat(await page.evaluate(() => {
            let metas_td = document.getElementsByClassName('metas-text-padding');

            let metas = [];
            for (let item of metas_td) {
                let meta_id = item.children[0].textContent;
                let meta_text = item.children[1].textContent;

                metas.unshift({ 'id': meta_id, 'description': meta_text });
            }

            return metas;
        }));
    }

    await browser.close();

    let json = JSON.stringify(all_metas);
    let file = './metas_ods.json';

    console.log('Salvando os dados em ' + file);
    fs.writeFile(file, json, 'utf-8', function (err) {
        if (err) return console.log(err);
    });

    console.log('Finalizando por hoje!');
}

robo();
