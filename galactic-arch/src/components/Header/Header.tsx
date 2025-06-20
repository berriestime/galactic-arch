import logo from '../../assets/logo.png';
import { NavigationMenu } from '../NavigationMenu/NavigationMenu';
import styles from './Header.module.css';
import uploadIcon from '../../assets/upload.png';
import generatorIcon from '../../assets/generator.png';
import historyIcon from '../../assets/history.png'

const menuItems = [
  { to: '/', iconSrc: uploadIcon, label: 'CSV Аналитик' },
  { to: 'generator', iconSrc: generatorIcon, label: 'CSV Генератор' },
  { to: 'history', iconSrc: historyIcon, label: 'История' },
];

const Header = (): React.ReactElement => (
  <header className={styles.header}>
    <div className={styles.headerContainer}>
      <img src={logo} className="logo" alt="Логотип Летние школы" />
      <h1 className={styles.title}>Межгалактическая аналитика</h1>
    </div>
    <NavigationMenu items={menuItems} />
  </header>
);

export { Header };