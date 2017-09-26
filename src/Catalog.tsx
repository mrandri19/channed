import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';

import { Request } from './types';

type CatalogPage = {
    page: number,
    threads: ThreadPreview[]
};

type ThreadPreview = {
    no: number
};

export default class Catalog
    extends React.Component<RouteComponentProps<{}>, { request: Request<CatalogPage[], string> }> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = { request: { status: 'loading' } };
        this._fetchData = this._fetchData.bind(this);
    }
    componentDidMount() {
        this._fetchData();
    }
    render() {
        const request = () => {
            switch (this.state.request.status) {
                case 'loading': return (<h2>Loading</h2>);
                case 'success': return (
                    <ul>
                        {this.state.request.data[0].threads.map(thread => (
                            <li key={thread.no}><Link to={'/thread/' + thread.no}>{thread.no}</Link></li>
                        ))}
                    </ul>
                );
                case 'error': return (
                    <h2>Failed to fetch</h2>
                );
            }
        };
        return (
            <div>
                <h1>Catalog</h1>
                <ul>
                    {request()}
                </ul>
            </div>
        );
    }
    async _fetchData() {
        this.setState({ request: { status: 'loading' } });
        try {
            let res = await fetch(`http://127.0.0.1:4000/catalog.json`);
            // let res = await fetch(`http://localhost:1337/a.4cdn.org/fit/catalog.json`);
            let json: CatalogPage[] = await res.json();
            this.setState({ request: { status: 'success', data: json } });
        } catch (err) {
            this.setState({ request: { status: 'error', error: err.toString() } });
        }
    }
}