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
interface BookItem{
    volumeInfo: VolumeInfo
    id: string
}
interface Book {
    title: string
    description: string
    authors: [ ]
    categories:[]
    thumbnail : string
}


function getBooks(booktitle: string){

    const {from } = rxjs;

    const {map, switchMap, tap} = rxjs.operators;

    let apiurl ='https://www.googleapis.com/books/v1/volumes?q=';

    const promise = fetch(apiurl + booktitle)
    .then(res => res.json());
    //.then(books => console.log(books));

    return from(promise)
    .pipe(

        switchMap((data:GoogleBook) => from(data.items || [])),

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
        //tap((book: Book) => console.log(book))
    )
    .subscribe((book: Book) => displayBook(book));
}

function displayBook(book: Book){
    const bookTpl = `
        <div class="card mb-4 shadow-sm">   
            <img src="${book.thumbnail}" title="${book.title}"  alt="${book.title}">
            <div class="card-body">
                <h5>${book.title}</h5>
                <p class="card-text"></p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-muted">9 mins</small>  
                </div>
            </div>
        </div>`;

    const div = document.createElement('div');
    div.setAttribute('class','col-md-3');
    div.innerHTML = bookTpl;

    const books = document.querySelector('#books');

    if (books) {
        
        books.appendChild(div);
        
    }

}

function searchBooks(){
    
    const searchEle = document.querySelector('#search');

     const {fromEvent } = rxjs;
     const { filter, map, switchMap} = rxjs.operators;

    if(searchEle){
        
        fromEvent(searchEle, 'keyup')
        .pipe(
            map((ele:any) => ele.target.value),

            filter((ele:string) => ele.length >2 ),

            switchMap((ele:string) => getBooks(ele))
            )

        //.subscribe((ele :string) => alert(ele));
        .subscribe((book: Book) => displayBook(book));

   
    //getBooks('game of thrones');

    }
}
searchBooks();