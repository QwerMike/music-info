window.onload = (e) => {
    const btn = document.getElementById('search');
    
    btn.addEventListener('click', async e => {
        const artist = document.getElementById('artist').value
            , title = document.getElementById('title').value;
        
        let data = await fetch(`api/${artist}/${title}`).then(x => x.json());
        const template = document.getElementById('result');
        template.innerHTML = 
            data == "Not found" 
            ? data
            : resultTemplate(data);
    });
};

function resultTemplate({
        artistName, 
        trackName,
        trackViewUrl,
        artworkUrl,
        releaseDate,
        genre,
        tabsUrl,
        lyrics
    }) {
    
    artworkUrl = artworkUrl.replace('100x100', '500x500');
    
    return `
    <h1>${artistName}</h1>
    <h2>${trackName}</h2>
    <img src="${artworkUrl}" alt="artwork" style="width:50%">
    <p>Release date: ${releaseDate}</p>
    <p>Genre: ${genre}</p>
    <p><a href="${trackViewUrl}">Check on iTunes</a></p>
    <p><a href="${tabsUrl}">Tabs on Songsterr</a></p>
    <pre>${lyrics}</pre>`
}
