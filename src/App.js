import React, {Component} from 'react';

import Header from './components/top/Header';
import Chat from './components/main/Chat';
import Narrator from './components/main/Narrator';
import NarratorWait from './components/main/NarratorWait';
import Round from './components/main/Round';
import End from './components/main/End';
import About from './components/main/About';

import MessageBar from './components/input/MessageBar';
import SingleButton from './components/input/SingleButton';
import DoubleButton from './components/input/DoubleButton';
import SocialMediaButton from './components/input/SocialMediaButton';

import {stateMap} from './stateMap';
import {getBotDelay, getSeconds} from './helpers/Utils';
import {getStateAtStep, advanceStep, bots} from './helpers/StateHelpers';
import { textProcessor, runSample, chooseTruth, chooseDare } from './helpers/textProcessing'
import { maxWindowHeight, handleResize } from './helpers/DOM'

import './styles/App.css';
import './styles/Top.css';
import './styles/Main.css';
import './styles/Input.css';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.botQueue = [];
    this.isProcessingQueue = false;
    this.shouldUpdate = false;

    this.state = { 
      name: '',
      choice: '',
      timerTime: 0,
      timerStart: 0,
      isBotTyping: false,
      currentBot: bots[0],
      ...getStateAtStep(1, stateMap)
  	};
  }

  appendMessage = (text, isUser = false, next = () => {}) => {
    let messages = this.state.messages.slice();
    messages.push({isUser, text});
    this.setState({messages, isBotTyping: this.botQueue.length > 0}, next);
  }

  processBotQueue = (isQuick = false) => {
    if (!this.isProcessingQueue && this.botQueue.length) {
      console.log(this.botQueue)
      this.isProcessingQueue = true;
      const nextMsg = this.botQueue.shift();
      setTimeout(() => {
        this.isProcessingQueue = false;
        this.appendMessage(nextMsg, false, this.processBotQueue);
      }, getBotDelay(nextMsg, isQuick));
    }
  }

  processResponse = (text) => {
    //check if message pure punctuation, let it pass if so
    if (text.match(/[a-zA-Z]/g)){
      //breaks sentences into different messages
      text = text
        .match(/[^.!?]+[.!?]*/g)
        .map(str => str.trim());
    }
    else if (!text) {
      text = 'huh??';
    }

    this.botQueue = this.botQueue.concat(text);
    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
  }

   handleSubmitText = async (text) => {

    if (this.state.step !== 3) {
      // append user text
      this.appendMessage(text, true);

      //hacky line for now, need to add to state helpers
      let context = this.state.currentBot.name === "truth_bot_answering" ? "truthChallenge" : "other"
      const response = await textProcessor(text, this.state.currentBot, context);
      this.processResponse(response);

    }
    // handle name submission in Intro
    else {
      this.shouldUpdate = true;
      this.setState({name: text})
    }
  }

  startTimer = () => {
    this.setState({
      timerTime: Date.now(),
      timerStart: Date.now()
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    }, 10);
  };

  handleClick = (e) => {
    this.setState({ timerStart: Date.now()});
    this.shouldUpdate = true;
    
    let target = e.target.firstElementChild !== null ? 
                  e.target.firstElementChild.textContent 
                  : e.target.textContent;
    if (target === 'Chat' || target === 'Truth' || target ==='Dare' || target ==='Bot') this.setState({choice: target})
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.configureState(nextProps, nextState);
  }

  componentDidMount() {
    let dialogHeight = handleResize(window);
    this.setState({dialogHeight});
    window.addEventListener('resize', handleResize);
    this.startTimer();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', handleResize);
    clearInterval(this.timer);
  }

  configureBots = () => {
    // which bot are we on
    const bot = bots.filter(function (key, val){
      return key.steps.includes(this.state.step)}.bind(this))

    // update bot, if it changes on this step
    if (bot.length > 0 && this.state.currentBot !== bot[0]){
      this.setState({currentBot: bot[0]})

      //if it's a truth bot, get a truth challenge
      if (bot[0].name === "truth_bot_asking"){
        chooseTruth(bot[0]).then( 
          botResponse => { 
            console.log(botResponse);
            this.appendMessage(botResponse); 
          })
        }

      //if it's a dare bot, get a dare
      if (bot[0].name === "dare_bot"){
        chooseDare(bot[0]).then( 
          botResponse => { 
            console.log(botResponse);
            this.appendMessage(botResponse[0]); 
            this.botQueue = this.botQueue.concat(botResponse[1]); 
            const isQuick = !this.state.isBotTyping;
            this.setState({isBotTyping: true}, () => this.processBotQueue(isQuick));
          })
        }
      }
  }

  checkTimeout = (Component) => {
    if (this.state.main === Component && 
        !this.shouldUpdate &&
        this.state.timeLimit === getSeconds(this.state.timerTime))
    {
      this.setState({ timerStart: Date.now()});
      this.shouldUpdate = true;
    }
  }

  configureState = (props, state) => {
    // check if a component has timed out 
    this.checkTimeout('Chat');

    // advancing and updating state happens here 
    if (this.shouldUpdate) { 
      this.shouldUpdate = false;
      // get next state
      let nextStep =  advanceStep(this.state.step, stateMap);
      // update bots
      this.configureBots();
      // update state
      this.setState({...getStateAtStep(nextStep, stateMap)})
    }
  }

  render() {
    let seconds = getSeconds(this.state.timerTime);
    let timer = seconds < 10  ? `0${seconds}` : seconds;
    
    const HeaderColor= this.state.main === 'Chat'  ? '#FF2D55' : '#00f';
    const placeHolderText = this.state.step === 1 ? 'Enter your name' : 'Say something...'
    
    let title = ''
    if (this.state.main === 'About') {
      title = 'About'
    }
    else if (this.state.main === 'Chat') {
      title = `00:${timer}`
    }
    else {
      title = this.state.name ? `Playing as: ${this.state.name}` : this.state.headerText
    } 

    return (
      <div className='App'>
        <div className="container">
          
          {/*-----------------------------TOP-----------------------------*/}     
          
          <Header 
          title={title} 
          color={HeaderColor} /> 

          {/*-----------------------------MAIN-----------------------------*/}   
          
          {this.state.main === 'Narrator'  && 
            <Narrator 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }            
          {this.state.main === 'Round'  && 
            <Round 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }            
          {this.state.main === 'NarratorWait'  && 
            <NarratorWait 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }   
          {this.state.main === 'Chat' &&
            <Chat 
            time={getSeconds(this.state.timerTime)}
            messages={this.state.messages}
            isBotTyping={this.state.isBotTyping}
            dialogHeight={this.state.dialogHeight} />
          }            
          {this.state.main === 'End' &&
            <End 
            dialogHeight={this.state.dialogHeight} 
            headline={this.state.fieldTop} 
            text={this.state.fieldBottom}/>
          }            
          {this.state.main === 'About' &&
            <About 
            dialogHeight={this.state.dialogHeight} />
          }              

          {/*-----------------------------INPUT-----------------------------*/}     
          
          {this.state.input === 'MessageBar' && 
            <MessageBar onSubmit={this.handleSubmitText} placeholder={placeHolderText}/>
          }          
          {this.state.input === 'SingleButton' &&
            <SingleButton click={this.handleClick} 
            buttonText={this.state.singleButtonText} />
          }          
          {this.state.input === 'DoubleButton' &&
            <DoubleButton click={this.handleClick} 
            button1={this.state.button1Text} 
            button2={this.state.button2Text} />
          }
          {this.state.input === 'SocialMediaButton' &&
            <SocialMediaButton click={this.handleClick} 
            buttonText={this.state.singleButtonText} />
          }  
        </div>
      </div>
    );
  }
}

export default App