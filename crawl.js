const { JSDOM } = require('jsdom');

function normalizeURL(url) {
    const myURL = new URL(url);
    return myURL.hostname + myURL.pathname.replace(/\/$/, "");
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const htmlLinks = dom.window.document.querySelectorAll('a');
    for (let i = 0; i < htmlLinks.length; i++) {
        let link = htmlLinks[i].href;
        if (link[0] === '/') {
            try {
                urls.push(new URL(link, baseURL).href);
            } catch (err) {
                console.log('${err.message}: ${href}')
            }
        } else {
            try {
                urls.push(new URL(link).href);
            } catch (err) {
                console.log('${err.message}: ${href}')
            }
        }
    }
    return urls
}

async function crawlPage(currentURL) {
    try {
        const response = await fetch(currentURL);
        if (response.status >= 400) {
            console.log(`Error connecting to ${currentURL}`);
            return;
        } else if (!response.headers.get('Content-Type').includes('text/html')) {
            console.log(response.headers.get('Content-Type'));
            console.log(`Error: ${currentURL} is not a text/html content website`);
            return;
        } 
        const html = await response.text();
        console.log(html);
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
}
