// // جلب userId من localStorage أو تعيين null إذا لم يكن المستخدم مسجلاً
// let userId = localStorage.getItem("userId") || 0;
// debugger;
// // دالة لعرض عدد العناصر في السلة وتحديث الشارة
// async function getcountcart() {
//   const badgeCart = document.getElementById("badgeCart");
//   if (userId) {
//     // للمستخدم الضيف، جلب حجم السلة من localStorage
//     let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;
//     badgeCart.innerHTML = cartSize; // عرض العدد من cartSize
//   } else {
//     // للمستخدم المسجل، جلب عدد العناصر من الخادم
//     const url = `http://localhost:44301/api/CartItem/cartItemCount/${userId}`;
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         // console.error("خطأ في جلب عدد عناصر السلة:", response.statusText);
//         badgeCart.innerHTML = "0";
//         return;
//       }
//       const result = await response.json();
//       const count = result.count || 0;
//       badgeCart.innerHTML = count;
//     } catch (error) {
//       console.error("خطأ:", error);
//       badgeCart.innerHTML = "0";
//     }
//   }
// }

// // عناوين URL للحصول على البيانات من الخادم
// const url14 = `http://localhost:44301/api/CartItem/topPriceCartItems/${userId}`;
// const url7 = `http://localhost:44301/api/Books/byIDBooks/`;
// const url8 = `http://localhost:44301/api/CartItem/byIDCartItemtTotal2/${userId}`;

// // دالة لجلب تفاصيل الكتاب من الخادم باستخدام bookId
// async function getBookDetails(bookId) {
//   try {
//     const response = await fetch(`${url7}${bookId}`);
//     if (!response.ok) {
//       console.error("خطأ في جلب تفاصيل الكتاب:", response.statusText);
//       return null;
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("خطأ في جلب تفاصيل الكتاب:", error);
//     return null;
//   }
// }

// // دالة لجلب تفاصيل الكتاب من localStorage
// function getBookDetailsFromLocalStorage(bookId) {
//   let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;
//   for (let i = 1; i <= cartSize; i++) {
//     let cartItem = JSON.parse(localStorage.getItem(`item${i}`));
//     if (cartItem && cartItem.bookId === bookId) {
//       return cartItem;
//     }
//   }
//   return null;
// }

// // دالة لجلب إجمالي السعر لجميع العناصر في السلة من الخادم
// async function getTotalPrice() {
//   try {
//     const response = await fetch(url8);
//     if (!response.ok) {
//       console.error("خطأ في جلب السعر الإجمالي:", response.statusText);
//       return 0;
//     }
//     const result = await response.json();
//     return result.totalPrice || 0;
//   } catch (error) {
//     console.error("خطأ في جلب السعر الإجمالي:", error);
//     return 0;
//   }
// }

// // دالة لجلب أعلى العناصر بالسعر وتحديث واجهة المستخدم بالسلة
// async function getTopPrice() {
//   const booksContainer = document.getElementById("cartContainer");
//   booksContainer.innerHTML = ""; // مسح المحتوى السابق

//   if (!userId) {
//     // للمستخدم الضيف، جلب العناصر من localStorage
//     let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;

//     if (cartSize === 0) {
//       booksContainer.innerHTML = "<li>لا توجد عناصر في السلة</li>";
//       return;
//     }

//     let totalPrice = 0;
//     for (let i = 1; i <= cartSize; i++) {
//       let cartItem = JSON.parse(localStorage.getItem(`item${i}`));
//       if (cartItem) {
//         totalPrice += cartItem.price * cartItem.quantity;
//         booksContainer.innerHTML += `
//                     <li class="cart-item">
//                         <div class="media">
//                             <div class="media-left">
//                                 <img alt="${
//                                   cartItem.bookId
//                                 }" class="media-object" src="${
//           cartItem.imageUrl
//         }" />
//                             </div>
//                             <div class="media-body">
//                                 <h6 class="dz-title">
//                                     <a href="books-detail.html?id=${
//                                       cartItem.bookId
//                                     }" class="media-heading">كتاب ID: ${
//           cartItem.bookId
//         }</a>
//                                 </h6>
//                                 <span class="dz-price">$${cartItem.price.toFixed(
//                                   2
//                                 )}</span>
//                             </div>
//                         </div>
//                     </li>`;
//       }
//     }

