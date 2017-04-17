import React, { Component } from 'react';
import './Viewer.css';
import { Link } from 'react-router-dom'

import OpenSeaDragon from './OpenSeaDragon';


class Viewer extends Component {
  componentDidMount() {
    let imageThumb = `https://s3.amazonaws.com/zinediscovery/${this.props.zine}/thumbs/${this.props.page}`    
    let imageLarge = `https://s3.amazonaws.com/zinediscovery/${this.props.zine}/pages/${this.props.page}`    
    this.setState({ dragonMode: false, imageThumb: imageThumb, imageLarge:imageLarge})    
  
    
  }

  dragonMode(){
    this.setState({ dragonMode: true})


  }
 
  render() {
    // not loaded yeeet
    if (!this.state) return <div className="Viewer"></div>

    if (!this.state.dragonMode){
      return (      
          <div className="Viewer" id="Viewer" onClick={() => this.dragonMode()}>
              <div className="viewer-thumb-image" style={{backgroundImage: `url(${this.state.imageThumb})`}}>
                <div className="viewer-thumb-zoom-text">Click To Zoom</div>
              </div>
          </div>      
      );
    }else{
      return (
          <OpenSeaDragon image={this.state.imageLarge} displayFaceOverlay={this.props.displayFaceOverlay} faces={this.props.faces} divId={'viewer-' + this.props.page.replace('.jpg','')}/>
      )
    }
  }
}

export default Viewer;
