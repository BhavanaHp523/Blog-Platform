let posts = JSON.parse(localStorage.getItem("posts")) || [];
let editIndex = null;

const postsPerPage = 4;
let currentPage = 1;

function savePost() {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) {
    alert("Please fill all fields");
    return;
  }

  const postData = {
    title,
    content,
    dateTime: new Date().toLocaleString()
  };

  if (editIndex !== null) {
    posts[editIndex] = postData;
    editIndex = null;
  } else {
    posts.unshift(postData);
  }

  localStorage.setItem("posts", JSON.stringify(posts));
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";

  displayPosts();
}

function displayPosts() {
  const postBox = document.getElementById("posts");
  postBox.innerHTML = "";

  const start = (currentPage - 1) * postsPerPage;
  const pagePosts = posts.slice(start, start + postsPerPage);

  pagePosts.forEach((post, i) => {
    const shortText =
      post.content.length > 140
        ? post.content.substring(0, 140) + "..."
        : post.content;

    postBox.innerHTML += `
      <div class="post">
        <h3>${post.title}</h3>
        <small>${post.dateTime}</small>

        <p id="text-${i}">${shortText}</p>

        ${
          post.content.length > 140
            ? `<button class="read" onclick="toggleRead(${i}, ${start})">Read More</button>`
            : ""
        }

        <button class="edit" onclick="editPost(${start + i})">Edit</button>
        <button onclick="deletePost(${start + i})">Delete</button>
      </div>
    `;
  });

  setupPagination();
}
function toggleRead(index, start) {
  const realIndex = start + index;
  const p = document.getElementById(`text-${index}`);
  const btn = p.nextElementSibling;

  if (btn.innerText === "Read More") {
    p.innerText = posts[realIndex].content;
    btn.innerText = "Read Less";
  } else {
    p.innerText = posts[realIndex].content.substring(0, 140) + "...";
    btn.innerText = "Read More";
  }
}

function editPost(index) {
  document.getElementById("title").value = posts[index].title;
  document.getElementById("content").value = posts[index].content;
  editIndex = index;
}

function deletePost(index) {
  posts.splice(index, 1);
  localStorage.setItem("posts", JSON.stringify(posts));

  if ((currentPage - 1) * postsPerPage >= posts.length && currentPage > 1) {
    currentPage--;
  }

  displayPosts();
}

/* Pagination */
function setupPagination() {
  const pg = document.getElementById("pagination");
  pg.innerHTML = "";

  const pages = Math.ceil(posts.length / postsPerPage);
  for (let i = 1; i <= pages; i++) {
    pg.innerHTML += `<button onclick="changePage(${i})">${i}</button>`;
  }
}

function changePage(p) {
  currentPage = p;
  displayPosts();
}

displayPosts();
if (!localStorage.getItem("posts")) {
  const defaultPosts = [
    {
      title: "Why I Built a Blog Platform",
      content: "This blog platform was built using HTML, CSS, and JavaScript to understand real-world CRUD operations and frontend architecture. It helped me learn DOM manipulation, pagination, and UI design.",
      dateTime: new Date().toLocaleString()
    },
    {
      title: "Understanding CRUD Operations",
      content: "CRUD stands for Create, Read, Update, and Delete. These operations are the foundation of most applications. Implementing them in this project helped me understand data flow and user interactions.",
      dateTime: new Date().toLocaleString()
    },
    {
      title: "Importance of Responsive Web Design",
      content: "Responsive design ensures that websites work well on all screen sizes. This project uses CSS Grid and media queries to provide a smooth experience on mobile and desktop.",
      dateTime: new Date().toLocaleString()
    }
  ];

  localStorage.setItem("posts", JSON.stringify(defaultPosts));
}

/* Dark Mode */
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

