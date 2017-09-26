import * as React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch
} from 'react-router-dom';

import Thread from './Thread';
import Catalog from './Catalog';

export default function App(props: {}) {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/catalog">Catalog</Link></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/thread/:id" component={Thread} />
                    <Route path="/catalog" component={Catalog} />
                    <Redirect from="/" to="/catalog" />
                </Switch>
            </div>
        </Router>
    );
}
