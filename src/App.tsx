import './App.css';
import Orders from './components/orders';
import SocketProvider from './providers/SocketProvider';
import { useEffect, useMemo, useState } from 'react';

const URL = "wss://ws.etherealtest.net/v1/stream";

function App() {
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [ products, setProducts ] = useState<any[]>([]);

  const selectedProduct = useMemo(() => {
    return products.find(({id}) => id === selectedProductId);
  }, [selectedProductId, products]);

  useEffect(() => {
    fetch('https://api.etherealtest.net/v1/product').then((response) => {
      return response.json();
    }).then((res) => {
      const { data } = res;
      console.log('product', data);
      setProducts(data);
    }).catch((err) => {
      console.log('error', err);
    });
  }, [products.length]);

  return (
    <SocketProvider url={URL}>
      <div className="App">
        <header className="App-header">
          Order Book
          <select onChange={(e) => setSelectedProductId(e.target.value)}>
            <option key='' value=''>Please select an asset</option>
            {products.map(({id, baseTokenName}) => (
              <option key={id} value={id}>{baseTokenName}</option>
            ))}
          </select>
          <Orders 
            productId={selectedProduct?.id}
            tokenName={selectedProduct?.baseTokenName} 
          />
          {/* // multiple hooks execution */}
          <Orders 
            productId={products?.[0]?.id}
            tokenName={products?.[0]?.baseTokenName} 
          />
        </header>
      </div>
    </SocketProvider>
  );
}

export default App;
