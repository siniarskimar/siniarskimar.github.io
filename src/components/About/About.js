import React from 'react';
import './About.scss';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render = () => {
        return (
            <div className="About">
                <h1>Hello from About</h1>
            </div>
        );
    }
}

export default About;