//     booksContainer.innerHTML += `
//             <li class="cart-item text-center">
//                 <h6 class="text-secondary">الإجمالي = $${totalPrice.toFixed(
//                   2
//                 )}</h6>
//             </li>
//             <li class="text-center d-flex">
//                 <a href="shop-cart.html" class="btn btn-sm btn-primary me-2 btnhover w-100">عرض السلة</a>
//             </li>`;
//   } else {
//     // للمستخدم المسجل، جلب العناصر من الخادم
//     try {
//       const response = await fetch(url14);
//       if (!response.ok) {
//         console.error("خطأ في جلب العناصر من الخادم:", response.statusText);
//         return;
//       }

//       const result = await response.json();
//       let totalPrice = 0;
//       if (result.length === 0) {
//         booksContainer.innerHTML = "<li>لا توجد عناصر في السلة</li>";
//         return;
//       }

//       for (let i = 0; i < Math.min(result.length, 3); i++) {
//         const book = result[i];
//         const bookDetails = await getBookDetails(book.id);
//         if (bookDetails) {
//           totalPrice += bookDetails.price;
//           booksContainer.innerHTML += `
//                         <li class="cart-item">
//                             <div class="media">
//                                 <div class="media-left">
//                                     <img alt="${
//                                       bookDetails.title
//                                     }" class="media-object" src="${
//             bookDetails.imageUrl
//           }" />
//                                 </div>
//                                 <div class="media-body">
//                                     <h6 class="dz-title">
//                                         <a href="books-detail.html?id=${
//                                           bookDetails.id
//                                         }" class="media-heading">${
//             bookDetails.title
//           }</a>
//                                     </h6>
//                                     <span class="dz-price">$${bookDetails.price.toFixed(
//                                       2
//                                     )}</span>
//                                 </div>
//                             </div>
//                         </li>`;
//         }
//       }

//       booksContainer.innerHTML += `
//                 <li class="cart-item text-center">
//                     <h6 class="text-secondary">الإجمالي = $${totalPrice.toFixed(
//                       2
//                     )}</h6>
//                 </li>
//                 <li class="text-center d-flex">
//                     <a href="shop-cart.html" class="btn btn-sm btn-primary me-2 btnhover w-100">عرض السلة</a>
//                 </li>`;
//     } catch (error) {
//       console.error("خطأ:", error);
//     }
//   }
// }

// // عرض السلة عند التحميل
// window.onload = function () {
//   getTopPrice();
//   getcountcart();
// };
// Get userId from localStorage or set to 0 if the user is not logged in
// let userId = localStorage.getItem("userId") && 0;
// let userId = 15;
// debugger;

