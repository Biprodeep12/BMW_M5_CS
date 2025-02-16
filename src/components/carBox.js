import BMWViewer from './BMWModel';
import styles from '../styles/carBox.module.css';

export default function Carbox() {
  return (
    <div className={styles.mainbody}>
      <div className={styles.about}></div>
      <div className={styles.model}>
        <BMWViewer />
      </div>
    </div>
  );
}
