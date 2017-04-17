import React, { Component } from 'react';
import './OpenSeaDragon.css';

// helper function to load image using promises
var loadImage = (src) => new Promise(function(resolve, reject) {
  var img = document.createElement('img')
  img.addEventListener('load', function(){  resolve(img) })
  img.addEventListener('error', function(err){ reject(404) })
  img.src = src;
});
             
class OpenSeaDragon extends React.Component {

    constructor(props) {
        super(props)
    }
    
    render() {
        let self = this;
        let divId = this.props.divId
        return (
            <div className="ocd-div" ref={node => {this.el = node;}}>
                <div className="openseadragon" id={divId}></div>
                <div className="ocd-toolbar">
                    <div><a id={`${divId}-rotate`}>🔁</a></div>
                    <div><a id={`${divId}-zoom-in`}>➕</a></div>
                    <div><a id={`${divId}-reset`}>👀</a></div>
                    <div><a id={`${divId}-zoom-out`}>➖</a></div>
                    <div><a id={`${divId}-full-page`}>💪</a></div>
                </div>
            </div>
        )
    }

    initSeaDragon(){
        let self = this


        // let { divId, image, type } = 
        let divId = this.props.divId
        let image = this.props.image
        let type = 'legacy-image-pyramid'

        // build the overlays
        var overlays = []

        if (this.props.displayFaceOverlay){
            this.props.faces.forEach((f)=>{
                overlays.push({
                    id: `face-overlay-${f.x}-${f.y}`,
                    px: f.x, 
                    py: f.y, 
                    width: f.width, 
                    height: f.height,
                    className: 'face-overlay'
                })
            })
        }

        loadImage(image).then(data =>{
            self.viewer =  window.OpenSeadragon({
                id: divId,
                visibilityRatio: 1.0,
                constrainDuringPan: false,
                defaultZoomLevel: 1,
                minZoomLevel: -1,
                maxZoomLevel: 10,
                zoomInButton: `${divId}-zoom-in`,
                zoomOutButton: `${divId}-zoom-out`,
                homeButton: `${divId}-reset`,
                fullPageButton: `${divId}-full-page`,
                nextButton: 'next',
                previousButton: 'previous',
                showNavigator: false,
                navigatorId: 'navigator',
                showRotationControl: true,
                rotateRightButton: `${divId}-rotate`,
                tileSources: {
                    type:type,
                    levels:[ { url: image, height:data.naturalHeight, width: data.naturalWidth } ]
                },
                overlays: overlays
            })

        });
    }

    componentDidMount(){
        this.initSeaDragon()
    }
     shouldComponentUpdate(nextProps, nextState){
        return false
    }
}

// OpenSeaDragon.defaultProps = { id: 'ocd-viewer',  type:'legacy-image-pyramid' }

export default OpenSeaDragon;

