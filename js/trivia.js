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
        app.triviaOffset = Math.max(app.minTriviaID, app.triviaOffset - (app.numTriviasPerPage));
        if(app.triviaOffset != oldOffset) {
            fetchCurrentTrivia();
        }
    },
    nextPage: function (event) {
        var oldOffset = app.triviaOffset;
        app.triviaOffset = Math.min(app.maxTriviaID, app.triviaOffset + (app.numTriviasPerPage));
        if(app.triviaOffset != oldOffset) {
            fetchCurrentTrivia();
        }
    }
  },
  computed: {
    orderedTrivias: function () {
      return _.orderBy(this.trivias, 'id', 'desc')
    }
  }
})

function cbPushData() {
    respJson = JSON.parse(this.responseText);

    if(!respJson.hasOwnProperty('id') || typeof respJson.id != 'number') {
      console.log("Invalid id property");
      return;
    }
    if(!respJson.hasOwnProperty('fact') || typeof respJson.fact != 'string') {
      console.log("Invalid fact property");
      return;
    }
    if(!respJson.hasOwnProperty('category') || typeof respJson.category != 'string') {
      console.log("Invalid category property");
      return;
    }

    app.trivias.push(respJson);
}

function fetchCurrentTrivia() {
    app.trivias = []
    for(var i = Math.min(app.maxTriviaID, app.triviaOffset + (app.numTriviasPerPage - 1)); i >= app.triviaOffset; --i) {
        fetchTrivia(i, cbPushData);
    }
}

function cbGetFirst() {
  try {
    respJson = JSON.parse(this.responseText);
  } catch(error) {
    console.log(error);
    return;
  }
  if(!respJson.hasOwnProperty('id') || typeof respJson.id != 'number') {
    console.log(respJson);
    console.log("Invalid id property");
    return;
  }
  if(!respJson.hasOwnProperty('fact') || typeof respJson.fact != 'string') {
    console.log("Invalid fact property");
    return;
  }
  if(!respJson.hasOwnProperty('category') || typeof respJson.category != 'string') {
    console.log("Invalid category property");
    return;
  }
  app.maxTriviaID = respJson.id;
  app.minTriviaID = 1;
  if(respJson.id > app.numTriviasPerPage) {
    app.triviaOffset = respJson.id - (app.numTriviasPerPage - 1);
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