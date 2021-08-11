const URL_PREFIX = 'http://localhost:3000/';

document.addEventListener("DOMContentLoaded", () => {

    // home page
    fetch(URL_PREFIX + 'sports')
        .then(r => r.json())
        .then(sports => {

            renderSports(sports)

            // renderHomePageCarousel() work on other stuff for now
        })


    document.addEventListener("click", e => {
        //log to check what I've clicked
        console.log(`${e.target.className} clicked`)
        
        // when a sport is clicked, go to sport landing page
        if (e.target.classList.contains('sport-header')) {

            const sport_id = e.target.dataset.id

            fetch(URL_PREFIX + 'sports/' + `${sport_id}`)
                .then(r => r.json())
                .then(renderSportLandingPage)
        }

        // when a team is clicked, go to team landing page
        if (e.target.className === 'team-name') {

            const team_id = e.target.dataset.id

            fetch(URL_PREFIX + 'teams/' + `${team_id}`)
                .then(r => r.json())
                .then(renderTeamLandingPage)
        }

        // when a section in the team landing page is clicked, show details about that section
        if (e.target.classList.contains('info')) {

            let section = e.target.classList.value.split(' ')[1]
            let parent = document.querySelector(`div#${section}`)

            renderTeamSection(section, parent)
        }
    })

})

function renderHomePageCarousel() {
    let homePageCarousel = document.querySelector("div#home-page-carousel")
    let homePageCarouselInner = homePageCarousel.querySelector("div.carousel-inner")

    let numPics = 10

    for (let i = 0; i < numPics; i++) {
        // create div for carousel item
        let carouselItem = document.createElement('div')
        carouselItem.classList.add("carousel-item")
        
        // first item should be active else carousel won't show
        if (homePageCarouselInner.childElementCount === 2) {
            carouselItem.classList.add("active")
        }

        // get carousel img from folder
        let carouselItemImage = document.createElement('img')
        carouselItemImage.src = `src/sport-images/basketball/${i+1}.jpg`
        
        // appendages
        carouselItem.appendChild(carouselItemImage)
        homePageCarouselInner.prepend(carouselItem)
            
    }

}

function renderTeamSection(section, parent) {

    let teamId = parseInt(document.querySelector('h2#team-name').dataset.id, 10)
    let teamPanelSectionContent = document.querySelector('div#team-panel-section-content')
    teamPanelSectionContent.style.display = 'block'
    parent.style.display = "block"

    let content = document.createElement('p')

    // consider making the fetch before the switch
    fetch(URL_PREFIX + 'teams/' + `${teamId}`)
        .then(r => r.json())
        .then(team => {
            let matches = team.matches
            switch (section) {
                case "squads-info":
                    content.textContent = "this is the squads info section"
                    // get the squad 
                    renderPlayerList(team, parent) // consider merging this with createMatchList
                    break;

                case "matches-info":
                    content.textContent = "this is the matches info section"
                    let upcomingMatches = matches.filter(isNotCompleted)
                    createMatchList(upcomingMatches, parent)
                    break;

                case "results-info":
                    content.textContent = "this is the results info section"
                    let completedMatches = matches.filter(isCompleted)
                    createMatchList(completedMatches, parent)
                    break;

                case "stats-info":
                    content.textContent = "this is the stats info section"
                    createStatsList(team, parent)
                    break;

                default:
                    break;
            }
        })

    parent.appendChild(content)

}

function createStatsList(team, parent) {
    let statsList = document.createElement('ul')
    statsList.className = "stats-list"
    parent.appendChild(statsList)

    // stats: number of matches played, won and lost
    let matchesPlayedLi = document.createElement('li')
    let matchesWonLi = document.createElement('li')
    let matchesLostLi = document.createElement('li')

    // add content
    matchesPlayedLi.textContent = `Matches Played: ${getNumMatchesPlayed(team)}`
    matchesWonLi.textContent = `Matches Won: ${getNumMatchesWon(team)}`
    matchesLostLi.textContent = `Matches Lost: ${getNumMatchesLost(team)}`

    // append
    statsList.appendChild(matchesPlayedLi)
    statsList.appendChild(matchesWonLi)
    statsList.appendChild(matchesLostLi)
    parent.appendChild(statsList)

}

