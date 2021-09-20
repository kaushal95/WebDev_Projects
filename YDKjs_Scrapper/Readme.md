

# You Don't Know Javascript Scrapper

This project scrapes all the books of first edition of YDKjs from github repository
and stores them in pdf format.


## How it Works

Using the Github Repo Link of [1st Edition page](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) it searches for all the books in first edition then retreives content of each Chapter of a particular Book.
Further it stores each books content in a separate pdf named with name of the book. 

### Made with the help of

- Javascript
- Puppeteer
- Nodejs
- cheerio, fs, path and md-to-pdf npm libraries<br>

**Dependency on md-to-pdf package to convert the content into pdf**
