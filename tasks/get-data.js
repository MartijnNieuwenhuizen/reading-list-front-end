import gulp from 'gulp';
import fetch from 'node-fetch';
import fs from 'fs';
import { getData as config } from '../config';
import { createClient } from 'http';

/**
 * @param {array} data - Array of articles stored as object literals
 * @param {string} dest - URL path to destination of file
 */
function storeArticlesListData(data, dest) {
    const currentFileContents = JSON.parse(fs.readFileSync(dest, 'utf8'));
    currentFileContents.articles = data.reverse();
    fs.writeFileSync(dest, JSON.stringify(currentFileContents));
}

/**
 *
 * @param {string} url
 * @param {string} dest
 */
async function fetchDataFromServer(url, dest) {
    const response = await fetch(url);
    const body = await response.json();

    storeArticlesListData(body, dest);
}

/**
 * Task: Get data from server
 */
gulp.task('get-data', () => {
    fetchDataFromServer(config.url, config.dest);
});
