"use strict";
function getBooks(booktitle) {
    var from = rxjs.from;
    var _a = rxjs.operators, map = _a.map, switchMap = _a.switchMap, tap = _a.tap;
    var apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';
    var promise = fetch(apiurl + booktitle + '&maxResults=18')
        .then(function (res) { return res.json(); });
    //.then(books => console.log(books));
    return from(promise)
        .pipe(tap(function (data) { return showTotal(data.items.length); }), switchMap(function (data) { return from(data.items || []); }), map(function (ele) {
        var book = {
            title: ele.volumeInfo.title,
            categories: ele.volumeInfo.categories,
            authors: ele.volumeInfo.authors,
            description: ele.volumeInfo.description,
            thumbnail: ele.volumeInfo.imageLinks.thumbnail
        };
        return book;
    }));
    //.subscribe((book: Book) => displayBook(book));
}
function displayBook(book) {
    var bookTpl = "\n        <div class=\"card mb-4 shadow-sm\">   \n            <img src=\"" + book.thumbnail + "\" title=\"" + book.title + "\"  alt=\"" + book.title + "\">\n            <div class=\"card-body\">\n                <h5>" + book.title + "</h5>\n                <p class=\"card-text\"></p>\n                <div class=\"d-flex justify-content-between align-items-center\">\n                    <div class=\"btn-group\">\n                        <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\">View</button>\n                        <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\">Edit</button>\n                    </div>\n                    <small class=\"text-muted\">9 mins</small>  \n                </div>\n            </div>\n        </div>";
    var div = document.createElement('div');
    div.setAttribute('class', 'col-md-2');
    div.innerHTML = bookTpl;
    var books = document.querySelector('#books');
    if (books) {
        books.appendChild(div);
    }
}
function cleanBookTpl() {
    //alert('clean'); 
    var books = document.querySelector('#books');
    if (books) {
        books.innerHTML = '';
    }
}
function searchBooks() {
    var searchEle = document.querySelector('#search');
    var fromEvent = rxjs.fromEvent;
    var _a = rxjs.operators, filter = _a.filter, map = _a.map, switchMap = _a.switchMap, debounceTime = _a.debounceTime, tap = _a.tap;
    if (searchEle) {
        fromEvent(searchEle, 'keyup')
            .pipe(map(function (ele) { return ele.target.value; }), filter(function (ele) { return ele.length > 2; }), debounceTime(1000), tap(function () { return cleanBookTpl(); }), switchMap(function (ele) { return getBooks(ele); }));
        //.subscribe((ele :string) => alert(ele));
        //.subscribe((book: Book) => displayBook(book));
        //getBooks('game of thrones');
    }
}
function showTotal(total) {
    var found = document.querySelector('#found');
    if (found) {
        found.textContent = '' + total;
    }
}
searchBooks();
function searchButtonClicked() {
    var books = document.querySelector('#search');
    if (books) {
        getBooks(books.value).subscribe(function (book) { return displayBook(book); });
    }
}
