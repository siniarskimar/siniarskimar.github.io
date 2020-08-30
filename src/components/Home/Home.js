import React from 'react';
import './Home.scss';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render = () => {
        return (
            <div className="Home">
                <h1>Hello from Home</h1>
            </div>
        );
    }
}

export default Home;