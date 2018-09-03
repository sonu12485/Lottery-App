import React, { Component } from 'react';

import web3 from './web3';

import lottery from './lottery';

class App extends Component 
{
  constructor(props)
  {
    super(props);

    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: ''
    };
  }

  async componentDidMount()
  {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getAllPlayers().call();
    const balance = await web3.eth.getBalance( lottery.options.address );

    this.setState({ manager, players, balance });
  }

  onEnter = async (event) => {

    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Entering Lottery Please Wait ... ' })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei( this.state.value, "ether" )
    });

    this.setState({ message: 'Transaction complete !' });

  }

  pickWinner = async () => {

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Picking a Winner, Please Wait ... ' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A Winner is Picked!' });

  }

  render() 
  {
    return (
      <div>
        <h1>Lottery Contract</h1>
        <p>This Lottery is managed by - {this.state.manager}.</p>
        <p>
          There are {this.state.players.length} players participating to 
          win {web3.utils.fromWei( this.state.balance, "ether" )} ether!
        </p>

        <hr />

        <form onSubmit={this.onEnter} >
          <h3>Want to try your luck ?</h3>
          <br />
          <div>
            Enter amount of ether to enter the lottery (min amount of ether is 0.01)
            <br />
            <input 
              value={this.state.value}
              onChange={ (event) => { this.setState({ value: event.target.value }) } }
            />
            <br />
            <button>ENTER</button>
          </div>
        </form>

        <hr />

        <div>
          <h3>Want to Pick a Winner!</h3>
          <button onClick={this.pickWinner} >Pick Winner</button>
        </div>

        <hr />

        <h3>{this.state.message}</h3>
      </div>
    );
  }
}

export default App;
