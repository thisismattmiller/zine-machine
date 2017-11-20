import React, { Component } from 'react';
import './Crops.css';
import { Link } from 'react-router-dom'




class Crops extends Component {
  componentDidMount() {
    let imageThumb = `https://s3.amazonaws.com/zinediscovery/${this.props.zine}/thumbs/${this.props.page}`    
    let imageLarge = `https://s3.amazonaws.com/zinediscovery/${this.props.zine}/pages/${this.props.page}`  
    let baseCropUrl =   `https://s3.amazonaws.com/zinediscovery/${this.props.zine}/crops/`
    this.setState({ imageThumb: imageThumb, imageLarge:imageLarge, baseCropUrl:baseCropUrl})    
      
  }

  displayImage(crop){
    if (crop) crop.pagesWithMatchingImagesNone = []
    if (crop && crop.pagesWithMatchingImages && crop.pagesWithMatchingImages.length === 0){
      crop.pagesWithMatchingImagesNone = [{url:'None'}]
    }

    this.setState({ display: crop, imageThumb: this.state.imageThumb, imageLarge: this.state.imageLarge, baseCropUrl: this.state.baseCropUrl })
    
  }

 
  render() {
    // not loaded yeeet
    if (!this.state) return <div className="Crops"></div>

      

      var displayBlock = <span></span>
      if (this.state.display) {
        


        displayBlock = <span className="Crops-view-box" style={{display: "block"}}>
          <span onClick={() => this.displayImage(null)}  className="Crops-view-box-image" style={{backgroundImage: `url(${this.state.baseCropUrl}${this.state.display.image})`}}><span>Click To Close</span></span>
          <span className="Crops-view-box-data">
            <div className="Crops-view-box-data-header">Labels</div>
            {this.state.display.labels.map((label,index)=>{
              return(<div key={index}>{label.description} <span className="Crops-view-box-data-percent">({label.score.toString().substring(0,3)})</span></div>)
            })}
            <br/>
            <div className="Crops-view-box-data-header">Web Labels Entities</div>
            {this.state.display.webLabelsEntities.map((webLabelsEntity,index)=>{
              return(<div key={index}>{webLabelsEntity.description} <span className="Crops-view-box-data-percent">({webLabelsEntity.score.toString().substring(0,3)})</span></div>)
            })}
            <br/>
            <div className="Crops-view-box-data-header">Web Pages</div>
            {this.state.display.pagesWithMatchingImages.map((page,index)=>{
              return(<div key={index}><a target="_blank" href={page.url}>{page.url.substring(0,40)}...</a></div>)
            })}
            {this.state.display.pagesWithMatchingImagesNone.map((page,index)=>{
              return(<div key={index}>{page.url}</div>)
            })}
            <br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/>
            <br/>
            <br/>
            




          </span>
          </span>;
      }

      



      return (      
          <span className="Crops" id="Crops" >
            {
              this.props.data.map((crop, index)=>{

                return(

                  <span key={index}>
                  <img className="Crops-thumb" onClick={() => this.displayImage(crop)} src={`${this.state.baseCropUrl}${crop.image}`}/>

                  </span>


                )



              })


            }


            {displayBlock}




             
          </span>      
      );
    }
}

export default Crops;
