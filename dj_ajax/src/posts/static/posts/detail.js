const postBox = document.getElementById('post-box');
const alertBox = document.getElementById('alert-box');
const backBtn = document.getElementById('back-btn');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');

const url = window.location.href + "data/";
const updateUrl = window.location.href + "update/";
const deleteUrl = window.location.href + "delete/";
const commentsUrl = window.location.href + "comments/";

const updateForm = document.getElementById('update-form');
const deleteForm = document.getElementById('delete-form');

const spinnerBox = document.getElementById('spinner-box');

const titleInput = document.getElementById('id_title');
const bodyInput = document.getElementById('id_body');

const commentsBox = document.getElementById('comments-box');
const commentsSpinner = document.getElementById('comments-spinner');
const commentForm = document.getElementById('comment-form');
const commentBody = document.getElementById('comment-body');

const csrf = document.getElementsByName('csrfmiddlewaretoken')



$.ajax({
  type: 'GET',
  url: url,
  success: function (response) {
    console.log(response);
    const data = response.data;

    if (data.logged_in !== data.author) {
      console.log('different')
    } else {
      console.log('same')
      updateBtn.classList.remove('d-none');
      deleteBtn.classList.remove('d-none');
    }

    const titleEl = document.createElement('h3');
    titleEl.setAttribute('class', 'mt-3');
    titleEl.setAttribute('id', 'title');

    const bodyEl = document.createElement('p');
    bodyEl.setAttribute('class', 'mt-1');
    bodyEl.setAttribute('id', 'body');

    titleEl.textContent = data.title;
    bodyEl.textContent = data.body;

    postBox.appendChild(titleEl);
    postBox.appendChild(bodyEl);

    titleInput.value = data.title;
    bodyInput.value = data.body;

    spinnerBox.classList.add('d-none');
  },
  error: function (error) {
    console.error(error);
  },
})

$.ajax({
  type: 'GET',
  url: commentsUrl,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  success: function(response) {
    commentsSpinner.classList.add('d-none');
    
    if (response.comments.length === 0) {
      commentsBox.innerHTML = '<p class="text-center text-muted">No comments yet...</p>';
      return;
    }
    
    let commentsHtml = '';
    response.comments.forEach(comment => {
      commentsHtml += `
        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex">
              <img src="${comment.avatar}" alt="${comment.author}" class="rounded-circle me-3" width="50" height="50">
              <div>
                <h6 class="mb-0">${comment.author}</h6>
                <small class="text-muted">${comment.created}</small>
                <p class="mt-2">${comment.body}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    commentsBox.innerHTML = commentsHtml;
  },
  error: function(error) {
    console.log(error);
    commentsSpinner.classList.add('d-none');
    commentsBox.innerHTML = '<p class="text-center text-danger">Error loading comments</p>';
  }
});

updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('id_title');
  const body = document.getElementById('id_body');

  $.ajax({
    type: 'POST',
    url: updateUrl,
    data: {
      'csrfmiddlewaretoken': csrf[0].value,
      'title': title.value,
      'body': body.value,
    },
    success: function (response) {
      console.log(response);
      handleAlerts('success', 'Post has been updated!');
      title.textContent = response.title;
      body.textContent = response.body;
    },
    error: function (error) {
      console.error(error);
    },
  });
});

deleteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $.ajax({
    type: 'POST',
    url: deleteUrl,
    data: {
      'csrfmiddlewaretoken': csrf[0].value,
    },
    success: function (response) {
      window.location.href = window.location.origin
      localStorage.setItem('title', titleInput.value);
    },
    error: function (error) {
      console.error(error);
    },
  });
});

commentForm.addEventListener('submit', e => {
  e.preventDefault();

  if (!commentBody.value.trim()) {
    handleAlerts('danger', 'Comment cannot be empty');
    return;
  }

  const commentUrl = window.location.href + "add-comment/";

  $.ajax({
    type: 'POST',
    url: commentUrl,
    data: {
      'csrfmiddlewaretoken': csrf[0].value,
      'body': commentBody.value
    },
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    success: function(response) {
      const newComment = `
        <div class="card mb-3 border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex">
              <img src="${response.avatar}" alt="${response.author}" class="rounded-circle me-3" width="50" height="50">
              <div>
                <h6 class="mb-0">${response.author}</h6>
                <small class="text-muted">${response.created}</small>
                <p class="mt-2">${response.body}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      
      if (commentsBox.innerHTML.includes('No comments yet')) {
        commentsBox.innerHTML = '';
      }
      
      commentsBox.insertAdjacentHTML('afterbegin', newComment);
      
      commentBody.value = '';
      
      handleAlerts('success', 'Comment posted successfully!');
    },
    error: function(error) {
      console.log(error);
      handleAlerts('danger', 'Failed to post comment');
    }
  });
});

