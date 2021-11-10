function getBooks(booktitle) {
    var apiurl = 'https://www.googleapis.com/books/v1/volumes?q=';
    fetch(apiurl + booktitle)
        .then(function (res) { return res.json(); })
        .then(function (books) { return console.log(books); });
}
getBooks('game of thrones');