function getMatchesPlayed(team) {
    let matches = team.matches
    let matchesPlayed = matches.filter(isCompleted)
    return matchesPlayed
}

function getNumMatchesPlayed(team) {
    let matchesPlayed = getMatchesPlayed(team)
    return matchesPlayed.length
}

function getNumMatchesWon(team) {
    let won_matches = team.match_teams.filter(isMatchWon)
    return won_matches.length
}

function getNumMatchesLost(team) {
    let numMatchesPlayed = getNumMatchesPlayed(team)
    let numMatchesWon = getNumMatchesWon(team)
    let numMatchesLost = numMatchesPlayed - numMatchesWon
    return numMatchesLost
}

function isCompleted(match) {
    return match.is_completed
}

function isMatchWon(match_team) {
    return match_team.is_winner
}

function isNotCompleted(match) {
    return !match.is_completed
}

function renderPlayerList(team, parent) {

    // pick the players in the current team
    let currentTeamPlayers = team.players
    let playerList = document.createElement('ul')

    // generate list of players 
    currentTeamPlayers.forEach(player => {
        let playerLi = document.createElement('li')
        playerLi.textContent = `${player.first_name} ${player.last_name}`
        playerList.appendChild(playerLi)
    });

    parent.appendChild(playerList)
}

function isInCurrentTeam(player) {
    return player.team_id == this
}

function renderTeamLandingPage(team) {

    // let sport-panel disappear
    let sportPanel = document.querySelector("div#sport-panel")
    sportPanel.style.display = "none"

    // let team-panel appear
    let teamPanel = document.querySelector("div#team-panel")
    teamPanel.style.display = "block"

    // put title and rez co in header
    let teamPanelHeader = document.querySelector("div#team-panel-header")
    teamPanelHeader.style.display = "block"

    // title
    let title = document.createElement('h2')
    title.textContent = `${team.name}`
    title.dataset.id = team.id
    title.id = 'team-name'
    teamPanelHeader.appendChild(title)

    // rez co
    let rezCo = document.createElement('h3')
    rezCo.textContent = `College: ${team.college.name}`
    teamPanelHeader.appendChild(rezCo)


    // links for matches, results, stats, squads
    let infoDiv = document.querySelector('div#info-div')
    infoDiv.style.display = "block"

    let matches = document.createElement('a')
    matches.id = "matches-info"
    matches.classList.add("info")
    matches.classList.add("matches-info")

    let results = document.createElement('a')
    results.id = "results-info"
    results.classList.add("info")
    results.classList.add("results-info")

    let stats = document.createElement('a')
    stats.id = "stats-info"
    stats.classList.add("info")
    stats.classList.add("stats-info")

    let squads = document.createElement('a')
    squads.id = "squads-info"
    squads.classList.add("info")
    squads.classList.add("squads-info")


    // set text for links
    matches.textContent = "Matches  "
    results.textContent = "Results  "
    stats.textContent = "Stats  "
    squads.textContent = "Squads  "

    // line break
    addLineBreak(teamPanel)

    infoDiv.append(matches, results, stats, squads)

}

function addLineBreak(parent) {
    let br = document.createElement('br')
    parent.appendChild(br)
}