// // Function to display the number of items in the cart and update the badge
// async function getcountcart() {
//   const badgeCart = document.getElementById("badgeCart");
//   if (!userId) {
//     // For guest users, get cart size from localStorage
//     let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;
//     badgeCart.innerHTML = cartSize; // Display the count from cartSize
//   } else {
//     // For registered users, get item count from the server
//     const url = `http://localhost:44301/api/CartItem/cartItemCount/${userId}`;
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(
//           `Error fetching cart item count: ${response.statusText}`
//         );
//       }
//       const result = await response.json();
//       const count = result.count || 0;
//       badgeCart.innerHTML = count;
//     } catch (error) {
//       console.error("Error:", error);
//       badgeCart.innerHTML = "0";
//     }
//   }
// }

// // URLs for fetching data from the server
// const url14 = `http://localhost:44301/api/CartItem/topPriceCartItems/${userId}`;
// const url7 = `http://localhost:44301/api/Books/byIDBooks/`;
// const url8 = `http://localhost:44301/api/CartItem/byIDCartItemtTotal2/${userId}`;

// // Function to get book details from the server using bookId
// async function getBookDetails(bookId) {
//   try {
//     const response = await fetch(`${url7}${bookId}`);
//     if (!response.ok) {
//       throw new Error(`Error fetching book details: ${response.statusText}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error:", error);
//     return null;
//   }
// }

// // Function to get book details from localStorage
// function getBookDetailsFromLocalStorage(bookId) {
//   let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;
//   for (let i = 1; i <= cartSize; i++) {
//     let cartItem = JSON.parse(localStorage.getItem(`item${i}`));
//     if (cartItem && cartItem.bookId === bookId) {
//       return cartItem;
//     }
//   }
//   return null;
// }

// // Function to get the total price of all items in the cart from the server
// async function getTotalPrice() {
//   try {
//     const response = await fetch(url8);
//     if (!response.ok) {
//       throw new Error(`Error fetching total price: ${response.statusText}`);
//     }
//     const result = await response.json();
//     return result.totalPrice || 0;
//   } catch (error) {
//     console.error("Error:", error);
//     return 0;
//   }
// }

// // Function to get top-priced items and update the cart UI
// async function getTopPrice() {
//   const booksContainer = document.getElementById("cartContainer");
//   booksContainer.innerHTML = ""; // Clear previous content

//   if (!userId) {
//     // For guest users, get items from localStorage
//     let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;

//     if (cartSize === 0) {
//       booksContainer.innerHTML = "<li>No items in the cart</li>";
//       return;
//     }

//     let totalPrice = 0;
//     for (let i = 1; i <= cartSize; i++) {
//       let cartItem = JSON.parse(localStorage.getItem(`item${i}`));
//       if (cartItem) {
//         totalPrice += cartItem.price * cartItem.quantity;
//         booksContainer.innerHTML += `
//           <li class="cart-item">
//             <div class="media">
//               <div class="media-left">
//                 <img alt="${cartItem.bookId}" class="media-object" src="${
//           cartItem.imageUrl
//         }" />
//               </div>
//               <div class="media-body">
//                 <h6 class="dz-title">
//                   <a href="books-detail.html?id=${
//                     cartItem.bookId
//                   }" class="media-heading">Book ID: ${cartItem.bookId}</a>
//                 </h6>
//                 <span class="dz-price">$${cartItem.price.toFixed(2)}</span>
//               </div>
//             </div>
//           </li>`;
//       }
//     }

//     booksContainer.innerHTML += `
//       <li class="cart-item text-center">
//         <h6 class="text-secondary">Total = $${totalPrice.toFixed(2)}</h6>
//       </li>
//       <li class="text-center d-flex">
//         <a href="shop-cart.html" class="btn btn-sm btn-primary me-2 btnhover w-100">View Cart</a>
//       </li>`;
//   } else {
//     // For registered users, get items from the server
//     try {
//       const response = await fetch(url14);
//       if (!response.ok) {
//         throw new Error(
//           `Error fetching items from the server: ${response.statusText}`
//         );
//       }

//       const result = await response.json();
//       let totalPrice = 0;
//       if (result.length === 0) {
//         booksContainer.innerHTML = "<li>No items in the cart</li>";
//         return;
//       }

//       for (let i = 0; i < Math.min(result.length, 3); i++) {
//         const book = result[i];
//         const bookDetails = await getBookDetails(book.id);
//         if (bookDetails) {
//           totalPrice += book.price;
//           booksContainer.innerHTML += `
//             <li class="cart-item">
//               <div class="media">
//                 <div class="media-left">
//                   <img alt="${book.title}" class="media-object" src="${
//             book.userProfilePicture
//           }" />
//                 </div>
//                 <div class="media-body">
//                   <h6 class="dz-title">
//                     <a href="books-detail.html?id=${
//                       book.id
//                     }" class="media-heading">${book.title}</a>
//                   </h6>
//                   <span class="dz-price">$${book.price.toFixed(2)}</span>
//                 </div>
//               </div>
//             </li>`;
//         }
//       }

//       booksContainer.innerHTML += `
//         <li class="cart-item text-center">
//           <h6 class="text-secondary">Total = $${totalPrice.toFixed(2)}</h6>
//         </li>
//         <li class="text-center d-flex">
//           <a href="shop-cart.html" class="btn btn-sm btn-primary me-2 btnhover w-100">View Cart</a>
//         </li>`;
//     } catch (error) {
//       console.error("Error:", error);
//       booksContainer.innerHTML = "<li>Error loading cart items.</li>";
//     }
//   }
// }

// // Display cart contents on page load
// window.onload = function () {
//   getTopPrice();
//   getcountcart();
// };
// Get userId from localStorage or set to 0 if the user is not logged in
let userId = localStorage.getItem("userId") && 0;

// Initialize userId, set to 15 for testing logged-in state
// let userId = 15; // Change to 0 or comment out for guest user testing
debugger;

// Function to display the number of items in the cart and update the badge
async function getcountcart() {
  const badgeCart = document.getElementById("badgeCart");
  if (!userId) {
    // For guest users, get cart size from localStorage
    let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;
    badgeCart.innerHTML = cartSize; // Display the count from cartSize
  } else {
    // For registered users, get item count from the server
    const url = `https://localhost:44301/api/CartItem/cartItemCount/${userId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Error fetching cart item count: ${response.statusText}`
        );
      }
      const result = await response.json();
      const count = result.count || 0;
      badgeCart.innerHTML = count;
    } catch (error) {
      console.error("Error:", error);
      badgeCart.innerHTML = "0";
    }
  }
}

