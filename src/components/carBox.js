import BMWViewer from './BMWModel';
import styles from '../styles/carBox.module.css';

export default function Carbox() {
  return (
    <div className={styles.mainbody}>
      <div className={styles.about}></div>
      <div className={styles.model}>
        <div className={styles.textModel}>
          <h1>Fastest M5 Ever</h1>
          <h2>(0-60 in 2.9s)</h2>
          <h1>Most Powerful Production M5</h1>
          <h2>(627 hp)</h2>
        </div>

        <BMWViewer />
      </div>
    </div>
  );
}
