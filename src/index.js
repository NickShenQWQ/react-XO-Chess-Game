import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 棋子组件
class Square extends React.Component {
  render() {
    return (
      <button className="square"
        // props取父级的点击事件和value值
        onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

// 棋盘组件，是一个数组，判断棋子显示状态
class Board extends React.Component {
  // 当constructor()需要用到props的时候需在constructor和super中定义，这里没用到无所谓
  // constructor(props) {
  //   super(props);
  // status切换到game组件中
  // constructor() {
  //   // 要使用this得调用super()
  //   super();
  //   // 状态存储器，存数据状态
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   };
  // }
  
  // 传给棋子Square
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  // 棋盘的样式和数据
  render() {
 
 
    // react的jsx写法让html中直接调用this.renderSquare函数，🐂🍺
    
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// 游戏总样式
class Game extends React.Component {
  // 添加历史纪录功能，把变量状态存到总的game
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  // 点击事件
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // 如何获胜或者棋子满了结束点击事件
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    //更新元素，且不会立即执行，最终执行。
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext:!this.state.xIsNext,
    });
  }
  render() {
    //Game 组件的 render 方法现在则要负责获取最近一步的历史记录（当前棋局状态）
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li  key={move}>
          <a href="###" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
           <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
// react传递game组件到dom上
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
// 计算胜利算法函数，就是枚举胜利条件
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}