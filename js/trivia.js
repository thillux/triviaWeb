var triviaUrl = "https://trivia.thorbenroemer.de";
var triviaApiUrl = triviaUrl + "/api";

var app = new Vue({
  el: '#app',
  data: {
    triviaOffset: 0,
    maxTriviaID: 0,
    minTriviaID: 0,
    numTriviasPerPage: 10,
    trivias: []
  },
  methods: {
    previousPage: function (event) {
        var oldOffset = app.triviaOffset;
        app.triviaOffset = Math.max(app.minTriviaID, app.triviaOffset - app.numTriviasPerPage);
        if(app.maxTriviaID - app.triviaOffset < app.numTriviasPerPage) {
            app.triviaOffset = Math.max(app.minTriviaID, app.maxTriviaID - app.numTriviasPerPage);
        }
        if(app.triviaOffset != oldOffset) {
            fetchCurrentTrivia();
        }
    },
    nextPage: function (event) {
        var oldOffset = app.triviaOffset;
        app.triviaOffset = Math.min(app.maxTriviaID, app.triviaOffset + app.numTriviasPerPage);
        if(app.maxTriviaID - app.triviaOffset < app.numTriviasPerPage) {
            app.triviaOffset = Math.max(app.minTriviaID, app.maxTriviaID - app.numTriviasPerPage);
        }
        if(app.triviaOffset != oldOffset) {
            fetchCurrentTrivia();
        }
    }
  }
})

function cbPushData() {
    respJson = JSON.parse(this.responseText);

    // TODO: sanity checks

    app.trivias.push(respJson);
    app.trivias.sort(function(a,b) {
        return a.id < b.id;
    });
}

function fetchCurrentTrivia() {
    app.trivias = []
    for(var i = Math.min(app.maxTriviaID, app.triviaOffset + app.numTriviasPerPage); i >= app.triviaOffset; --i) {
        fetchTrivia(i, cbPushData);
    }
}

function cbGetFirst() {
  respJson = JSON.parse(this.responseText);
  app.maxTriviaID = respJson.id;
  app.minTriviaID = 1;
  if(respJson.id > app.numTriviasPerPage) {
    app.triviaOffset = respJson.id - app.numTriviasPerPage;
  } else {
    app.triviaOffset = app.minTriviaID;
  }

  fetchCurrentTrivia();
}

function fetchTrivia(id, callback) {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", callback);
    oReq.open("GET", triviaApiUrl + "/" + id);
    oReq.send();
}

fetchTrivia("latest", cbGetFirst);