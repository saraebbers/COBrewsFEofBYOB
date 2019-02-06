import React, { Component } from 'react';
import './App.css';
import postBeer from './assets/post-beer.png'
import deleteBeer from './assets/delete-beer.png'
import patchBeer from './assets/patch-beer.png'
import putBeer from './assets/put-beer.png'
import putBrew from './assets/put-brew.png'
import patchBrew from './assets/patch-brew.png'
import postBrew from './assets/post-brew.png'
import deleteBrew from './assets/delete-brew.png'


class App extends Component {
  constructor () {
    super();
    this.state = {
      returnedURL: '',
      error: '',
      fetchResult: [],
      responseStatus: '',
      help: false,
      imgPath: ''
    }
  }

  // { "name":"Avery Brewing Company","city":"Boulder","food":"yes","dog_friendly":"yes","outdoor_seating":"yes","website":"www.averybrewing.com" }



  handleSubmit = (e) => {
    e.preventDefault()
    let returnedURL = ''
    const url = this.refs.urlSelect.value
    const id = this.refs.idSelect.value ? `/${this.refs.idSelect.value}` : ''
    const query = this.refs.querySelect.value ?  `?${this.refs.querySelect.value}=${this.queryClean(this.refs.citySelect.value)}` : ''
    const subTable = this.refs.subTableSelect.value ? `/beers` : ''
    returnedURL = 'http://colorado-brews.herokuapp.com' + url + id + query + subTable
    this.setState({error: '', fetchResult: [], returnedURL, responseStatus: ''})
  }

  queryClean = (givenStr) => {
    let str = givenStr.toLowerCase()
    let strArray = str.split('')
    let capFirst =  strArray[0].toUpperCase()
    strArray.shift()
    strArray.unshift(capFirst)
    const word = strArray.join('')
    return word
  }

  fetchEndpoint = async() => {
    console.log(JSON.stringify(this.state.requestBody))
    try {
      const response = await fetch(this.state.returnedURL)
      const result = await response.json()
      console.log(result)
      if (result.length > 1) {
        this.setState({responseStatus: response.status, fetchResult: result})
      } else {
        this.setState({responseStatus: response.status, fetchResult: [...this.state.fetchResult, result]})
      }
    } catch (error) {
      this.setState({error: error.message})
    }
  }

  displayHelp = () => {
    this.setState({help: !this.state.help})
  }

  pickImg = (num) => {
    let path;
    switch(num) {
      case 1:
        path = putBrew
        break
      case 2:
        path = putBeer
        break
      case 3:
        path = patchBrew
        break
      case 4:
        path = patchBeer
        break
      case 5:
        path = postBrew
        break
      case 6:
        path = postBeer
        break
      case 7:
        path = deleteBrew
        break
      case 8:
        path = deleteBeer
        break
      default:
        path = '#'
    }
    this.setState({imgPath: path})
  }

  render() {
    let { help } = this.state;
    return (
      <div className="App">
        <header>
          <h1>CO Brews API</h1>
          <a href="https://github.com/lorynmason/BYOB/blob/master/README.md"><h3 className="bottom-header">API Documentation</h3></a>
          <p onClick={this.displayHelp} className="help-btn">Help</p>
        </header>
        <div>
          <p className="app-description">
            CO Breweries is an API that provides data about breweries in Denver and the beers 
            that they carry. Users can add data to the API through POST requests, 
            delete data with DELETE requests, and edit data with PUT and PATCH requests.
          </p>
        </div>
        <main>
          <section className="url-builder">
            <h3 className="url-builder-label">URL Builder</h3>
            {help ? 'This section is for selecting one of the two different api paths' : null}
            <form onSubmit={this.handleSubmit}>
              <p>All live query endpoints are GET endpoints</p>
              <select className='url-select' ref='urlSelect'>
                <option value='/api/breweries'>/api/breweries</option>
                <option value='/api/beers'>/api/beers</option>
              </select>
              <div>
                <label>ID: </label>
                <input className='id' placeholder='Optional' name='id' type='number' ref='idSelect'/>
              </div>
              <div className="query-sel-div">
                <label>Query Selector: </label>
                <select className='query-select' ref='querySelect'>
                  <option value='' disabled selected>Optional</option>
                  <option value='city'>city</option>
                </select>
                <label>City: </label>
                <input className='city-name' placeholder='Optional' name='cityName' type='text' ref='citySelect'/>
              </div>
              <div>
                <p>{help ? 'This section will only fetch data successfully if the GET beers endpoint is selected with a valid associated brewery id:' : null}</p>
                <label>Beers by brewery id selector: </label>
                <select className='table-select' ref='subTableSelect'>
                  <option value=''>none</option>
                  <option value='beers'>beers</option>
                </select>
              </div>
              <button className="submit-btn">Submit</button>
            </form>
          </section>
          <section>
            <div className='returned-url-container'>
              <div className="returned-url-div">
                <p className="returned-url">Generated URL: {this.state.returnedURL}</p>
              </div>
            </div>
            <button className="send-btn" onClick={this.fetchEndpoint}>SEND</button>
            <button className='reset-btn'>RESET</button>
          </section>
          <section className="response-container">
            <div className="response-div">
              <h2 className="response-label">Response:</h2>
              <p className="response-status">Status Code: {this.state.responseStatus}</p>
                {this.state.fetchResult.length ? this.state.fetchResult.map(result => {
                  return <p key={result.name} className="response-p">{JSON.stringify(result)}</p>
                }) : null}
              <div>
                {this.state.error ? this.state.error.message : null}
              </div>
            </div>
          </section>
          <div className="alternate-request-div">
            <p>The following are examples of various PUT/PATCH/POST/DELETE endpoints. Click on each button for an example of what would be returned</p>
            <button className="demo-btn" onClick={() => this.pickImg(1)}>PUT: http://colorado-brews.herokuapp.com/api/breweries</button>
            <button className="demo-btn" onClick={() => this.pickImg(2)}>PUT: http://colorado-brews.herokuapp.com/api/beers</button>
            <button className="demo-btn" onClick={() => this.pickImg(3)}>PATCH: http://colorado-brews.herokuapp.com/api/breweries</button>
            <button className="demo-btn" onClick={() => this.pickImg(4)}>PATCH: http://colorado-brews.herokuapp.com/api/beers</button>
            <button className="demo-btn" onClick={() => this.pickImg(5)}>POST: http://colorado-brews.herokuapp.com/api/breweries</button>
            <button className="demo-btn" onClick={() => this.pickImg(6)}>POST: http://colorado-brews.herokuapp.com/api/beers</button>
            <button className="demo-btn" onClick={() => this.pickImg(7)}>DELETE: http://colorado-brews.herokuapp.com/api/breweries</button>
            <button className="demo-btn" onClick={() => this.pickImg(8)}>DELETE: http://colorado-brews.herokuapp.com/api/beers</button>
            {this.state.imgPath ? <img className="screenshot" src={this.state.imgPath} alt="Screenshot of endpoint"/> : null }
          </div>
        </main>
      </div>
    );
  }
}

export default App;
