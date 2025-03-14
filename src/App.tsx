import './App.css';
import { bid } from './types';
import Orders from './components/orders';
import SocketProvider from './providers/SocketProvider';

const bids: bid[] = [
  ['2997', '150'],
  ['2996', '160'],
  ['3000', '120'],
  ['2995', '170'],
  ['2994', '180'],
  ['2999', '130'],
  ['2998', '140'],
  ['2993', '130'],
];

const URL = "wss://ws.etherealtest.net/v1/stream";

function App() {
  return (
    <SocketProvider url={URL}>
      <div className="App">
        <header className="App-header">
          Order Book
          <Orders bids={bids} />
        </header>
      </div>
    </SocketProvider>
  );
}

export default App;
