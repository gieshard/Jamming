import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props){
    super(props);

    this.state={searchResults:[],playlistTracks:[],playlistName:'New Playlist' } ;
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  search(searchTerm){
    Spotify.search(searchTerm).then(searchTracks => {
      this.setState({searchResults:searchTracks});})
  }

  updatePlaylistName(plName){
    this.state.playlistName=plName;
    this.setState(this.state);
  }

  savePlaylist(){
    let trackURIs =[];
    this.state.playlistTracks.map(track =>{
      trackURIs.push(track.uri);
    });
    Spotify.savePlaylist(this.state.playlistName,trackURIs)
    this.state.playlistName='New Playlist';
    this.setState(this.state);
    this.state.playlistTracks=[];
    this.setState(this.state);
  }

  componentDidMount() {
    Spotify.getAccessToken();
   }

  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack =>
      savedTrack.id === track.id))
      {return;}
    this.state.playlistTracks.push(track);
    this.setState(this.state);
    }

  removeTrack(track){
    this.state.playlistTracks=this.state.playlistTracks.filter(removedTrack => track.id !== removedTrack.id);
    this.setState(this.state);
    }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist onSave={this.savePlaylist} playlistTracks={this.state.playlistTracks} plname={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}/>
          </div>
         </div>
      </div>
    );
  }}

  export default App;
