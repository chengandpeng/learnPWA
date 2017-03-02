import React from 'react';
import ReactDOM from 'react-dom';
import { idbUtil } from './idbUtil';
import moment from 'moment';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: '',
      value: '',
      id: ''
    }
  }

  componentWillMount() {
  	const { fb } = this.props;
  	fb && fb.on('value', snapshot => {
			const messagesObj = snapshot.val();
      const messages = messagesObj ? Object.values(messagesObj) : '';
      // messages && messages.forEach(message => {
      //   idbUtil.set(message);
      // });
			this.setState({ messages });
		});

    // idbUtil.getAll().then(messages => {
    //   this.setState({ messages });
    // });
  }

  componentDidUpdate(prevState) {
  	if (prevState.messages !== this.state.messages) {
			this.scrollToBottom();
  	}
  }

  putMessage(message) {
    idbUtil.set(message).then(() => {
      console.log('set idb success');
    });
  }

  renderMessages = () => {
 		const { messages } = this.state;
 		if (messages) {
 			return messages.map(data => {
 				return (
 					<p className='chat-message' key={data.date}>
 						<span className='message-id'>{data.id}</span>
 						<span className='message-value'>{data.value}</span>
 						<span className='message-time'>{moment(data.date).format('HH:mm:ss')}</span>
 					</p>
 				);
 			});
 		} else {
 			return <p> Loading... </p>
 		}
  }

  handleClick = () => {
  	const { fb } = this.props;
  	const { value, id } = this.state;
  	if (!value) return ;
  	const newKey = fb.push().key;
  	const date = new Date().getTime();
  	let updates = {};
  	updates[newKey] = { value, id, date };
  	fb.update(updates);
		this.setState({ value: '' });
		this.inputValue.focus();
    // this.putMessage({ value, id, date });
  }

  scrollToBottom = () => {
    const messagesContainer = ReactDOM.findDOMNode(this.messagesContainer);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
	};

  handleChangeValue = (e) => {
  	this.setState({ value: e.target.value });
  }

  handleChangeId = (e) => {
  	this.setState({ id: e.target.value });
  }

  handleRemove = () => {
  	this.props.fb.remove();
  }

  handleKeyPress = (e) => {
  	if (e.key === 'Enter') this.handleClick();
  }

  render() {
  	const { id, value } = this.state;
    return (
      <div>
      	<p>
      		<span>ID:</span>
      		<input className='input-id' value={id} onChange={this.handleChangeId} />
      		<input value={value} onChange={this.handleChangeValue} onKeyPress={this.handleKeyPress} ref={ el => { this.inputValue = el; }}/>
      		<button disabled={ !(id && value) }  onClick={this.handleClick}>Send Message</button>
      		<button onClick={this.handleRemove}>Clear All</button>
      	</p>
      	<div className='chat-messages' ref={(el) => { this.messagesContainer = el; }}>
	      	{ this.renderMessages()}
      	</div>
      </div>
    );
  }
}
