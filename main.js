const { argv } = require('node:process');
const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');

async function main() {
    if (argv.length < 3) {
        console.log('Please give a URL as Command Line Argument');
        return;
    } else if (argv.length > 3) {
        console.log('Too many arguments provided');
        return;
    } else {
        const baseURL = argv[2];
        console.log(`Crawler starting at: ${baseURL}`);
        let pages = await crawlPage(baseURL, baseURL, {});
        printReport(pages);
    }
}

main()
