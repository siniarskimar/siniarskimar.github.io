import React from 'react';
import './Nav.scss';
import {Link} from 'react-router-dom';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render = () => {
        return (
            <div className="Nav">
                <p className="Nav-logo">MS</p>
                <div className="Nav-links">
                    <Link to="/"><p>Home</p></Link>
                    <Link to="/about"><p>About</p></Link>
                </div>
            </div>
        );
    }
}

export default Nav;