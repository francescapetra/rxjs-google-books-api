declare const rxjs: any;
interface GoogleBook{

    items : [],
    totalItems: number;
    kind:string;

}
interface VolumeInfo {

    authors: []
    description: string
    imageLinks:BookThumbnails
    infoLink: string
    language: string
    previewLink: string
    title: string
    categories:[]
}
interface BookThumbnails{
    smallThumbnail: string
    thumbnail: string
}
interface Book {
    title: string
    description: string
    authors: [ ]
    categories:[]
    thumbnail : string
}
interface BookItem{
    volumeInfo: VolumeInfo
    id: string
}


function getBooks(booktitle: string){

    const {from } = rxjs;

    const {map, switchMap, tap} = rxjs.operators;

    let apiurl ='https://www.googleapis.com/books/v1/volumes?q=';

    const promise = fetch(apiurl + booktitle)
    .then(res => res.json());
    //.then(books => console.log(books));

    from(promise)
    .pipe(

        switchMap((data:GoogleBook) => from(data.items)),

        map( (ele:BookItem) => {
            const book:Book = {
                title : ele.volumeInfo.title,
                categories: ele.volumeInfo.categories,
                authors : ele.volumeInfo.authors,
                description: ele.volumeInfo.description,
                thumbnail: ele.volumeInfo.imageLinks.thumbnail
            };
            return book;
            }
        ),
        tap((book: Book) => console.log(book))
    )
    .subscribe((data: GoogleBook) =>  data);
}

getBooks('game of thrones');