// URLs for fetching data from the server
const url14 = `https://localhost:44301/api/CartItem/topPriceCartItems/${userId}`;
const url7 = `https://localhost:44301/api/Books/byIDBooks/`;
const url8 = `https://localhost:44301/api/CartItem/byIDCartItemtTotal2/${userId}`;

// Function to get book details from the server using bookId
async function getBookDetails(bookId) {
  try {
    const response = await fetch(`${url7}${bookId}`);
    if (!response.ok) {
      throw new Error(`Error fetching book details: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Function to get book details from localStorage
function getBookDetailsFromLocalStorage(bookId) {
  let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;
  for (let i = 1; i <= cartSize; i++) {
    let cartItem = JSON.parse(localStorage.getItem(`item${i}`));
    if (cartItem && cartItem.bookId === bookId) {
      return cartItem;
    }
  }
  return null;
}

// Function to get the total price of all items in the cart from the server
async function getTotalPrice() {
  try {
    const response = await fetch(url8);
    if (!response.ok) {
      throw new Error(`Error fetching total price: ${response.statusText}`);
    }
    const result = await response.json();
    return result.totalPrice || 0;
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
}

// Function to get top-priced items and update the cart UI
async function getTopPrice() {
  const booksContainer = document.getElementById("cartContainer");
  booksContainer.innerHTML = ""; // Clear previous content

  if (!userId) {
    // For guest users, get items from localStorage
    let cartSize = parseInt(localStorage.getItem("cartSize")) || 0;

    if (cartSize === 0) {
      booksContainer.innerHTML = "<li>No items in the cart</li>";
      return;
    }

    let totalPrice = 0;
    for (let i = 1; i <= cartSize; i++) {
      let cartItem = JSON.parse(localStorage.getItem(`item${i}`));
      if (cartItem) {
        totalPrice += cartItem.price * cartItem.quantity;
        booksContainer.innerHTML += `
          <li class="cart-item">
            <div class="media">
              <div class="media-left">
                <img alt="${cartItem.bookId}" class="media-object" src="${cartItem.imageUrl
          }" />
              </div>
              <div class="media-body">
                <h6 class="dz-title">
                  <a href="books-detail.html?id=${cartItem.bookId
          }" class="media-heading">Book ID: ${cartItem.bookId}</a>
                </h6>
                <span class="dz-price">$${cartItem.price.toFixed(2)}</span>
              </div>
            </div>
          </li>`;
      }
    }

    booksContainer.innerHTML += `
      <li class="cart-item text-center">
        <h6 class="text-secondary">Total = $${totalPrice.toFixed(2)}</h6>
      </li>
      <li class="text-center d-flex">
        <a href="shop-cart.html" class="btn btn-sm btn-primary me-2 btnhover w-100">View Cart</a>
      </li>`;
  } else {
    // For registered users, get items from the server
    try {
      const response = await fetch(url14);
      if (!response.ok) {
        throw new Error(
          `Error fetching items from the server: ${response.statusText}`
        );
      }

      const result = await response.json();
      let totalPrice = 0;
      if (result.length === 0) {
        booksContainer.innerHTML = "<li>No items in the cart</li>";
        return;
      }

      for (let i = 0; i < Math.min(result.length, 3); i++) {
        const book = result[i];
        const bookDetails = await getBookDetails(book.id);
        if (book) {
          totalPrice += book.price;
          booksContainer.innerHTML += `
            <li class="cart-item">
              <div class="media">
                <div class="media-left">
                  <img alt="${book.title}" class="media-object" src="${book.userProfilePicture
            }" />
                </div>
                <div class="media-body">
                  <h6 class="dz-title">
                    <a href="books-detail.html?id=${book.id
            }" class="media-heading">${book.title}</a>
                  </h6>
                  <span class="dz-price">$${book.price.toFixed(2)}</span>
                </div>
              </div>
            </li>`;
        }
      }

      booksContainer.innerHTML += `
        <li class="cart-item text-center">
          <h6 class="text-secondary">Total = $${totalPrice.toFixed(2)}</h6>
        </li>
        <li class="text-center d-flex">
          <a href="shop-cart.html" class="btn btn-sm btn-primary me-2 btnhover w-100">View Cart</a>
        </li>`;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

// Display cart on page load
window.onload = function () {
  getTopPrice();
  getcountcart();
};