const URL_PREFIX = 'http://localhost:3000/';

document.addEventListener("DOMContentLoaded", () => {

    // home page
    fetch(URL_PREFIX + 'sports')
        .then(r => r.json())
        .then(renderSports)


    document.addEventListener("click", e => {

        console.log(`${e.target.className} clicked`)
        // when a sport is clicked, go to sport landing page
        if (e.target.className == 'sport-header') {

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





