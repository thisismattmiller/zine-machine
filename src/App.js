import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom'

var buildRandom = function(data){
  var random = []
  var idsAdded = []
  var getRandomIntInclusive = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  while (random.length < 100){
    var r = getRandomIntInclusive(0,data.length-1)    
    var id = data[r].id
    if (idsAdded.indexOf(id)===-1){      
      idsAdded.push(id)
      random.push(data[r])
    }
  }  
  return random
}
var buildAlpha = function(data,min,max){  
  var lookup ={}
  var ids = []
  var results = []
  data.forEach((zine)=>{
    ids.push(zine.id)
    lookup[zine.id] = zine
  })

  ids.sort()

  for (var x = min; x <= max; x++){
    if (lookup[ids[x]])
      results.push(lookup[ids[x]])
  }
  return results
}
var buildTextLevel = function(data,level){  
  var results = []
  data.forEach((zine)=>{
    if (level === 1 && zine.wordCount <= 4104){
      results.push(zine)
    }
    if (level === 2 && zine.wordCount > 4104 && zine.wordCount <= 8692){
      results.push(zine)
    }    
    if (level === 3 && zine.wordCount > 8692){
      results.push(zine)
    }    
  })

  return results
}
var buildFaces = function(data){  
  var results = []
  data.forEach((zine)=>{
    if (zine.hasFaces){
      results.push(zine)
    }
  })

  return results
}


class App extends Component {
  componentDidMount() {
    fetch('https://s3.amazonaws.com/zinediscovery/index.json')
    .then(response => response.json())
    .then((data) => {
      // inital data
      this.setState({ data: data, renderData: buildRandom(data) })
    });
  }
  populate(type,min,max){
    if (type === 'random'){
      this.setState({ data: this.state.data, renderData: buildRandom(this.state.data) })
    }
    if (type==='alpha'){
      this.setState({ data: this.state.data, renderData: buildAlpha(this.state.data,min,max) })
    }
    if (type==='text'){
      this.setState({ data: this.state.data, renderData: buildTextLevel(this.state.data,min) })
    }
    if (type==='faces'){
      this.setState({ data: this.state.data, renderData: buildFaces(this.state.data) })
    }
  }
  render() {

    // not loaded yeeet
    if (!this.state) return <div className="App">Loading data 😑</div>


    return (
      <div className="App">

        <h4>A tool for evaluating Google Vision API on a Zine corpus: <a href="https://medium.com/@thisismattmiller/zines-vs-google-vision-api-part-1-process-535ea731237b">Read more about it here</a>. The buttons below limit down a part of the ~800 zines from <a href="https://archive.org/details/solidarityrevolutionarycenter">the collection</a>.</h4>
        <hr/>
        <div className="five ui buttons">
          <button className="ui button" onClick={() => this.populate('random')}>Random 100</button>
          <button className="ui button" onClick={() => this.populate('alpha',0,200)}>0-200</button>
          <button className="ui button" onClick={() => this.populate('alpha',200,400)}>200-400</button>
          <button className="ui button" onClick={() => this.populate('alpha',400,600)}>400-600</button>
          <button className="ui button" onClick={() => this.populate('alpha',600,900)}>600-800</button>
        </div>
        <div className="five ui buttons">
          <button className="ui button" onClick={() => this.populate('text',1)}>Text Light</button>
          <button className="ui button" onClick={() => this.populate('text',2)}>Text Medium</button>
          <button className="ui button" onClick={() => this.populate('text',3)}>Text Heavy</button>
          <button className="ui button" onClick={() => this.populate('faces')}>Has Faces</button>
        </div>

        {
          this.state.renderData.map(function(zine) {
            return (<div key={zine.id} className="list-zine">
              
              <div className="list-zine-item list-zine-item-photo">
                <Link to={`/zine/${zine.id}`}>
                  <img src={zine.titlePage}/>
                </Link>
              </div>
              <div className="list-zine-item list-zine-item-meta">
                <div className="ui divided selection list">
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Zine Title (from IA)" data-inverted="">Title</div>
                    <span className="item-text">{zine.iaTitle}</span>
                  </a>
                  <div className="item">
                    <div className="ui horizontal basic label" data-tooltip="Internet Archive Id" data-inverted="">IA</div>
                    <span className="item-text"><a href={zine.iaURL}>{zine.id}</a></span>
                  </div>
                  
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Number of Pages" data-inverted="">Pages</div>
                    <span className="item-text">{zine.pageCount}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Word Count/OCR (Google Vision)" data-inverted="">Words</div>
                    <span className="item-text">{zine.wordCount}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Creator (from IA)" data-inverted="">Creator</div>
                    <span className="item-text">{zine.iaCreator}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Subjects (from IA)" data-inverted="">Subjects</div>
                    <span className="item-text">{zine.iaSubject.join(', ')}</span>
                  </a>                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Subjects from topic modeling (enrichment)" data-inverted="">LDA</div>
                    <span className="item-text">{zine.lda.join(', ')}</span>
                  </a>                  
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Labels detected (Google Vision)" data-inverted="">Labels</div>
                    <span className="item-text">{zine.labels.join(', ')}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Faces detected (Google Vision)" data-inverted="">Faces</div>
                    <span className="item-text">{zine.hasFaces.toString()}</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Dominant Colors (Google Vision)" data-inverted="">Colors</div>
                    <span className="item-text">
                      {zine.colors.map(function(color){
                        return <div key={zine.id + '-' + color} className="square" data-tooltip={color} style={{backgroundColor: `#${color}`}}></div>
                      })
                    }</span>
                  </a>
                  <a className="item">
                    <div className="ui horizontal basic label" data-tooltip="Description (from IA)" data-inverted="">Desc</div>
                    <span className="item-text">{zine.iaDescription}</span>
                  </a>
                  <hr/>
                    <Link to={`/zine/${zine.id}`}>
                    <button className="ui primary tiny basic button">Open</button>
                    </Link>
                </div>                


              </div>





            </div>)

          })
        }
      </div>
    );
  }
}

export default App;
