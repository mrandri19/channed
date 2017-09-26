import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './Thread.css';
import { Request } from './types';

const BOARD = 'fit';
type Tree = {
  clean_html: string | null
  small_image_url: string | null
  is_first_post: boolean
  post_responding_to: string
  no: string
  children: Tree[]
};

class Thread extends React.Component<RouteComponentProps<{ id: string }>, { request: Request<Tree, string> }> {
  constructor(props: RouteComponentProps<{ id: string }>) {
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
          <div style={{ marginLeft: '-1em' }}>
            <TreeDisplay data={this.state.request.data} />
          </div>
        );
        case 'error': return (
          <h2>Failed to fetch</h2>
        );
      }
    };
    return (
      <div style={{ margin: '1em' }}>
        <h1>4chan alt-viewer</h1>
        [<a href="javascript:void(0)" style={{ color: '#34345C' }} onClick={this._fetchData}>Update</a>]
        {request()}
      </div>
    );
  }

  // TODO: cache response by implementing state management. Redux, mobx?
  async _fetchData() {
    this.setState({ request: { status: 'loading' } });
    try {
      let res = await fetch(`http://localhost:5000/${this.props.match.params.id}`, { method: 'post' });
      let json: Tree = await res.json();
      this.setState({ request: { status: 'success', data: json } });
    } catch (err) {
      this.setState({ request: { status: 'error', error: err.toString() } });
    }
  }
}

interface TreeDisplayProps {
  data: Tree;
}

interface TreeDisplayState {
  open: boolean;
}
class TreeDisplay extends React.Component<TreeDisplayProps, TreeDisplayState> {
  constructor(props: TreeDisplayProps) {
    super(props);
    this.state = { open: true };
    this._toggleDisplay = this._toggleDisplay.bind(this);
  }

  render(): React.ReactElement<TreeDisplayProps> {
    function ToggleButton(props: { onClick: () => void, open: boolean }) {
      return (
        <a
          href="javascript:void(0)"
          style={{ cursor: 'hand', color: '#D00' }}
          onClick={props.onClick}
        >
          {props.open ? '[-]' : '[+]'}
        </a>
      );
    }
    const text = (
      <div>
        {this.props.data.small_image_url ?
          <img src={`//i.4cdn.com/${BOARD}/${this.props.data.small_image_url}.jpg`} alt="" /> :
          null
        }

        <TextFormatter text={this.props.data.clean_html} />
        {
          (this.props.data.children.length !== 0) ?
            this.props.data.children.map(child => <TreeDisplay key={child.no} data={child} />)
            : null
        }</div>
    );

    return (
      <div style={{ marginLeft: '1em' }}>
        <ToggleButton onClick={this._toggleDisplay} open={this.state.open} />
        <span style={{ fontSize: '13.3333px' }}>No.{this.props.data.no}</span>
        {this.state.open ? text : null}
      </div>
    );
  }

  _toggleDisplay() {
    this.setState({ open: !this.state.open });
  }
}

function TextFormatter(props: { text: string | null }): React.ReactElement<{ text: string }> {
  if (props.text === '' || props.text === null) {
    return <div style={{ background: 'rgb(214, 218, 240)', padding: '4px' }}>DIOCANE NO COMMENT</div>;
  }
  const lines = props.text.split('\n');
  const formattedLines = lines.map((line, i) => {
    if (line[0] === '>') {
      return <p key={i} style={{ color: '#789922' }}>{line}</p>;
    } else {
      return <p key={i}>{line}</p>;
    }
  });

  return (
    <div style={{ background: 'rgb(214, 218, 240)', padding: '4px' }}>
      {formattedLines}
    </div>
  );
}

export default Thread;
