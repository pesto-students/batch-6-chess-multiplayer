import React from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      serverResponse: '',
    };

    this.handleServerResponse = this.handleServerResponse.bind(this);
  }
  componentDidMount() {
    this.setState({loading: true});
    
    fetch(process.env.REACT_APP_SERVER_URL).then(response => {      
      return response.json();
    }).then(this.handleServerResponse);
  }
  handleServerResponse(data){
    this.setState({ loading: false, serverResponse : data.text});
  }
  render() {
    const { loading, serverResponse } = this.state;
    const text = loading ? 'Loading data from server..' : serverResponse;
    return (
      <div>
        <h1> {text} </h1>
      </div>
    );
  }
}

export default App;