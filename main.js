var app = angular.module('hangmanApp', []);

app.controller('hangmanCtrl', ['$scope','$http', function($scope,$http){

  $scope.letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  $scope.guessed = [' ','-','_'];

  $scope.word = ['h','a','n','g','m','a','n'];

  $scope.incorrect = [];
  $scope.allowableincorrect = function(){
    var count = 0;
    var found = [];
    $scope.word.every(function(el){
      if(found.indexOf(el) > -1){ /* do nothing */ }
      else { found.push(el); count++; }
      return true;
    });
    if(count < 6) { return 6; }
    else if(count > 10 ) { return 10; }
    else { return count; }
  };

  $scope.win = false;
  $scope.lose = false;

  $scope.processWordsAPI = function(){
    var retrieve = 25;
    var apikey = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
    var mincorpus = 5;
    var mindictionary = 25;
    var wordnikURL = 'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&minCorpusCount=' + mincorpus + '&maxCorpusCount=-1&minDictionaryCount=' + mindictionary + '&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=' + retrieve + '&api_key=' + apikey;

    $http({
      method: 'GET',
      url: wordnikURL
    }).then(function successCallback(response){
      response.data.every(function(entry){
        $scope.words.push(entry.word.toLowerCase());
        return true;
      });
    }, function errorCallback(response){
      console.log("failed to get new words: " + response);
      $scope.words.concat(['banana','cautious','dictionary','enormous','ridiculous','colorado','behavior','cringe','holiday'])
    });
  }

  $scope.words = [];
  $scope.processWordsAPI();

  $scope.randomword = function(){
    if($scope.words.length <= 0){
      return "ran out of words".split("");
    } else if($scope.words.length <= 3){
      //TODO: pull in new words from api
      console.log("fetch new words from API");
      $scope.processWordsAPI();
    }
    console.log($scope.words);
    var random = Math.floor((Math.random() * $scope.words.length) + 0);
    var popped = $scope.words.splice(random,1);
    return popped[0].split("");
  };

  $scope.guess = function(letter){
    $scope.guessed.push(letter);
    if(this.word.indexOf(letter) != -1){
      var success = 1;
      $scope.word.every(function(c){
        if($scope.guessed.indexOf(c) != -1){ success=1; return true; }
        else { success=0; return false; }
      });
      if(success == 1){ $scope.win = true; }
    } else {
      $scope.incorrect.push(letter);
      if($scope.incorrect.length >= $scope.allowableincorrect()){
        $scope.lose = true;
      }
    }
  };

  $scope.restart = function(){
    $scope.guessed = [' ','-','_'];
    $scope.word = $scope.randomword();
    $scope.incorrect = [];
    $scope.win = false;
    $scope.lose = false;
  };

  $scope.calcWidth = function(input) {
    return {width : input + '%'};
  }

}]);

app.directive('hangmanGame', function(){
  return {
    restrict: 'E',
    template: '<div style="text-align: center; margin-bottom: 20px;"><h1 style="padding: 5px; min-width: 25px; display: inline-block; margin: 2px; background: #e6e6e6;" ng-class="{red:(lose && (guessed.indexOf(char) == -1))}" ng-repeat="char in word track by $index">{{ ((guessed.indexOf(char) != -1) || lose) ? char : "_" }}</h1></div><hangman-keyboard></hangman-keyboard><hangman-scoreboard></hangman-scoreboard>'
  };
});

app.directive('hangmanKeyboard', function(){
  return {
    restrict: 'E',
    template: '<div ng-hide="win || lose"><button ng-repeat="letter in letters" value="{{letter}}" ng-disabled="guessed.indexOf(letter) != -1" ng-click="guess(letter)" style="width: 25px; padding: 5px; margin: 2px;">{{letter}}</button></div>'
  };
});

app.directive('hangmanScoreboard', function(){
  return {
    restrict: 'E',
    template: '<div><h1 ng-show="win">YOU WIN!</h1><h1 ng-show="lose">YOU LOSE!</h1><h1 class="red">Incorrect Guesses: {{incorrect.length}} / {{allowableincorrect()}}</h1><div style="width: 100%; max-width: 600px; height: 15px; background: #e6e6e6;"><div style="float: left; background: red; height: 15px; min-width: 1px;" ng-style="calcWidth((incorrect.length/allowableincorrect())*100)"></div></div><div><button ng-show="win || lose" ng-click="restart()">new game</button></div></div>'
  };
});
