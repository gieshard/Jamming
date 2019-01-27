let userAccessToken;
let expiresIn;
const clientID='d61d880aaf0d4d48bbb1ef6a9b5c3e6e';
//const redirectURI ="http://localhost:3000/";
const redirectURI ="http://capable-beef.surge.sh";
const url ='https://api.spotify.com/v1/search?type=track&q='


let tracks=[];

const Spotify={

  savePlaylist(playlistName,trackUri){
    if((!playlistName)||(!trackUri)){return;}
    let accessToken=this.getAccessToken();
    const userEndpoint="https://api.spotify.com/v1/me";
    const headerObj={headers:
      {Authorization: `Bearer ${accessToken}`}};

    let userId;
    let playlistId;

    //fetch Userid
    return fetch(userEndpoint, headerObj)
    .then(response =>{
      if(response.ok){return response.json();}})
      .then(jsonResponse=>{
         //console.log('User ID: '+jsonResponse.id);
         userId=jsonResponse.id;})
         .then(()=>{
           const playListEndpoint=`https://api.spotify.com/v1/users/${userId}/playlists`;
           const data = JSON.stringify({name:playlistName});
           const playlistRequestObj={
             method: 'POST',
             headers:{
               Authorization: `Bearer ${accessToken}`,
             'Content-Type': 'application/json'},
             body:data};
           fetch(playListEndpoint,playlistRequestObj) //create Playlist
           .then(response=>{if(response.ok){return response.json();}})
               .then(jsonResponse=>{
                 console.log(jsonResponse);
                 playlistId=jsonResponse.id;})
                 .then(()=>{
                   const addTracksEndpoint =`https://api.spotify.com/v1/playlists/${playlistId}/tracks`
                   const data =JSON.stringify({uris:trackUri});
                   const addTrackRequestObj={
                     method: 'POST',
                     headers:{
                       Authorization: `Bearer ${accessToken}`,
                     'Content-Type': 'application/json'},
                     body:data};
                  fetch(addTracksEndpoint,addTrackRequestObj)//add Tracks
                  .then(response=>{if(response.ok){return response.json();}
                       });
                  });
        })
  },

  search(searchTerm){

    let endpoint = `${url}${searchTerm}`;
    let headerObj={headers:
      {Authorization: `Bearer ${this.getAccessToken()}`}};

    return fetch(endpoint,headerObj)
    .then(response => {
      if (response.ok) {
        let jsonResponse1=response.json();
        return jsonResponse1;
      }})
       .then(jsonResponse => {
         if (!jsonResponse) return [];
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
