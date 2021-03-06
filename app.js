const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];
// pause slider
let pause = false;
let slideIndex = 0;
var timer = null;
let duration = 1000;


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  toggleSpinner(); // hide spinner after loading data
}

const getImages = (query) => {
  toggleSpinner(); // show spinner on data load time
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits)) // bug 'hitS' is to be 'hits'
    .catch(err => console.log(err))
}

const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added'); // use 'toggle' instead of 'add' to toggle select style class 'added'
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1); // remove the unselected image from the 'sliders' array
  }
}

const playPause = () => {
  if(pause === false){
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
  else{
    // stop 
    clearInterval(timer);
    timer = null;
  }
}

// play / pause button event handler
document.getElementById('pause-play-btn').addEventListener('click', event => {
  const playPauseText = event.target.innerText;
  if(playPauseText === 'Pause Slider'){
    pause = true;
    event.target.innerText = 'Play Slider';
    playPause();
  }
  else{
    pause = false;
    event.target.innerText = 'Pause Slider';
    playPause();
  }
})

const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

  // get duration text, convert it to number, check if it is negative and work accordingly
  const durationInput = document.getElementById('duration').value;
  if(durationInput < 0){ 
     alert('Time can not be negative! Give valid time input.');
    return;
    
  }
 
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  duration = durationInput || 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100" src="${slide}" alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0);
  playPause();
}



// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block" 
}

// search on enter key press
document.getElementById('search').addEventListener('keypress', event => {
  if(event.key === 'Enter'){
    searchBtn.click();
  }
})

// search button
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// spinner show / hide
const toggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none');
  const images = document.getElementById('image-container');
  images.classList.toggle('d-none');
}
