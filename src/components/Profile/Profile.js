
import React, { Component } from 'react';

export default class Profile extends Component {
  render() {
    return (
      <div className="profile">
        { this.props.children }
      </div>
    )
  }
}

