// Libs
import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';

// CSS
import './index.css';
import './semantic.min.css';

// Components
import App from './App';
import Zine from './Zine';

// Render
render((
   <Router>
   	<div>
      <Route exact path="/" component={App} />
	  <Route path="/zine/:name" component={Zine} />
	</div>
   </Router >
), document.getElementById('root'));