function renderSports(sports) {
    // select sports panel
    let sportsPanel = document.querySelector("div#sports-panel")
    sportsPanel.style.display = "block"

    // the following code sets up the sports in nice boxes. it's quite pretty
    let sportsContainer = sportsPanel.querySelector('div')
    
    let sportsRow = sportsContainer.querySelector('div')

    sports.forEach(sport => {
        // code for bordering and prettiness
        let sportColumn = document.createElement('div')
        sportColumn.className = "col-md-4"

        let sportCard = document.createElement('div')
        sportCard.classList.add("card", "mb-4", "box-shadow", "text-white")

        let sportImg = document.createElement('img')
        sportImg.dataset.src = "holder.js/100px225?theme=thumb&bg=55595c&fg=eceeef&text=Thumbnail"
        sportImg.style.height = "225px"
        sportImg.style.width = "100%"
        sportImg.src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22208%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20208%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17b30b02b30%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A11pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17b30b02b30%22%3E%3Crect%20width%3D%22208%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2266.9296875%22%20y%3D%22117.45%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"

        let cardBody = document.createElement('div')
        cardBody.classList.add("card-img-overlay")
        
        let cardTitle = document.createElement('h5')
        cardTitle.className = "card-title"
        cardTitle.textContent = `${sport.name}`
        
        let cardStretchedLink = document.createElement('a')
        cardStretchedLink.href = "#"
        cardStretchedLink.classList.add("stretched-link", "sport-header")
        cardStretchedLink.dataset.id = sport.id

        // add to doc
        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardStretchedLink)
        sportCard.appendChild(sportImg)
        sportCard.appendChild(cardBody)
        sportColumn.appendChild(sportCard)
        sportsRow.appendChild(sportColumn)
    });

    sportsContainer.appendChild(sportsRow)
    sportsPanel.appendChild(sportsContainer)

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

    // teams
    let teamSpans = document.createElement('div')
    teamSpans.className = 'team-list'
    let teams = sport.teams

    teams.forEach(team => {
        let teamSpan = document.createElement('span')
        teamSpan.className = 'team-name'
        teamSpan.dataset.id = team.id
        teamSpan.textContent = `${team.name}  `
        teamSpans.appendChild(teamSpan)
    });

    sportPanel.appendChild(teamSpans)


    // picture carousel - work on this when working on frontend
    let carousel = document.createElement('div')
    let carouselInner = document.createElement('div')

    // upcoming fixtures
    let matches = sport.matches

    createMatchList(matches, sportPanel)
}

function getMatchScore(match) {
    let team_1_id = match.match_teams[0].team_id
    let score_1 = match.match_teams[0].score
    let team_2_id = match.match_teams[1].team_id
    let score_2 = match.match_teams[1].score

    // fetch to get team names
    fetch(URL_PREFIX + 'teams')
        .then(r => r.json())
        .then(teams => {
            team_1 = teams.find(({ id }) => id === team_1_id)
            team_2 = teams.find(({ id }) => id === team_2_id)
            return `${team_1.name}: ${score_1}, ${team_2.name}: ${score_2}`
        })
}

function formatMatchRow(match, parent, teams) {    
    if (match.is_completed){
        //get score 
        let score_1 = match.match_teams[0].score
        let score_2 = match.match_teams[1].score
    
        // get teams 
        let team_1_id = match.match_teams[0].team_id
        let team_2_id = match.match_teams[1].team_id

        team_1 = teams.find(({ id }) => id === team_1_id)
        team_2 = teams.find(({ id }) => id === team_2_id)

        let score = `${team_1.name}: ${score_1}, ${team_2.name}: ${score_2}`
        parent.textContent = `${match.name}, Date: ${match.date_time}, Score: ${score}`
            
    } else {
        parent.textContent = `${match.name}, Date: ${match.date_time}`
    }

    
}

function createMatchList(matches, parent) {
    // make sure list is unique
    uniqMatches = matches.filter(function isNotDupe(match, pos) {
        let matchId = match.id

        // matchID shouldn't appear anywhere else before
        const matchingMatch = matches.find(({ id }) => id === matchId)
        return matches.indexOf(matchingMatch) === pos
    })

    let matchList = document.createElement('ul')
    matchList.className = "match-list"
    parent.appendChild(matchList)

    fetch(URL_PREFIX + 'teams')
        .then(r => r.json())
        .then(teams => {
            for (let i = 0; i < uniqMatches.length; i += 1) {
                const match = uniqMatches[i];

                let matchRow = document.createElement('li')
                formatMatchRow(match, matchRow, teams)

                matchList.appendChild(matchRow)
            }})

}





