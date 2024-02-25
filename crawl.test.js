const { normalizeURL, getURLsFromHTML } = require('./crawl.js');
const { sortDict } = require('./report.js');
const { test, expect } = require('@jest/globals');

test('normalizeURL base', () => {
    const input = normalizeURL('https://blog.boot.dev/path');
    const expected = 'blog.boot.dev/path';
    expect(input).toBe(expected);
});

test('normalizeURL backslash', () => {
    const input = normalizeURL('https://blog.boot.dev/path/');
    const expected = 'blog.boot.dev/path';
    expect(input).toBe(expected);
});

test('normalizeURL http', () => {
    const input = normalizeURL('http://blog.boot.dev/path');
    const expected = 'blog.boot.dev/path';
    expect(input).toBe(expected);
});

test('normalizeURL capitals', () => {
    const input = normalizeURL('https://BLOG.boot.dev/path/');
    const expected = 'blog.boot.dev/path';
    expect(input).toBe(expected);
});

test('getURLsFromHTML relative URL', () => {
    const htmlBody = '<a href="/relativetest">Hello</a>'
    const url = 'https://test.com/discardme'
    const input = getURLsFromHTML(htmlBody, url);
    const expected = ['https://test.com/relativetest'];
    expect(input).toEqual(expected);
});

test('getURLsFromHTML absolute URL', () => {
    const htmlBody = '<a href="https://absolute.com/test">Hello</a>'
    const url = 'https://test.com/discardme'
    const input = getURLsFromHTML(htmlBody, url);
    const expected = ['https://absolute.com/test'];
    expect(input).toEqual(expected);
});

test('getURLsFromHTML multiple', () => {
    const htmlBody = '<a href="/relativetest">Hello</a><a href="https://absolute.com/test">Hello</a>'
    const url = 'https://test.com/discardme'
    const input = getURLsFromHTML(htmlBody, url);
    const expected = ['https://test.com/relativetest', 'https://absolute.com/test'];
    expect(input).toEqual(expected);
});

test('getURLsFromHTML handle error', () => {
    const htmlBody = '<a href="error">Hello</a>'
    const url = 'https://test.com/discardme'
    const input = getURLsFromHTML(htmlBody, url);
    const expected = [];
    expect(input).toEqual(expected);
});

test('sortDict test', () => {
    const input = sortDict({'third': 3, 'second': 2, 'first': 1});
    const expected = {'first': 1, 'second': 2, 'third': 3};
    expect(input).toEqual(expected);
});
