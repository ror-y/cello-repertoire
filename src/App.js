import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Icon } from 'antd';

class App extends React.Component {
  constructor(props) {
    super()
    this.state = {
      data: [],
      filterDropdownVisible: false,
      pieceText: '',
      composerText: '',
      filtered: false,
    };
    this.onPieceChange = this.onPieceChange.bind(this);
    this.onComposerChange = this.onComposerChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }
  componentDidMount() {
    const url =
      "https://raw.githubusercontent.com/alanbuchanan/cello-pieces/master/cello.json";

    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          data: data,
          originalData: data
        });
      });
  }
  onPieceChange(e) {
    this.setState({ pieceText: e.target.value });
  }
  onComposerChange(e) {
    this.setState({ composerText: e.target.value });
  }
  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'difficulties',
      },
    });
  }
  onSearch() {
    const { pieceText, composerText, data, originalData } = this.state;
    const regPiece = new RegExp(pieceText, 'gi');
    const regComposer = new RegExp(composerText, 'gi');
    console.log('data:', data)
    this.setState({
      filterDropdownVisible: false,
      filtered: !!pieceText,
      data: originalData.map((record) => {
        const match = record.piece.match(regPiece) && record.composer.match(regComposer);
        if (!match) {
          return null;
        }
        return {
          ...record,
          name: (
            <span>
              {/* {record.piece.split(reg).map((text, i) => (
                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))} */}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  }
  
  render() {
    const columns = [
      {
        title: "Composer",
        dataIndex: "composer",
        key: "composer"
      },
      {
        title: "Piece",
        dataIndex: "piece",
        key: "piece",
      },
      {
        title: "Publisher",
        dataIndex: "publisher",
        key: "publisher"
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category"
      },
      {
        title: "Difficulty",
        dataIndex: "difficulties",
        key: "difficulty"
      }
    ];

    return <div>
      <Input 
        ref={ele => this.pieceInput = ele}
        placeholder="Search piece"
        value={this.state.pieceText}
        onChange={this.onPieceChange}
        // onPressEnter={this.onSearch}
      />
      <Input 
        ref={ele => this.composerInput = ele}
        placeholder="Search composer"
        value={this.state.composerText}
        onChange={this.onComposerChange}
        // onPressEnter={this.onSearch}
      />
      <Button onClick={this.onSearch}>Search</Button>
      <Table pagination={false} dataSource={this.state.data} columns={columns} />
    </div>
    ;
  }
}

class AppContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    const url =
      "https://raw.githubusercontent.com/alanbuchanan/cello-pieces/master/cello.json";

    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        this.setState({ data: data });
      });
  }

  render() {
    return (
      <div>
        {this.state.data.length === 0 ? null : <App data={this.state.data} />}
      </div>
    );
  }
}

export default App;