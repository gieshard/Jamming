let userAccessToken;
let expiresIn;
const clientID='d61d880aaf0d4d48bbb1ef6a9b5c3e6e';
const redirectURI ="http://localhost:3000/";
const url ='https://api.spotify.com/v1/search?type=track&q='


let tracks=[];

const Spotify={

  savePlaylist(playlistName,trackUri){
    if((!playlistName)||(!trackUri)){
      return;
    }
    let accessToken = userAccessToken;
    let headerVar={Authorization: `Bearer ${userAccessToken}`};
    let userId;
    const meUrl='https://api.spotify.com/v1/me';

    return fetch(meUrl,headerVar).then(response =>{
      if(response.ok){
        return response.json();
      }}).then(jsonResponse=>{
        console.log(jsonResponse.id);
      return jsonResponse.id;})

  },

  search(searchTerm){
    let endpoint = `${url}${searchTerm}`;
    let headerObj={headers:
      {Authorization: `Bearer ${this.getAccessToken()}`}};

    return fetch(endpoint,headerObj).then(response => {
      if (response.ok) {
        let jsonResponse1=response.json();
        console.log('first then jsonresponse '+ jsonResponse1);
        return jsonResponse1;
      }
      //Still needs some work
      //throw new Error('Request failed!');
    }, networkError => {
      console.log('Network Message'+ networkError.message)
    }).then(jsonResponse => {
        if (!jsonResponse.tracks) return [];
        return jsonResponse.tracks.items.map(track => {
         return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }})
        });

  },

  getAccessToken(){
    if (userAccessToken) {
      return userAccessToken;
    }
    else if((window.location.href.match(/access_token=([^&]*)/))&&
    (window.location.href.match(/expires_in=([^&]*)/))){

      let currentUrl=window.location.href;

      let bufuserAccessToken = currentUrl.match(/access_token=([^&]*)/);
      userAccessToken=bufuserAccessToken[1];

      let bufexpiresIn =currentUrl.match(/expires_in=([^&]*)/);
      expiresIn= bufexpiresIn[1];

      window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return userAccessToken;
    }
    else{
      let redirectUrl=`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location =redirectUrl;

    }
  }

}
export default Spotify;
