import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '5e699f8161124cb7879c730735eb269d'
});

const particlesOptions = {
  "particles": {
    "number": {
      "value": 100
    },
    "size": {
      "value": 3
    }
  }
}



class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    this.setState({ imageUrl: event.target.value });
    this.setState({ box: {} })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onButtonSubmit = () => {
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({ isSignedIn: false })
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route: route })
  }

  renderedObjects = (route) => {
    switch (route) {
      case 'home':
        return (
          <div>
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
          </div>)
      case 'signin':
        return (
          <Signin onRouteChange={this.onRouteChange} />
        )
      case 'register':
        return (
          <Register onRouteChange={this.onRouteChange} />
        )
      default:
        return (
          <Signin onRouteChange={this.onRouteChange} />
        )
    }
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        <Logo />
        {this.renderedObjects(this.state.route)}
      </div>
    );
  }
}

export default App;
