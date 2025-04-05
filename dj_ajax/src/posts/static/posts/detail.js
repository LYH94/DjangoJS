const backBtn = document.getElementById('back-btn');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');
const url = window.location.href + "data";
const spinnerBox = document.getElementById('spinner-box');

backBtn.addEventListener('click', () => {
  history.back();
});

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

    spinnerBox.classList.add('d-none');
  },
  error: function (error) {
    console.error(error);
  },
})