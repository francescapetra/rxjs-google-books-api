"use strict";
function getBooks(booktitle) {
    var from = rxjs.from;
    var _a = rxjs.operators, map = _a.map, switchMap = _a.switchMap, tap = _a.tap;
    var apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';
    var promise = fetch(apiurl + booktitle)
        .then(function (res) { return res.json(); });
    //.then(books => console.log(books));
    from(promise)
        .pipe(switchMap(function (data) { return from(data.items); }), map(function (ele) {
        var book = {
            title: ele.volumeInfo.title,
            categories: ele.volumeInfo.categories,
            authors: ele.volumeInfo.authors,
            description: ele.volumeInfo.description,
            thumbnail: ele.volumeInfo.imageLinks.thumbnail
        };
        return book;
    }))
        .subscribe(function (book) { return displayBook(book); });
}
function displayBook(book) {
    var bookTpl = "\n        <div class=\"card mb-4 shadow-sm\">   \n            <img src=\"" + book.thumbnail + "\" title=\"" + book.title + "\"  alt=\"" + book.title + "\">\n            <div class=\"card-body\">\n                <h5>" + book.title + "</h5>\n                <p class=\"card-text\"></p>\n                <div class=\"d-flex justify-content-between align-items-center\">\n                    <div class=\"btn-group\">\n                        <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\">View</button>\n                        <button type=\"button\" class=\"btn btn-sm btn-outline-secondary\">Edit</button>\n                    </div>\n                    <small class=\"text-muted\">9 mins</small>  \n                </div>\n            </div>\n        </div>";
    var div = document.createElement('div');
    div.setAttribute('class', 'col-md-3');
    div.innerHTML = bookTpl;
    document.querySelector('#books').appendChild(div);
}
getBooks('il conte di montecristo');
