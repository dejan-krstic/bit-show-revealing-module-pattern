let singleModule = ((UIModule, dataModule) => {

    console.log('success!')

    let container = $('.container-fluid')[0];

    let seasonReq = $.get(`${localStorage.seasonsRequest}`);
    let parsedObject = JSON.parse(localStorage.showObj);
    console.log(parsedObject.image);
    let showObject = dataModule.createSingleShow(parsedObject.title, parsedObject.image, parsedObject.id, parsedObject.details);

    let data;

    seasonReq.done(() => {
        data = JSON.parse(seasonReq.responseText);
        data._embedded.seasons.forEach(season => {
            let s = dataModule.createSeason(season.premiereDate, season.endDate);
            showObject.seasons.push(s);
            
        });
        data._embedded.cast.forEach(cast => {
            let c = dataModule.createCast(cast.person.name);
            showObject.cast.push(c);
        })

        console.log(showObject);

        UIModule.createSingleInfo(showObject);






    })

})(UIModule, dataModule);