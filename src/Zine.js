import React, { Component } from 'react';
import './Zine.css';
import { Link } from 'react-router-dom'
import Viewer from './Viewer';



class Zine extends Component {
  componentDidMount() {
    fetch(`https://s3.amazonaws.com/zinediscovery/${this.props.match.params.name}/meta/data.json`)
    .then(response => response.json())
    .then((data) => {
      // inital data
      
      data.labels = []
      data.colors = []
      data.hasFaces = false
      data.wordCount = 0

      Object.keys(data.pageData).map((page)=>{
        var faceCount = 1
        data.pageData[page].labelsProcessed = data.pageData[page].lables.map((l)=>{
          if (data.labels.indexOf(l.desc)===-1) data.labels.push(l.desc)
          return l.desc
        })
        data.pageData[page].facesProcessed = this.buildFaces(data.pageData[page].faces).map((f) => {
          data.hasFaces = true
          return `Face #${faceCount++} ${f.features.join(',')}`
        })
        data.pageData[page].colorsProcessed = data.pageData[page].properties.colors.map((l)=>{
          if (data.colors.indexOf(l.hex)===-1) data.colors.push(l.hex)
          return l.hex
        })       

        if (data.pageData[page].text[0]){
          data.pageData[page].textProcessed = data.pageData[page].text[0].desc
          data.wordCount = data.wordCount + data.pageData[page].textProcessed.split(' ').length
        }else{
          data.pageData[page].textProcessed = ''
        }
      })   
      
      this.setState({ data: data, displayFaceOverlay: true})
    });
  }
  buildFaces(faceData){

  	var results = []

  	faceData.forEach((f)=>{
  		if (f.bounds.face){
  			var face = {features:[]}
  			face.x = f.bounds.face[0].x
  			face.y = f.bounds.face[0].y
  			face.width = f.bounds.face[2].x - f.bounds.face[0].x
  			face.height = f.bounds.face[2].y - f.bounds.face[0].y

        if (f.anger) face.features.push('anger')
        if (f.blurred) face.features.push('blurred')
        if (f.headwear) face.features.push('headwear')
        if (f.joy) face.features.push('joy')
        if (f.sorrow) face.features.push('sorrow')
        if (f.surprise) face.features.push('surprise')
        if (f.underExposed) face.features.push('underExposed')

  			results.push(face)
  		}

  	})

  	
  	return results
  }
  showFaces(){

      this.setState({ displayFaceOverlay:true })

  } 
  render() {

    // not loaded yeeet
    if (!this.state) return <div className="Zine">Loading data 😑</div>
    
    

    return (
      <div className="Zine">
            <h5 className="back-link"><Link to="/">&nbsp;&nbsp;👈&nbsp;&nbsp;Back To Index</Link></h5>
            <div key={this.state.data.id} className="list-zine">              
              <div className="list-zine-item list-zine-item-meta">
                <div className="ui divided selection list">
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Zine Title (from IA)" data-inverted="">Title</div>
                    <span className="item-text">{this.state.data.iaTitle}</span>
                  </a>
                  <div className="item">
                    <div className="ui horizontal basic label" data-tooltip="Internet Archive Id" data-inverted="">IA</div>
                    <span className="item-text"><a href={this.state.data.iaURL}>{this.state.data.id}</a></span>
                  </div>
                  
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Number of Pages" data-inverted="">Pages</div>
                    <span className="item-text">{this.state.data.pageCount}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Word Count/OCR (Google Vision)" data-inverted="">Words</div>
                    <span className="item-text">{this.state.data.wordCount}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Creator (from IA)" data-inverted="">Creator</div>
                    <span className="item-text">{this.state.data.iaCreator}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Subjects (from IA)" data-inverted="">Subjects</div>
                    <span className="item-text">{this.state.data.iaSubject.split(';').join(', ')}</span>
                  </a>                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Subjects from topic modeling (enrichment)" data-inverted="">LDA</div>
                    <span className="item-text">{this.state.data.lda.join(', ')}</span>
                  </a>                  
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Labels detected (Google Vision)" data-inverted="">Labels</div>
                    <span className="item-text">{this.state.data.labels.join(', ')}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Faces detected (Google Vision)" data-inverted="">Faces</div>
                    <span className="item-text">{this.state.data.hasFaces.toString()}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Dominant Colors (Google Vision)" data-inverted="">Colors</div>
                    <span className="item-text">
                      {this.state.data.colors.map(function(color){
                        return <div key={color} className="square" data-tooltip={color} style={{backgroundColor: `#${color}`}}></div>
                      })
                    }</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Description (from IA)" data-inverted="">Desc</div>
                    <span className="item-text">{this.state.data.iaDescription}</span>
                  </a>

                </div>                


              </div>
            </div>


      {
      	Object.keys(this.state.data.pageData).map((page)=>{
          var data = this.state.data.pageData[page]

      		return (            

            <div key={'page-item-' + page} className="page">
              <hr/>

              <h5>{page} <a href={`https://s3.amazonaws.com/zinediscovery/${this.props.match.params.name}/pages/${page}`}>Hi-rez Image</a></h5>
  		      	<div key={`page-item-${page}`} className="page-item-holder">

  			      	<div className="page-item">
  			        	<Viewer zine={this.props.match.params.name} displayFaceOverlay={this.state.displayFaceOverlay} faces={this.buildFaces(this.state.data.pageData[page].faces)} page={page}/>
  			        </div>
  			        <div className="page-item page-item-meta">

                  <div className="ui divided selection list">
                 
                    <a className="item">
                      <div className="ui horizontal basic label" data-tooltip="Labels detected (Google Vision)" data-inverted="">Labels</div>
                      <span className="item-text">{(data.labelsProcessed) ? data.labelsProcessed.join(', ') : ''}</span>
                    </a>
                    <a className="item">
                      <div className="ui horizontal basic label" data-tooltip="Faces detected (Google Vision)" data-inverted="">Faces</div>
                      <span className="item-text">{data.facesProcessed.join(' ')}</span>
                    </a>
                    <a className="item">
                      <div className="ui horizontal basic label" data-tooltip="Dominant Colors (Google Vision)" data-inverted="">Colors</div>
                      <span className="item-text">
                        {data.colorsProcessed.map(function(color){
                          return <div key={data.id + '-' + color} className="square" data-tooltip={color} style={{backgroundColor: `#${color}`}}></div>
                        })
                      }</span>
                    </a>   
                    <a className="item">
                      <div className="ui horizontal basic label" data-tooltip="OCR Text (Google Vision)" data-inverted="">Text</div>
                    </a>
                    <textarea className="item-text-area" defaultValue={data.textProcessed}/>
                      


                      

                  </div>  

  			        </div>
  			      </div>
            </div>
      		)
      	})
      }
      </div>
    );
  }
}

export default Zine;
