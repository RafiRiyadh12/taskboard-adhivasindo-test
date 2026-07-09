import { IonApp, setupIonicReact } from '@ionic/react';
import { BoardProvider } from './context/BoardContext';
import Board from './components/Board';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <BoardProvider>
        <Board />
      </BoardProvider>
    </IonApp>
  );
}
