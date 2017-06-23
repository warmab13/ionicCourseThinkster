angular.module('songhop.services', [])
.factory('User', function($http, SERVER){
    var o = {
        username: false,
        session_id: false,
        favorites: [],
        newFavorites: 0 
    }

    o.auth = function(username, signingUp){
        var authRoute;

        if(signingUp){
            authRoute = 'signup'
        }else{
            authRoute = 'login'
        }

        return $http.post(SERVER.url + '/' + authRoute, {username: username});
    }

    o.addSongToFavorites = function(song){
        if(!song) return false;

        o.favorites.unshift(song);
        o.newFavorites++;
    }

    o.favoriteCount = function(){
        return o.newFavorites;
    }

    o.removeSongFromFavorites = function(song, index){
        if(!song) return false;

        o.favorites.splice(index, 1);
    }

    return o;
})
.factory('Recommendations', function($http, $q, SERVER){
 var o = {
    queue: []
 };

 var media;

 o.getNextSong = function(){
     return $http({
         method: 'GET',
         url: SERVER.url + '/recommendations'
     }).success(function(data){
        o.queue = o.queue.concat(data);
     })
 }

 o.nextSong = function(){
     o.queue.shift();

     if(o.queue.length <= 3){
         o.getNextSong();
     }
 }

 o.playCurrentSong = function(){
     var defer = $q.defer();

      media = new Audio(o.queue[0].preview_url);

      media.addEventListener("loadeddata", function(){
          defer.resolve();
      });

      media.play();

      return defer.promise;
 }

 o.haltAudio = function(){
     if(media) media.pause();
 }

 o.init = function(){
     if(o.queue.length === 0){
         return o.getNextSong();
     }else{
         return o.playCurrentSong();
     }
 }

 return o;
})
