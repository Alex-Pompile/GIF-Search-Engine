
const apiKey = `6Sl1fdO54US9CO85erVvPFizdOVUoNtn`


const searchUrl = `https://api.giphy.com/v1/gifs/search?`


const trendingUrl = `https://api.giphy.com/v1/gifs/trending?`


const loader = document.getElementById('loader')


const searchBox = document.getElementById('search-input')


const gifWrapper = document.getElementById('gifs-card-wrapper')

let limit = 20;

let current = 0;


const loadMore = document.getElementById('load_more_btn')


const gifItem = document.createElement('div')
      gifItem.classList.add('gif-card')
      gifItem.innerHTML = `
        <div class="gif-container">
            <img src="" alt="">
        </div>
        <div class="gif-details">
            <div class="gif-title"></div>
            <div class="gif-tools">
            <button class="gif-icon-btn-tool gif-copy" type="button" title="Copy Link"><span class="material-symbols-outlined">content_copy</span></button>
            <button class="gif-icon-btn-tool gif-source" type="button" title="Copy Link"><span class="material-symbols-outlined">code</span></button>
            </div>
        </div>`

const loadGIFs = (is_more = false) =>{
    if(!is_more)
        gifWrapper.innerHTML = ``;
    loader.style.display= 'flex'
    loadMore.style.display= 'none';

    var has_search = (searchBox.value == "") ? false:true;
    if(has_search){
        var apiLink = searchUrl + `q=` + encodeURIComponent(searchBox.value) + '&'
    }else{
        var apiLink = trendingUrl
    }
    apiLink =  `${apiLink}api_key=${apiKey}&limit=${limit}&offset=${current}&rating=g&lang=en`;
    fetch(apiLink)
    .then(response => {
        if(response.status == 200){
            return response.json()
        }
    })
    .then(data => {
        setTimeout(()=>{
            if(!is_more)
            gifWrapper.innerHTML = ``;
            current += data.pagination.count
        data.data.forEach(gifData =>{
            var gifCard = gifItem.cloneNode(true)
                gifCard.querySelector('.gif-container>img').src = gifData.images.downsized_medium.url
                gifCard.querySelector('.gif-container>img').alt = gifData.title
                gifCard.querySelector('.gif-title').innerText = gifData.title
                gifCard.querySelector('.gif-title').title = gifData.title

                gifWrapper.appendChild(gifCard)
                gifCard.querySelector('.gif-copy').addEventListener('click', e=>{
                    e.preventDefault()
                    var textarea = document.createElement('textarea')
                    textarea.value = gifData.images.original.url
                    textarea.innerHTML = gifData.images.original.url
                    textarea.style.width = '0px'
                    document.body.appendChild(textarea)
                    textarea.select()
                    document.execCommand('copy')
                    setTimeout(()=>{
                        alert(`${gifData.title}'s link has been copied to clipboard`);
                        textarea.remove()
                    }, 100)
                })
                gifCard.querySelector('.gif-source').addEventListener('click', e =>{
                    e.preventDefault()
                    window.open(gifData.bitly_gif_url)
                })
        })
        loader.style.display= 'none'
        if((data.pagination.count + data.pagination.offset) < data.pagination.total_count)
            loadMore.style.display= 'block';
        },1500)
    })
    .catch(error=>{
        alert("An error occurren while fetching GIF data");
        console.error(error)
    })
}

window.onload = function(){
    loadGIFs()
    searchBox.addEventListener('keyup', (e)=>{
        var code = e.keyCode || e.which
        if(code == 13){
            current = 0
            loadGIFs()
        }
    })
}
window.onscroll = function(){
}
loadMore.addEventListener('click', e => {
    e.preventDefault()
    loadGIFs(true)
})
searchBox.onreset = function(){
    current = 0
    loadGIFs()
}