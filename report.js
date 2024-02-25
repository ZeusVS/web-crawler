function printReport(pages) {
    console.log('Report is starting');
    const sortedPages = sortDict(pages);
    for (const url in sortedPages) {
        const count = sortedPages[url];
        console.log(`${count} internal links to ${url}`);
    }
}

function sortDict(pages) {
    let sortable = [];
    for (const url in pages) {
        sortable.push([url, pages[url]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    let pagesSorted = {};
    for (const item of sortable) {
        pagesSorted[item[0]] = item[1];
    }
    return pagesSorted;
}

module.exports = {
    printReport,
    sortDict,
}
