const mainModule = (() => {


    const initShows = () => {
        $.get('http://api.tvmaze.com/shows')
            .done(onSuccessHandler)
            .fail(onErrorHandler);
    }
    const onErrorHandler = () => {
        alert(UIModule.status.ERROR);
    }

    const onSuccessHandler = (response) => {        
        let dataResponse = dataModule.adaptShowsResponse(response, 50);
        UIModule.createMainEverything(dataResponse);
   }


    const liveSearch = () => {
        let searchValue = $(UIModule.UISelectors.checkSearch);
        $.get(`http://api.tvmaze.com/search/shows?q=${searchValue.val()}`)        
        .done(onSuccessSearchHandler)
        .fail(onErrorSearchHandler);     
    }

    const onErrorSearchHandler = () => {
         alert(UIModule.status.ERROR);
    }

    const onSuccessSearchHandler = ((response) => {
        let marker = ''; 
        return (response) => { 
            if (JSON.stringify(response) != marker) {
                const dataResponse = dataModule.adaptShowsResponse(response, 10);
                UIModule.createDropDown(dataResponse);
            }
            marker = JSON.stringify(response);
        }
    })()
        
    // --------------- single page code part

    const initSingle = () => {
        $.get(`http://api.tvmaze.com/shows/${dataModule.fetchID()}?embed[]=seasons&embed[]=episodes&embed[]=cast&embed[]=crew&embed[]=akas`)
        .done(onSuccessSingleHandler)
        .fail(onErrorSingleHandler);
    }
    
    const onSuccessSingleHandler = (response) => {
        console.log(response);
        const dataResponse = dataModule.adaptSingleResponse(response);        
        console.log(dataResponse);
        UIModule.createSingleShowPage(dataResponse);
    }
    
    const onErrorSingleHandler = () => {
        alert(UIModule.status.ERROR);
    }


    const setAndClear = (() => {
        let interval;
        $(UIModule.UISelectors.checkSearch)[0].addEventListener('focus', () => {
            interval = setInterval(liveSearch, 1000);
        })
        $(UIModule.UISelectors.checkSearch)[0].addEventListener('blur', () => {
            clearInterval(interval);
        })
    })()

    return {
        initShows,
        initSingle
    }
})();