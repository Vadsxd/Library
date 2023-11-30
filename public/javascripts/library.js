const deleteBook = (bookId) => {
    if (confirm('Confirm to delete book?'))
        fetch(`/library/${bookId}`, { method: 'DELETE' }).then(() => window.location.reload());
}

const sortBooks = async () => {
    const select = document.getElementById("select");
    const selectVal = select.options[select.selectedIndex].value;
    let res;

    switch (selectVal) {
        case "Default":
            fetch(`/library`, { method: 'GET' }).then(() => window.location.reload());
            break;
        case "Availability":
            res = await fetch(`/library/sortByAvailability`, {method: 'GET'});
            var { books } = await res.json();
            break;
        case "Date of Return":
            res = await fetch(`/library/sortByReturnDate`, {method: 'GET'});
            var { books } = await res.json();
            break;
        case "Date of Release":
            res = await fetch(`/library/sortByReleaseDate`, {method: 'GET'});
            var { books } = await res.json();
            break;
        case "Author":
            res = await fetch(`/library/sortByAuthor`, {method: 'GET'});
            var { books } = await res.json();
            break;
        case "Title":
            res = await fetch(`/library/sortByTitle`, {method: 'GET'});
            var { books } = await res.json();
            break;
    }

    const tableBody = document.getElementById("table-body");
    while(tableBody.hasChildNodes()) {
        tableBody.removeChild(tableBody.firstChild);
    }

    books.forEach((book) => {
        const tr = tableBody.insertRow();
        const title = tr.insertCell();
        const author = tr.insertCell();
        const availability = tr.insertCell();
        const releaseDate = tr.insertCell();
        const returnDate = tr.insertCell();
        const action = tr.insertCell();
        title.innerText = book.title;
        author.innerText = book.author;
        availability.innerText = book.availability;
        releaseDate.innerText = book.releaseDate;
        returnDate.innerText = book.returnDate;
        action.innerHTML = '<button class="action_button" onClick="takeBook('+book.id+')" id="take-but">Take</button>\n' +
            '<button class="action_button" onClick="deleteBook('+book.id+')" id="del-but">Delete</button>\n' +
            '<button class="action_button" onClick="bookInfo('+book.id+')" id="info-but">Info</button>'
    });
}

const openUserModal = async (id) => {
    const res = await fetch(`/library/user/${id}`, { method: 'POST' });
    const { user, books } = await res.json();

    const userModal = document.getElementById('user-dialog');
    userModal.getElementsByTagName('span')[0].textContent = user;
    const ol = userModal.getElementsByTagName('ol')[0];
    ol.innerHTML = '';
    books.forEach((book) => {
        const li = document.createElement('li');
        li.innerText = `${book.title} (${book.returnDate}) by ${book.author}`;
        ol.appendChild(li);
    });

    document.getElementById('user-dialog').showModal();
};

const bookInfo = (id) =>
    fetch(`/book/${id}`, {method: 'GET'}).then(() => window.location.href = `/book/${id}`);

const takeBook = (id) =>
    fetch(`/library/takeBook/${id}`, {method: 'POST'}).then(() => window.location.reload());

const returnBook = (id) =>
    fetch(`/library/returnBook/${id}`, {method: 'POST'}).then(() => window.location.reload());

const logout = () =>
    fetch('/auth/logout', {method: 'POST'}).then(() => window.location.href = '/auth');

const toAddBook = () =>
    fetch('/addBook', {method: 'GET'}).then(() => window.location.href = '/addBook');

const closeDialog = (el) =>
    el.closest('dialog').close();