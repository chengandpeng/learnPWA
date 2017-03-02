import React from 'react';
import ReactDOM from 'react-dom';

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
  	if (fb) {
  		fb.on('value', snapshot => {
  			const messages = snapshot.val();
  			this.setState({ messages });
  		});
  	}
  }

  componentDidUpdate(prevState) {
  	if (prevState.messages !== this.state.messages) {
			this.scrollToBottom();
  	}
  }

  renderMessages = () => {
 		const { messages } = this.state;
 		if (messages) {
 			return Object.keys(messages).map(key => {
 				const data = messages[key];
 				return (
 					<p className='chat-message' key={data.time+data.value}>
 						<span className='message-id'>{data.id}</span>
 						<span className='message-value'>{data.value}</span>
 						<span className='message-time'>{data.time}</span>
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
  	const date = new Date();
  	const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  	let updates = {};
  	updates[newKey] = { time, value, id };
  	fb.update(updates);
		this.setState({ value: '' });
		this.inputValue.focus();
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
