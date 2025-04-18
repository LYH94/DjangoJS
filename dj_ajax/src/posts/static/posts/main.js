const postsBox = document.getElementById("posts-box");
const spinnerBox = document.getElementById("spinner-box");
const loadBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box");

const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const body = document.getElementById("id_body");
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const url = window.location.href;

const alertBox = document.getElementById('alert-box');

const dropzone = document.getElementById('my-dropzone');
const addBtn = document.getElementById('add-btn');
const closeBtn = [...document.getElementsByClassName('add-modal-close')];

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');

const deleted = localStorage.getItem('title');
if (deleted) {
  handleAlerts('danger', `deleted "${deleted}"`);
  localStorage.clear();
}

const likeUnlikePosts = ()=> {
  const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')];
  likeUnlikeForms.forEach(form => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const clickId = e.target.getAttribute('data-form-id');
    const clickedBtn = document.getElementById(`like-unlike-${clickId}`);

    $.ajax({
      type: 'POST',
      url: '/like-unlike/',
      data: {
        'csrfmiddlewaretoken': csrftoken,
        'pk': clickId,
      },
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      success: function (response){
        clickedBtn.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`;
      },
      error: function (error) {
      }
    });
  }));
}

let visible = 3;

const getData = () => {
  $.ajax({
    type: "GET",
    url: `/data/${visible}/`,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    success: function (response) {
      const data = response.data;
      setTimeout(() => {
        spinnerBox.classList.add('d-none');
        data.forEach(el => {
          postsBox.innerHTML += `
            <div class="card shadow border-0 card-hover-effect mb-3">
              <div class="card-body">
                <h5 class="card-title">${el.title}</h5>
                <p class="card-text">${el.body}</p>
              </div>
              <div class="card-footer bg-white border-top border-light">
                <div class="row">
                  <div class="col-6 col-md-3 col-lg-1">
                    <a href="${url}${el.id}" class="btn bg-primary-green text-white btn-rounded text-nowrap">Details</a>
                  </div>
                  <div class="col-6 col-md-3 col-lg-1">
                    <form class="like-unlike-forms" data-form-id="${el.id}">
                      <button href="#" class="btn bg-primary-yellow text-dark-gray btn-rounded text-nowrap" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.count})`: `Like (${el.count})`}</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          `
        });
        likeUnlikePosts();
      }, 100);
      if(response.size === 0) {
        endBox.textContent = "No posts added yet...";
      }
      else if (response.size <= visible) {
        loadBtn.classList.add('d-none');
        endBox.textContent = "No more posts to load...";
      }
    },
    error: function (error) {
    }
  })
}

loadBtn.addEventListener('click', () => {
  spinnerBox.classList.remove('d-none');
  visible += 3;
  getData();
});

let newPostId = null;

postForm.addEventListener('submit', e => {
  e.preventDefault();

  $.ajax({
    type: 'POST',
    url: '',
    data: {
      'csrfmiddlewaretoken': csrf[0].value,
      'title': title.value,
      'body': body.value,
    },
    success: function (response){
      newPostId = response.id;
      postsBox.insertAdjacentHTML('afterbegin', `
        <div class="card shadow border-0 card-hover-effect mb-3 highlight-new">
          <div class="card-body">
            <h5 class="card-title">${response.title}</h5>
            <p class="card-text">${response.body}</p>
          </div>
          <div class="card-footer bg-white border-top border-light">
            <div class="row">
              <div class="col-6 col-md-3 col-lg-1">
                <a href="${url}${response.id}" class="btn bg-primary-green text-white btn-rounded">Details</a>
              </div>
              <div class="col-6 col-md-3 col-lg-1">
                <form class="like-unlike-forms" data-form-id="${response.id}">
                  <button href="#" class="btn bg-primary-yellow text-dark-gray btn-rounded text-nowrap" id="like-unlike-${response.id}">Like (0)</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      `);
        likeUnlikePosts();
        // $('#addPostModal').modal('hide');
        handleAlerts('success', 'New post added!');
        // postForm.reset();
    },
    error: function (error) {
      handleAlerts('danger', 'ups...something went wrong!');
    }
  })
})

addBtn.addEventListener('click', () => {
  dropzone.classList.remove('d-none');
})

closeBtn.forEach(btn => btn.addEventListener('click', () => {
  postForm.reset();
  if (!dropzone.classList.contains('d-none')) {
    dropzone.classList.add('d-none');
  }

  const myDropzone = Dropzone.forElement("#my-dropzone");
  myDropzone.removeAllFiles(true);
}))

Dropzone.autoDiscover = false;
const myDropzone = new Dropzone("#my-dropzone", {
  url: "/upload/",
  init: function() {
    this.on("sending", function(file, xhr, formData) {
      formData.append("csrfmiddlewaretoken", csrftoken);
      formData.append("new_post_id", newPostId);
    });
  },
  maxFiles: 5,
  maxFilesize: 4,
  acceptedFiles: ".png,.jpg,.jpeg",
});

getData();