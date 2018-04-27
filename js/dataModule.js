const dataModule = (() => {

    class Show {

        constructor(name, image = 'http://en.docsity.com/wordpress/wp-content/uploads/sites/2/2014/02/programmers-be-like.jpg', showID) {
            this.name = name;
            this.image = image;
            this.id = showID;

        }
    }
    class SingleShow extends Show {

        constructor(name, image, showID, info) {
            super(name, image, showID)
            this.info = info;
            this.seasons = [];
            this.cast = [];
            this.crew = []
            this.akas = [];
            this.episodes = [];
        }
        addSeason(season) {
            this.seasons.push(season);
        }
        addCast(cast) {
            this.cast.push(cast);
        }
        addCrew(crew) {
            this.crew.push(crew);
        }
        addAkas(aka) {
            this.akas.push(aka);
        }
        addEpisodes(episodes) {
            this.episodes.push(episodes);
        }
    };

    class Season {
        constructor(startDate, endDate) {
            this.startDate = startDate;
            this.endDate = endDate;
        }
        getInfo() {
            return `${this.startDate} - ${this.endDate}`;
        }
    }

    class Actor {
        constructor(name) {
            this.name = name;
        }
        getInfo() {
            return this.name;
        }
    }

    class CrewMember {
        constructor(name, type) {
            this.name = name;
            this.type = type;
        }
        getInfo() {
            return `${this.type}: ${this.name}`;
        }
    }

    class Aka {
        constructor (aka, country) {
            this.aka = aka;
            this.country = country; 
        }
        getInfo () {
            if (this.country) {
                return `${this.aka}, in ${this.country}`;
            } else {
                return this.aka;
            }
        }
    }

    class Episode {
        constructor (name, season, number) {
            this.name = name;
            this.season = season;
            this.number = number;
        }
        getInfo (){
            return `${this.name}, season: ${this.season} number: ${this.number}`;
        }
    }

    const createShow = (name, image, showID) => new Show(name, image, showID);

    const createSingleShow = (name, image, showID, info) => new SingleShow(name, image, showID, info);

    const createSeason = (startDate, endDate) => new Season(startDate, endDate);

    const createActor = (name) => new Actor(name);

    const createCrewMember = (name, type) => new CrewMember(name, type);

    const createAka = (name,country) => new Aka(name, country)

    const createEpisode = (name, date, number) => new Episode (name, date, number);

    // ---------------dropDown menu and page creators in single stroke------------------ //
    const createShowsArray = (showsResponse) => {
        let showsArray = [];
        let name, image, id;
        showsResponse.forEach((show, index) => {
            if (show.name) {
                name = show.name;
                image = show.image.medium;
                id = show.id;
            } else {
                name = show.show.name;
                image = undefined;
                id = show.show.id;
            }
            showsArray[index] = createShow(name, image, id);
        });
        return showsArray;
    }

    const adaptShowsResponse = (showsResponse, showsOnPage) => {
        showsResponse.splice(showsOnPage);
        return createShowsArray(showsResponse);
    }
    //-------------------------------- single show obj----------------------- //
    const fetchID = () => parseInt(location.href.slice(location.href.indexOf('id=')+3));

    const showCrew = (showResponse, maxNumber, singleShowObj) => {
        showResponse._embedded.crew.splice(maxNumber);
        showResponse._embedded.crew.forEach(crewMember => {
            singleShowObj.addCrew(createCrewMember(crewMember.person.name, crewMember.type));  
        })
    }

    const showCast = (showResponse, maxNumber, singleShowObj) => {
        showResponse._embedded.cast.splice(maxNumber);
        showResponse._embedded.cast.forEach(actor => {
            singleShowObj.addCast(createActor(actor.person.name));  
        })
    }
    const showSeasons = (showResponse, singleShowObj) => {
        showResponse._embedded.seasons.forEach(season => {
            singleShowObj.addSeason(createSeason(season.premiereDate, season.endDate));  
        })
    }
    const showAkas = (showResponse, singleShowObj) => {
        if (showResponse._embedded.akas == null) return;     
        let countryName = '';   
        showResponse._embedded.akas.forEach(aka =>{
            if (!aka.country ) {
                countryName = '';
            } else {
                countryName = aka.country.name;
            }   
            singleShowObj.addAkas(createAka(aka.name, countryName))
        })
    }
    
    
    const adaptSingleResponse = (showResponse) => {
        var singleShowObj = createSingleShow(showResponse.name,showResponse.image.medium, showResponse.id, showResponse.summary);
        showSeasons(showResponse, singleShowObj);
        showCast(showResponse, 10, singleShowObj);
        showCrew(showResponse, 10, singleShowObj);
        showAkas(showResponse, singleShowObj);
        showEpisodes(showResponse, singleShowObj);
        
        return singleShowObj;
    }
    
    const showEpisodes = (showResponse, singleShowObj) => {
        showResponse._embedded.episodes.forEach(episode => {
            singleShowObj.episodes.push(createEpisode(episode.name, episode.season, episode.number));
        })
    }
    return {
        createActor,
        createSeason,
        createShow,
        createSingleShow,
        adaptShowsResponse,
        fetchID,
        adaptSingleResponse
    }

})();