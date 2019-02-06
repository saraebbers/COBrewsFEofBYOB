import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor () {
    super();
    this.state = {
      returnedURL: '',
      requestVerb: 'GET',
      error: '',
      requestBody: '',
      result: [],
      responseStatus: '',
      help: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let returnedURL = ''
    const requestBody = this.refs.textAreaSelect.value
    const requestVerb = this.refs.verbSelect.value
    const url = this.refs.urlSelect.value
    const id = this.refs.idSelect.value ? `/${this.refs.idSelect.value}` : ''
    const query = this.refs.querySelect.value ?  `?${this.refs.querySelect.value}=${this.refs.citySelect.value}` : ''
    const subTable = this.refs.subTableSelect.value ? `/beers` : ''
    returnedURL = 'http://localhost:3000' + url + id + query + subTable
    this.setState({error: '', result: [], requestVerb, returnedURL, requestBody, responseStatus: ''})
  }

  fetchEndpoint = async() => {
    try {
      let response;
      if (this.state.requestVerb === 'GET' || 'DELETE') {
        response = await fetch(this.state.returnedURL, {
          method: this.state.requestVerb
        })
      } else {
        response = await fetch(this.state.returnedURL, {
          method: this.state.requestVerb,
          body: this.state.requestBody
        })
      }
      console.log('response:', response)
      const result = await response.json()
      this.setState({responseStatus: response.status, result})
    } catch (error) {
      this.setState({error})
    }
  }

  displayHelp = () => {
    this.setState({help: !this.state.help})
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
            {help ? 'This section is for you to select the HTTP verb along with the available API path, the two available paths either will select data from the breweries database or the beers database.' : null}
            <form onSubmit={this.handleSubmit}>
              <label className="top-dropdown">Endpoint Selection: </label>
              <select className='verb-select' ref='verbSelect'>
                <option value='GET'>GET</option>
                <option value='POST'>POST</option>
                <option value='PATCH'>PATCH</option>
                <option value='PUT'>PUT</option>
                <option value='DELETE'>DELETE</option>
              </select>
              <select className='url-select' ref='urlSelect'>
                <option value='/api/breweries'>/api/breweries</option>
                <option value='/api/beers'>/api/beers</option>
              </select>
              <div className="json-container">
                <label className="json-label">Required for POST/PUT/PATCH: </label>
                <textarea rows="8" columns="100" placeholder="Enter JSON formated object here" ref="textAreaSelect"></textarea>
              </div>
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
              </div>
              <div>
                <label>City: </label>
                <input className='city-name' placeholder='Optional' name='cityName' type='text' ref='citySelect'/>
              </div>
              <div>
                <p>{help ? 'This section will only fetch data successfully if the GET beers endpoint is selected with a valid associated brewery id:' : null}</p>
                <label>Beers by brewery id selector: </label>
                <select className='table-select' ref='subTableSelect'>
                  <option value='' disabled selected>none</option>
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
                {this.state.result.length ? this.state.result.map(i => {
                  return <p key={i.name} className="response-p">{JSON.stringify(i)}</p>
                }) : null}
              <div>
                {this.state.error ? this.state.error.message : null}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
