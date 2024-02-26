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

async function crawlPage(baseURL, currentURL, pages) {
    try {
        // If the current URL is not on the same domain as the base URL just return pages
        if (new URL(baseURL).hostname !== new URL(currentURL).hostname) {
            return pages;
        }
        // If the URL already exists in the pages dict, just increment the count and return
        const normalizedURL = normalizeURL(currentURL);
        if (normalizedURL in pages) {
            pages[normalizedURL]++;
            return pages;

        // If it doesn't already exist, create it's pages entry
        } else {
            // If the current URL is the base URL set it to 0 
            // because we start here without an actual link leading here
            if (currentURL === baseURL) {
                pages[normalizedURL] = 0;
            } else {
                pages[normalizedURL] = 1;
            }
        }

        // Show crawler progress in console
        console.log(`Crawling: ${normalizedURL}`)
        // Start to get all URLs from the response html
        const response = await fetch(currentURL);
        if (response.status >= 400) {
            console.log(`Error connecting to ${currentURL}`);
            return pages;
        } else if (!response.headers.get('Content-Type').startsWith('text/html')) {
            console.log(response.headers.get('Content-Type'));
            console.log(`Error: ${currentURL} is not a text/html content website`);
            return pages;
        } 
        const html = await response.text();
        const urls = getURLsFromHTML(html, baseURL);
        for (const url of urls) {
            pages = await crawlPage(baseURL, url, pages);
        }
        return pages;
    } catch (err) {
        console.log(err.message);
        // Still return the pages object, so that atleast it will return something
        return pages;
    }
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
}
