const inputTitle = document.getElementById('inputBookTitle');
const inputAuthor = document.getElementById('inputBookAuthor');
const inputYear = document.getElementById('inputBookYear');
const inputBookIsComplete = document.getElementById('inputBookIsComplete');
const inputIsComplete = document.getElementById('inputIsComplete')
const submitAction = document.getElementById('inputBook');
const searchAction = document.getElementById('searchBook');
const inputSearch = document.getElementById('searchBookTitle')
const bookItem = document.querySelectorAll('.book_item');

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

inputBookIsComplete.addEventListener('change', function(){
  if(this.checked) {
    inputIsComplete.innerHTML = 'Selesai dibaca';
  } else{
    inputIsComplete.innerHTML = 'Belum selesai dibaca';
  }
});

submitAction.addEventListener("submit", function (event) {
  event.preventDefault();
  addBook();
});

searchAction.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchBook = inputSearch.value.toLowerCase();
  const bookList = document.querySelectorAll('.book_item > h3');
  for (buku of bookList) {
    if (searchBook !== buku.innerText.toLowerCase()) {
      buku.parentElement.style.display = "none";
    } else {
      buku.parentElement.style.display = "block";
    }
  }   
});



function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return{
    id, 
    title, 
    author, 
    year, 
    isComplete
  }
} 


function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function addBook() {
  const id = generateId();
  const title = inputTitle.value;
  const author = inputAuthor.value;
  const year = inputYear.value;
  const isComplete = inputBookIsComplete.checked;
  
  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);
  
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
};

function makeBook(bookObject) {
  const {id, title, author, year, isComplete} = bookObject;
  
  const textTitle = document.createElement('h3');
  textTitle.innerText = title;
  
  const textAuthor = document.createElement('p');
  textAuthor.innerText = `Penulis: ${author}`;
  
  const textYear = document.createElement('p');
  textYear.innerText = `Tahun: ${year}`;
  
  const container = document.createElement('article');
  container.classList.add('book_item');
  container.setAttribute('id', `book-${id}`)
  container.append(textTitle, textAuthor, textYear)
  
  if (isComplete) {
    const incompleteButton = document.createElement('button');
    incompleteButton.classList.add('green');
    incompleteButton.innerText = 'Selesai dibaca';
    incompleteButton.addEventListener('click', function () {
      incompleteBook(id);
    });
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = 'Hapus buku';
    removeButton.addEventListener('click', function () {
      removeBook(id);
    });
    
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action')
    actionContainer.append(incompleteButton, removeButton);
    container.append(actionContainer);
  } else {
    const completeButton = document.createElement('button');
    completeButton.classList.add('green');
    completeButton.innerText = 'Belum selesai dibaca';
    completeButton.addEventListener('click', function () {
      completeBook(id);
    });
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('red');
    removeButton.innerText = 'Hapus buku';
    removeButton.addEventListener('click', function () {
      removeBook(id);
    });
    
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action')
    actionContainer.append(completeButton, removeButton);
    container.append(actionContainer); 
  }
  return container
}

function completeBook(bookId) {
  const bookTarget = findBook(bookId)
  
  if (bookTarget == null) return;
  
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function incompleteBook(bookId) {
  const bookTarget = findBook(bookId)
  
  if (bookTarget == null) return;
  
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function removeBook(bookId) {
  const bookTarget = findBook(bookId);
  const bookIndex = books.indexOf(bookTarget);
  
  if (bookIndex == -1) return;
  
  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
      }
  }
});
document.addEventListener('DOMContentLoaded', function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
}); 

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed); 
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
} 




  