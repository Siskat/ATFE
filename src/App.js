import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        const data = require('./activity_feed.json');
        this.state = {
            data: data,
            hover: false,
            path: ''
        }
    }

    getUserById(id) {
        const profile = this.state.data.profiles.find((p) => p.id === id);
        if (profile) {
            return profile;
        }
    }

    getTaskById(id) {
        const task = this.state.data.tasks.find((p) => p.id === id);
        if (task) {
            return task;
        }
    }

    showUserPath(user) {
        this.setState({
            hover:true,
            path: '/users/' + user.slug
        });
    }

    showTaskPath(task) {
        this.setState({
            hover: true,
            path: '/tasks/' + task.slug
        });
    }

    mouseLeave() {
        this.setState({
            hover: false
        });
    }

    getActivity(event) {
        const task = this.getTaskById(event.task_id);
        const user = this.getUserById(event.profile_ids[0]); 
        let eventType = '';

        // sort activities by type
        switch (event.event) {
            case 'posted':
                eventType= ' POSTED A TASK ';
                break;
            case 'completed':
                eventType = ' COMPLETED ';
                break;
            case 'bid':
                eventType = ' BID ON ';
                break;
            case 'comment':
                eventType = ' COMMENTED ON ';
                break;
            case 'assigned':
                const assignee = this.getUserById(event.profile_ids[1]);
                return (<li key={event.template}>
                    <span className="item">
                        <span onMouseEnter={() => this.showUserPath(user)} onMouseLeave={() => this.mouseLeave()}>{user.abbreviated_name}</span>
                        <span className="description"> ASSIGNED </span>
                        <span onMouseEnter={() => this.showTaskPath(task)} onMouseLeave={() => this.mouseLeave()}>{task.name}</span>
                        <span className="description"> TO </span>
                        <span onMouseEnter={() => this.showUserPath(user)} onMouseLeave={() => this.mouseLeave()}>{assignee.abbreviated_name}</span>
                    </span>
                </li>);
            case 'joined':
                return (<li key={event.template}>
                    <span className="item">
                        <span onMouseEnter={() => this.showUserPath(user)} onMouseLeave={() => this.mouseLeave()}>{user.abbreviated_name}</span>
                        <span className="description"> SIGNED UP </span>
                    </span>
                </li>);
        }

        return (<li key={event.template}>
            <span className="item">
                <span onMouseEnter={() => this.showUserPath(user)} onMouseLeave={() => this.mouseLeave()}>{user.abbreviated_name}</span>
                <span className="description">{eventType}</span>
                <span onMouseEnter={() => this.showTaskPath(task)} onMouseLeave={() => this.mouseLeave()}>{task.name}</span>
            </span>
        </li>);
    }

    render() {
        let info;
        if (!this.state.hover) {
            info = 'Mouse over a user or task to get their path.';
        } else {
            info = this.state.path
        }
        
        const taskList = this.state.data.activity_feed.map((event) => this.getActivity(event));
        return (
            <div className="background">
                <ul>{taskList}</ul>
                {info}
            </div>
        );
    }
}

export default App;
