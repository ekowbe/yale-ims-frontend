const URL_PREFIX = 'http://localhost:3000/';

    // home page
    fetch(URL_PREFIX + 'sports')
        .then(r => r.json())
        .then(sports => {

            renderSports(sports)

            // renderHomePageCarousel() work on other stuff for now
        })

document.addEventListener("DOMContentLoaded", () => {




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
        if (e.target.classList.contains('team-name')) {

            const team_id = e.target.dataset.id
            const sportName = document.querySelector('h1.sport').textContent

            fetch(URL_PREFIX + 'teams/' + `${team_id}`)
                .then(r => r.json())
                .then(team => {
                    console.log(sportName)
                    renderTeamLandingPage(team, sportName)
                })
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
    let teamJumbotron = document.querySelector('h1#team-name')
    let teamId = parseInt(teamJumbotron.dataset.id, 10)
    let teamSportName = teamJumbotron.dataset.sport

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
                    isUpcoming = true
                    createMatchList(teamSportName, parent, team, isUpcoming)
                    break;

                case "results-info":
                    isUpcoming = false
                    createMatchList(teamSportName, parent, team, isUpcoming)
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

function renderTeamLandingPage(team, sportName) {

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
    let teamJumbotron = teamPanelHeader.querySelector('section#team-jumbotron')
    let title = teamJumbotron.querySelector('h1')
    title.textContent = `${team.name}`
    title.dataset.id = team.id
    title.dataset.sport = sportName
    title.id = 'team-name'

    // rez co
    let rezCo = teamJumbotron.querySelector('p')
    rezCo.textContent = `${team.college.name}`

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
    matches.textContent = "Matches"
    results.textContent = "Results"
    stats.textContent = "Stats"
    squads.textContent = "Squads"

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
    // make sports-panel disappear
    let sportsPanel = document.querySelector("div#sports-panel")
    sportsPanel.style.display = "none"

    // make home-page jumbotron disappear
    let homepageJumbotron = document.querySelector("section#homepage-jumbotron")
    homepageJumbotron.style.display = "none"

    // let sport-panel appear
    let sportPanel = document.querySelector("div#sport-panel")
    sportPanel.style.display = "block"

    // name
    let sportJumbotron = document.querySelector('section#sport-jumbotron')
    let nameTag = sportJumbotron.querySelector('h1')
    nameTag.dataset.id = sport.id
    nameTag.className = 'sport'
    nameTag.textContent = `${sport.name}`

    // teams
    let teamNav = document.querySelector('nav#sport-panel-nav')
    let teams = sport.teams

    teams.forEach(team => {

        let teamLink = document.createElement('a')
        teamLink.classList.add("nav-link")
        teamLink.classList.add("team-name")
        // first link should be active
        if (teamNav.childElementCount === 0) {
            teamLink.classList.add("active")
        }

        // let teamImg = document.createElement('img')
        // teamImg.src = team.college.shield
        // teamLink.appendChild(teamImg)

        teamLink.dataset.id = team.id
        teamLink.textContent = `${team.name}`

        teamNav.appendChild(teamLink)
    });


    // picture carousel - work on this when working on frontend
    let carousel = document.createElement('div')
    let carouselInner = document.createElement('div')

    // upcoming fixtures
    let matches = sport.matches.filter(isNotCompleted)
    let matchBox = sportPanel.querySelector('div#upcoming-matches-list-for-sport')

    createMatchList(sport.name, matchBox)
}

function getMatchScore(match, parent) {
    let team_1_name = match.name.split(' vs ')[0]
    //let score_1 = match.match_teams[0].score
    let team_2_name = match.name.split(' vs ')[1]
    //let score_2 = match.match_teams[1].score

    // fetch to get team names
    let scoreCard = ''
    fetch(URL_PREFIX + 'teams')
        .then(r => r.json())
        .then(teams => {
            let team_1 = teams.find(({ name }) => name === team_1_name)
            let team_2 = teams.find(({ name }) => name === team_2_name)

            let mt_1 = team_1.match_teams.find(({ match_id }) => match_id === match.id)
            let mt_2 = team_2.match_teams.find(({ match_id }) => match_id === match.id)

            let team_1_score = mt_1.score
            let team_2_score = mt_2.score

            //console.log(`${team_1.name}: ${team_1_score}, ${team_2.name}: ${team_2_score}`)
            scoreCard = `Result: ${team_1_score}:${team_2_score}`
            parent.textContent = scoreCard
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

// function createMatchListByTeam(team, parent) {
//     // make sure list is unique
//     uniqMatches = team.matches.filter(function isNotDupe(match, pos) {
//         let matchId = match.id

//         // matchID shouldn't appear anywhere else before
//         const matchingMatch = matches.find(({ id }) => id === matchId)
//         return matches.indexOf(matchingMatch) === pos
//     })


    
// }

function createMatchList(sportName, parent, team=null, isUpcoming=true) {

    fetch(URL_PREFIX + 'matches')
        .then(r => r.json())
        .then(matches => {

            let matchDates = Object.keys(matches[sportName])

            // if a team parameter is given, i only want to see matches for that team
            if (team) {
                matchesByDate = {}
                //matches = matches[sportName].filter(playedByThisTeam, team)
                matchesForThisSport = matches[sportName]
                
                for (const date in matchesForThisSport) {
                    
                    if (Object.hasOwnProperty.call(matchesForThisSport, date)) {
                        const matchesOnDate = matchesForThisSport[date];
    
                        // filter matches by date for this team
                        matchesByDateForTeam = matchesOnDate.filter(playedByThisTeam, team)
                        
                        matchesByDate[date] = matchesByDateForTeam
                    }
                }
                // make an array of dates
                matchesForThisSport = matchesByDate

                matchDates = Object.keys(matchesForThisSport)

                for (const date in matchesForThisSport) {
                    if (Object.hasOwnProperty.call(matchesForThisSport, date)) {
                        if (matchesForThisSport[date].length === 0) {
                            let i = matchDates.indexOf(date)
                            matchDates.splice(i, 1)
                        }
                    }
                }   
                
            }
            
            // match list differs depending on whether we want past or upcoming
            let matchDatesToShow = matchDates
            if (isUpcoming) {
                matchDatesToShow = matchDates.filter(isNotCompletedII) 
            } else {
                matchDatesToShow = matchDates.filter(isCompletedII) 
            }

            // list the matches on each date
            matchDatesToShow.forEach(date => {
                
                // make a row for the date
                let dateDiv = document.createElement('div')
                dateDiv.classList.add("row", "p-2")

                let dateDivText = document.createElement('h3')
                dateDivText.textContent = date

                // make a list group for the matches following
                let matchList = document.createElement('ul')
                matchList.classList.add("list-group", "list-group-flush")

                // for each matchup
                matches[sportName][date].forEach(match => {
                    if (team) {

                        if (!match.name.includes(team.name)) {
                            return
                        }
                    }
                    // make a row for the matchup
                    let matchRow = document.createElement('li')
                    matchRow.classList.add("list-group-item", "justify-content-between", "align-items-center")
                    
                    let matchName = document.createElement('p')
                    matchName.classList.add("float-left")
                    matchName.textContent = match.name
                    matchRow.appendChild(matchName)

                    if (isUpcoming) {
                        let matchTime = document.createElement('p')
                        matchTime.textContent = `Time: ${formatTime(match.date_time)}`
                        matchTime.classList.add("float-right")
                        matchRow.appendChild(matchTime)
                    } else {
                        let matchScore = document.createElement('p')
                        getMatchScore(match, matchScore)
                        matchScore.classList.add("float-right")
                        matchRow.appendChild(matchScore)
                    }

                    
                    
                    matchList.appendChild(matchRow)
                });

                // appendages
                dateDiv.appendChild(dateDivText)
                parent.appendChild(dateDiv)
                parent.appendChild(matchList)


            }); 
        })
}

function name(params) {
    
}

function playedByThisTeam(match) {
    let matches = this.matches
    return matches.find(({ id }) => id === match.id)
}

function formatTime(dateTime) {
    
    let fullDate = new Date(dateTime)
    let fullTime = fullDate.toString().split(' ')[4]
    let formattedTime = fullTime.slice(0,5)
    return formattedTime
    
}

function formatDate(date) {
    let fullDate = new Date(date)
    let formattedDate = fullDate.toDateString()

    return formattedDate
}

function isNotCompletedII(date) {

    let dateFormatted = Date.parse(date)
    let today = new Date();
    let todayFormatted = Date.parse(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())

    return dateFormatted > todayFormatted
}

function isCompletedII(date) {  
    let dateFormatted = Date.parse(date)
    let today = new Date();
    let todayFormatted = Date.parse(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())

    return dateFormatted < todayFormatted
    
}



