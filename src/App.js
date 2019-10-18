import React from 'react';
import './App.css';
import KeystrokeTracker from './KeystrokeTracker'
import Auth from './Auth';

class App extends React.Component {

  constructor() {
    super();
    this.Tracker = new KeystrokeTracker();
    this.state = { table: null, text: "", user: {}, checkText:"" };
    this.userref = React.createRef();
  }

  onKeyDown(ev) {
    this.Tracker.KeyDown(ev.key);
  }

  onClickSummarize() {
    const table = this.Tracker.Sumarize();
    this.setState({ table: table });
  }

  generateKeypairTable() {
    let rows = [];
    this.state.table.forEach(item => {
      rows.push(
        (
          <tr key={item.keypair}>
            <td>{item.keypair}</td>
            <td>{item.avg}</td>
          </tr>
        )
      )
    });
    return (
      <table>
        <thead>
          <tr>
            <td>Keypair</td>
            <td>Average Time</td>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  clear() {
    this.Tracker = new KeystrokeTracker();
    this.setState({ table: null, text: "", checkText: "" });
  }

  onChange(ev) {
    this.setState({ text: ev.target.value });
  }

  onAddPerson() {
    let name = this.userref.current.value;
    let u = { ...this.state.user };
    u[name] = this.state.table.reduce((a, v) =>  {
      a[v.keypair] = v;
      return a;
    }, {});
    this.setState({ user: u });
    this.clear();
  }

  onCheck(){
    const table = this.Tracker.Sumarize();
    const result = Auth.Auth1NN(this.state.user, table);
    const text = result.map(v => `user: ${v.user} with probability ${Math.round(v.prob * 100)} %`)
      .reduce((acc, v) => `${acc}\n${v}`, "");
    this.setState({checkText:text});
  }

  render() {
    let textOrTable = (
      <textarea
        rows="50"
        cols="200"
        value={this.state.text}
        onChange={this.onChange.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
      ></textarea>
    );

    let addButton = (
      <div>
        <input ref={this.userref} id="username"></input>
        <button onClick={this.onAddPerson.bind(this)}>Add</button>
      </div>
    );

    let clearButton = undefined;
    let checkButton = undefined;

    if (this.state.table) {
      textOrTable = this.generateKeypairTable();
      clearButton = addButton;
    } else {
      checkButton = (
        <button onClick={this.onCheck.bind(this)}>Check</button>
      );
    }

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          </div>
          <div>
            {textOrTable}
          </div>
          <div>{this.state.checkText}</div>
          <div>
            {clearButton}
            <button onClick={this.onClickSummarize.bind(this)}>Add as a new person</button>
            {checkButton}
            <button onClick={this.clear.bind(this)}>Clear</button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
