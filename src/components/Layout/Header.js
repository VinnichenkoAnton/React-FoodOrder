import HeaderCartButton from './HeaderCartButton';

import styles from './Header.module.css';

import mealsImage from '../../assets/meals.jpg';

const Header = props => {
    return(
        <>
           <header className={styles.header}>
               <h1>React Meals</h1>
               <HeaderCartButton onClick={props.onShowCart}>Cart</HeaderCartButton>
            </header> 
           <div className={styles['main-image']}>
               <img src={mealsImage} alt="Table of delicious food"/>
           </div>
        </>
    );
}

export default Header;