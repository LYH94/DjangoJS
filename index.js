console.log("hello world");

const testEl = document.getElementById("test-el");

testEl.textContent = "bye bye";

testEl.addEventListener("click", () => {
  console.log("clicked");
  testEl.innerHTML = "<b>clicked</b>"  
});

testEl.addEventListener("mouseover", () => {
  console.log("on")
});

testEl.addEventListener("mouseout", () => {
  console.log("off")
});

document.addEventListener("scroll", () => {
  const positionY = window.scrollY;
  console.log(positionY);
});

// Get the date with ajax
const url = "https://swapi.dev/api/people";

// jQuery ajax
$.ajax({ 
  type: 'GET',
  url: url,
  success: function(response) {
    console.log('jquery ajax', response);
  },
  error: function(error) {
    console.log(error);
  }
}); 

// HMLHttpRequest

const req = new XMLHttpRequest();

req.addEventListener('readystatechange', () => {
  if (req.readyState === 4) {
    console.log('xhttp', req.responseText);
  }
});

req.open('GET', url);
req.send();

// 3. fetch method
fetch(url)
  .then(resp=>resp.json()).then(data=>console.log('fetch', data))
  .catch(err=>console.log(err));