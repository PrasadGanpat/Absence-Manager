import React, { Component } from 'react';
import { Absences } from './Absences';

export class Members extends Component{

    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          payload: []
        };
      }
    
      componentDidMount() {
        fetch("members.json")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                payload: result.payload
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error: error,
                payload: []
              });
            }
          )
  }
    
      render() {
        const { error, isLoaded } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          return (
            <div>
              <Absences memeberName={this.state.payload} loading={this.state.isLoaded} />
            </div>
            
          );
        }
      }
    }