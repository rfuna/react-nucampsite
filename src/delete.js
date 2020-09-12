class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      partyType: "birthday",
      entertainment: "clowns",
      venue: {
        name: "Polly's Party Palace",
        capacity: 120
      }
    };
  }

  render() {
    return (
      <div>
        
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));