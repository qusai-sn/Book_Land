document.addEventListener("DOMContentLoaded", function () {
    let timeout = null;

    // Add event listener to the search button
    document.getElementById("searchButton").addEventListener("click", () => {
        console.log("Button clicked!"); // Test to see if button click works
        searchBook(true); // Call search function immediately when button is clicked
    });

    // Ensure the searchBook function is in the global scope
    window.searchBook = function searchBook(isButtonClick = false) {
        clearTimeout(timeout);

        if (isButtonClick) {
            console.log("Search triggered by button click."); // Test to confirm the search is triggered by button click
            performSearch();
        } else {
            timeout = setTimeout(performSearch, 300); // Delay search on typing for better UX
        }
    };

    function performSearch() {
        const bookTitle = document.getElementById("bookSearch").value.trim();

        console.log("Performing search for:", bookTitle); // Log the search value for testing

        if (bookTitle) {
            const apiUrl = `https://localhost:7198/api/Books/bynameBooks/${encodeURIComponent(
                bookTitle
            )}`;
            console.log("API URL:", apiUrl); // Log the API URL for testing

            fetch(apiUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((books) => {
                    console.log("API response data:", books); // Log the API response data for testing
                    displayResults(books); // Display results
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error fetching data",
                        text: "There was an error fetching the book data. Please try again later.",
                        confirmButtonText: "OK",
                    });
                });
        } else {
            document.getElementById("results").innerHTML = "";
            document.getElementById("results").style.display = "none";
        }
    }

    function displayResults(books) {
        // تحقق ما إذا كانت البيانات عبارة عن كائن أو مصفوفة
        if (Array.isArray(books)) {
            if (books.length > 0) {
                let booksHTML = books.map((book) => generateBookHTML(book)).join("");
                showBooksInModal(booksHTML);
            } else {
                showNoBooksFound();
            }
        } else {
            // في حال كان الكائن مفردًا وليس مصفوفة
            let booksHTML = generateBookHTML(books);
            showBooksInModal(booksHTML);
        }
    }

    function generateBookHTML(book) {
        return `
      <div style="text-align:left; margin-bottom: 15px;">
        <img src="${book.imageUrl
            }" alt="${book.title}" style="width:65px; height:auto;" /><br/>
        <span>Title:</span> ${book.title} <br/>
        <span>Author:</span> ${book.author} <br/>
        <span>Publisher:</span> ${book.publisher} <br/>
        <span>Price:</span> $${book.price} <br/>
        <span>Discount:</span> ${book.discountPercentage}% <br/>
        <span>Description:</span> ${book.description} <br/>
        <span>Rating:</span> ${book.rating}/5 <br/><br/>
        <span>    <a href="javascript:void(0);" onclick="addToCart(${book.id
            }, '${book.format || "PDF"}', ${book.price || 0},'${book.imageUrl}')" id="add-to-cart-button" class="btn btn-secondary btnhover btnhover2">
                                <i class="flaticon-shopping-cart-1 m-r10"></i> Add to cart
                            </a></span> <br/><br/>

      </div>
    `;
    }

    function showBooksInModal(booksHTML) {
        Swal.fire({
            
            title: "Books Found",
            html: booksHTML,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: "OK",
            width: "40%", // Set width for better display
            height: "10%", // Adjust height for a simpler display
            customClass: {
                popup: "swal-center",
            },
            position: "center", // Ensure it's centered
        });
    }

    function showNoBooksFound() {
        Swal.fire({
            icon: "info",
            title: "No books found",
            text: "No books were found with the specified title.",
            confirmButtonText: "OK",
        });
    }
});