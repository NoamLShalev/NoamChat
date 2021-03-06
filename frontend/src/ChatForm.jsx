import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedChatForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      file: undefined
    };
  }

  componentDidMount = () => {
    fetch("http://138.197.131.216:4000/admin", {
      credentials: "include"
    })
      .then(responseHeader => {
        return responseHeader.text();
      })
      .then(responseBody => {
        let parsed = JSON.parse(responseBody);
        if (parsed.success) {
          this.props.dispatch({ type: "admin" });
        }
      });
  };

  componentWillUnmount = () => {
    this.props.dispatch({ type: "admin-false" });
  };

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = new FormData();
    data.append("message", this.state.message);
    data.append("image", this.state.file);
    fetch("http://138.197.131.216:4000/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    this.setState({ message: "", file: undefined });
  };

  logout = () => {
    fetch("http://138.197.131.216:4000/logout", {
      credentials: "include"
    })
      .then(responseHeader => {
        return responseHeader.text();
      })
      .then(responseBody => {
        let parsed = JSON.parse(responseBody);
        if (parsed.success) {
          this.props.dispatch({ type: "login-failure" });
        }
      });
  };

  deleteMessages = () => {
    fetch("http://138.197.131.216:4000/delete", {
      credentials: "include"
    });
  };

  handleFiles = event => {
    let file = event.target.files[0];
    this.setState({ file: file });
  };

  kickOut = () => {
    let user = window.prompt("Who do you want to kick out?");
    let data = new FormData();
    data.append("user", user);
    fetch("http://138.197.131.216:4000/kick-out", {
      method: "POST",
      body: data,
      credentials: "include"
    })
      .then(responseHeader => {
        return responseHeader.text();
      })
      .then(responseBody => {
        let parsed = JSON.parse(responseBody);
        if (!parsed.success) {
          alert(parsed.message);
          return;
        }
      });
  };

  render = () => {
    if (this.props.admin) {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="user-inputs">
              <textarea
                type="text"
                placeholder="Message"
                value={this.state.message}
                onChange={this.handleMessageChange}
              />
              <div>
                <p className="add-image">Add Image:</p>
                <input type="file" onChange={this.handleFiles} />
              </div>
            </div>
            <button type="submit">Send</button>
          </form>
          <button onClick={this.logout}>Logout</button>
          <button onClick={this.deleteMessages}>Delete My Messages</button>
          <button onClick={this.kickOut}>Kick User Out</button>
        </div>
      );
    }
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="user-inputs">
            <textarea
              type="text"
              placeholder="Message"
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
            <div>
              <p className="add-image">Add Image:</p>
              <input type="file" onChange={this.handleFiles} />
            </div>
          </div>
          <button type="submit">Send</button>
        </form>
        <button onClick={this.logout}>Logout</button>
        <button onClick={this.deleteMessages}>Delete My Messages</button>
      </div>
    );
  };
}

let mapStateToProps = st => {
  return {
    admin: st.admin
  };
};

let ChatForm = connect(mapStateToProps)(UnconnectedChatForm);

export default ChatForm;
