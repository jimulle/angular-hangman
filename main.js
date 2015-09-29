var app = angular.module('hangmanApp', []);

app.controller('hangmanCtrl', ['$scope', function($scope){

  $scope.letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  $scope.guessed = [' '];

  $scope.word = ['h','e','l','l','o'];

  $scope.incorrect = []; //number

  $scope.win = false;

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
    }
  };

  $scope.restart = function(){
    $scope.guessed = [' '];
    $scope.word = $scope.randomword();
    $scope.incorrect = [];
    $scope.win = false;
  };

  $scope.randomword = function(){
    var words = ["orange","banana","resilient","checkweigher","ballistic","rudimentary"];
    var random = Math.floor((Math.random() * words.length) + 0);
    return words[random].split("");
  };

}]);

app.directive('hangmanGame', function(){
  return {
    restrict: 'E',
    template: '<div style="text-align: center; margin-bottom: 20px;"><h1 style="padding: 5px; min-width: 25px; display: inline-block; margin: 2px; background: #e6e6e6;" ng-repeat="char in word track by $index">{{ guessed.indexOf(char) != -1 ? char : "_" }}</h1></div><hangman-keyboard></hangman-keyboard><hangman-scoreboard></hangman-scoreboard>'
  };
});

app.directive('hangmanKeyboard', function(){
  return {
    restrict: 'E',
    template: '<div ng-hide="win"><button ng-repeat="letter in letters" value="{{letter}}" ng-disabled="guessed.indexOf(letter) != -1" ng-click="guess(letter)" style="width: 25px; padding: 5px; margin: 2px;">{{letter}}</button></div>'
  };
});

app.directive('hangmanScoreboard', function(){
  return {
    restrict: 'E',
    template: '<div><h1 ng-show="win">YOU WIN!</h1><h1 style="color:red;">Incorrect Guesses: {{incorrect.length}}</h1><div><button ng-show="win" ng-click="restart()">new game</button></div></div>'
  };
});
