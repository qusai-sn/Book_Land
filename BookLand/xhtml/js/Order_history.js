 document.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:44301/api/BookLibrary')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('book-table-body');
            data.forEach(book => {
                const formats = book.format.split(';');

                const row = document.createElement('tr');
                if (formats.includes('PDF')) {
                    // Adding an anchor link for the PDF icon
                    row.innerHTML = `
                    <td><img src="${book.imageUrl}" alt="${book.title}" style="width: 100px;"/></td>
                    <td>${book.title}</td>
                    <td>$${book.price}</td>
                    <td>${book.format} 
                        <a href="pdfViewer.html?isbn=${book.isbn}">
                            <i class="fas fa-file-pdf" id="pdf_icon"></i>
                        </a>
                    </td>
                    <td>$${book.totalPrice}</td>
                `;
                    tableBody.appendChild(row);
                } else {
                    row.innerHTML = `
                    <td><img src="${book.imageUrl}" alt="${book.title}" style="width: 100px;"/></td>
                    <td>${book.title}</td>
                    <td>$${book.price}</td>
                    <td>${book.format}</td>
                    <td>$${book.totalPrice}</td>
                `;
                    tableBody.appendChild(row);
                }
            });
        })
        .catch(error => console.error('Error fetching books:', error));
});
 