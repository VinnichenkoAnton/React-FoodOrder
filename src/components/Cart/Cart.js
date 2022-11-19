import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartContext from '../../store/cart-context';
import CartItem from './CartItem';
import Checkout from './Checkout';

import styles from './Cart.module.css';

const Cart = props => {
    const [isCheckout, setIsCheckout] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const [httpError, setHttpError] = useState();
    const cartCtx = useContext(CartContext);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = id => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = item => {
        cartCtx.addItem({ ...item, amount: 1 })
    };

    const cartItems = (
        <ul className={styles['cart-items']}>
            {cartCtx.items.map((item) =>
            (<CartItem
                key={item.id}
                name={item.name}
                amount={item.amount}
                price={item.price}
                onRemove={cartItemRemoveHandler.bind(null, item.id)}
                onAdd={cartItemAddHandler.bind(null, item)} />)
            )}
        </ul>
    );

    const orderHandler = () => {
        setIsCheckout(true);
    };

    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('https://backend-project-bb820-default-rtdb.firebaseio.com/orders.json', {
                method: 'POST',
                body: JSON.stringify({
                    user: userData,
                    orderedItems: cartCtx.items
                })
            });
            if (!response.ok) {
                throw new Error('Smth went wrong');
            }
            setIsSubmitting(false);
            setDidSubmit(true);
            cartCtx.clearCart();
        } catch (error) {
            setHttpError(error.message);
        }
    };

    const modalActions =
        <div className={styles.actions}>
            <button onClick={props.onClose} className={styles['button--alt']}>Close</button>
            {hasItems && <button className={styles.button} onClick={orderHandler}>Order</button>}
        </div>;

    const cartError = httpError &&
        <section>
            <p>{httpError}</p>
        </section>;

    const cartModalContent =
        <>
            {cartItems}
            <div className={styles.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
            {!isCheckout && modalActions}
        </>;

    const isSubmittingModalContent = <p>Sending order data...</p>;

    const didSubmitModalContent =
        <>
            <p>Successfully send the order!</p>
            <div className={styles.actions}>
                <button onClick={props.onClose} className={styles.button}>Close</button>
            </div>
        </>;

    return (
        <Modal onClose={props.onClose}>
            {cartError}
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}

        </Modal>
    );
};

export default Cart