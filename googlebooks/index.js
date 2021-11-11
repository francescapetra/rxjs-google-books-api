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
    }), tap(function (book) { return console.log(book); }))
        .subscribe(function (data) { return data; });
}
getBooks('game of thrones');
