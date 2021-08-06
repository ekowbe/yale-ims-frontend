const URL_PREFIX='http://localhost:3000/';

document.addEventListener("DOMContentLoaded", () => {
    
    // home page
    fetch(URL_PREFIX + 'sports')
        .then(r => r.json())
        .then(renderSports)

    // when a sport is clicked, go to sport landing page
    document.addEventListener("click", e => {

        if (e.target.className == 'sport-header') {

            const sport_id = e.target.dataset.id

            fetch(URL_PREFIX + 'sports/' + `${sport_id}`)
                .then(r => r.json())
                .then(renderSportLandingPage)
            
            //const result = inventory.find( ({ name }) => name === 'cherries' );
        }

    })

})

function renderSports(sports) {

    // select sports panel
    let sportsPanel = document.querySelector("div#sports-panel")
    sportsPanel.style.display = "block"

    sports.forEach(sport => {
        // name
        let nameTag = document.createElement('h2')
        nameTag.dataset.id = sport.id
        nameTag.className = 'sport-header'
        nameTag.textContent = `${sport.name}`

        // add to doc
        sportsPanel.appendChild(nameTag)
        
    });

}

function renderSportLandingPage(sport) {
    // make sports-panel disapper
    let sportsPanel = document.querySelector("div#sports-panel")
    sportsPanel.style.display = "none"

    // let sport-panel appear
    let sportPanel = document.querySelector("div#sport-panel")
    sportPanel.style.display = "block"

    // name
    let nameTag = document.createElement('h2')
    nameTag.dataset.id = sport.id
    nameTag.className = 'sport'
    nameTag.textContent = `${sport.name}`
    sportPanel.appendChild(nameTag)

    // picture carousel - work on this when working on frontend
    let carousel = document.createElement('div')
    let carouselInner = document.createElement('div')    

    // upcoming fixtures
    let matches = sport.matches

    createMatchList(matches, sportPanel)
    
}

function createMatchList(matches, parent) {
    console.log(matches)
    let matchList = document.createElement('ul')
    matchList.className = "match-list"
    parent.appendChild(matchList)

    for (let i = 0; i < matches.length; i+=2) {
        const match = matches[i];
        
        let matchRow = document.createElement('p')
        matchRow.textContent = `${match.name} ${match.date_time}`
        matchList.appendChild(matchRow)
    }
    
}



