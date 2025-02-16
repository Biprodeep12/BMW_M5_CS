import styles from '../styles/nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navx}></div>
      <div className={styles.navy}></div>
      <div className={styles.navz}></div>
      <h1 className={styles.navtext}>
        <div className={styles.lbl}></div>
        <div className={styles.bl}></div>
        <div className={styles.rl}></div>
        BMW M5 CS
        <div className={styles.lbr}></div>
        <div className={styles.br}></div>
        <div className={styles.rr}></div>
      </h1>
      <div className={styles.backRed}></div>
    </nav>
  );
}
