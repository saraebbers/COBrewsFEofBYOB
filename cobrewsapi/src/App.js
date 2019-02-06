import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor () {
    super();
    this.state = {
      returnedURL: 'url',
      requestVerb: 'verb',
      error: '',
      requestBody: '',
      result: [],
      responseStatus: ''
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

  render() {
    return (
      <div className="App">
        <header>
          <h1>CO Brews Database</h1>
        </header>
        <div>
          <h2>API Documentation</h2>
          <p>Put info about the api here</p>
        </div>
        <main>
          <section>URL Builder
            <form onSubmit={this.handleSubmit}>
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
              <div>
                <label>This city field is required if POST/PUT/PATCH is selected, Enter text in JSON format with required parameters.</label>
                <textarea rows="8" columns="100" placeholder="Enter JSON formated object here" ref="textAreaSelect"></textarea>
              </div>
              <div>
                <label>This id selector field is optional</label>
                <input className='id' placeholder='Enter none or a number between 1-30' name='id' type='number' ref='idSelect'/>
              </div>
              <div>
                <label>This query field is optional</label>
                <select className='query-select' ref='querySelect'>
                  <option value='' disabled selected>none</option>
                  <option value='city'>city</option>
                </select>
              </div>
              <div>
                <label>This city field is required if query field is selected</label>
                <input className='city-name' placeholder='Enter city in CO' name='cityName' type='text' ref='citySelect'/>
              </div>
              <div>
                <label>This field is optional, if used do not enter query or city</label>
                <select className='table-select' ref='subTableSelect'>
                  <option value='' disabled selected>none</option>
                  <option value='beers'>beers</option>
                </select>
              </div>
              <button>Submit</button>
            </form>
          </section>
          <section>Returned URL
            <div className='displayURL'>
              {this.state.returnedURL}
            </div>
            <button onClick={this.fetchEndpoint}>Get this endpoint</button>
            <button className='resetURL'>Reselect a URL to search</button>
          </section>
          <section>
            <p className="response-status">Response Status: {this.state.responseStatus}</p>
            <div className='responseObject'>
              Response:
              {this.state.result.length ? this.state.result.map(i => {
                return <p key={i.name}>{JSON.stringify(i)}</p>
              }) : null}
            </div>
            <div>
              {this.state.error ? this.state.error.message : null}
            </div>
          </section>
        </main>

      </div>
    );
  }
}

export default App;
