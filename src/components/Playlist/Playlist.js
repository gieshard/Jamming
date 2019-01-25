import React,{Component} from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends Component{
  constructor(props){
    super(props);
    this.state = {value:''};
    this.handleNameChange=this.handleNameChange.bind(this);

  }

  handleNameChange(event){
   this.props.onNameChange(event.target.value);
  }
  render(){
    return(
      <div className="Playlist">
        <input  onChange ={this.handleNameChange} value={this.props.plname}/>
        <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove}/>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
//defaultValue={'New Playlist'}
    );
  }
}

export default Playlist;
