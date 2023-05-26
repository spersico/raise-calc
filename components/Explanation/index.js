import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import styles from './Explanation.module.css';

import { useState } from 'react';

export default function Explanation() {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button aria-label="What's this website for?" label="What's this website for?" icon="pi pi-question-circle" onClick={() => setVisible(true)} className={styles.button} />

            <Dialog header="What's This?" style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '741px': '100vw' }} visible={visible} onHide={() => setVisible(false)} dismissableMask>
                <p>
                    This is a tool that calculates how much your income is worth today, compared to when you first started earning it.
                </p>
                <p>
                    Initially thought to be used as a tool to figure out how much you should ask for, on your next salary review, to make sure you are not losing money...

                    It takes into account the inflation of the country of the currency you are paid in, the starting date of your current salary, and
                    your current salary. It then calculates how much your salary would be worth right now, compared to that starting date.
                </p>
            </Dialog>
        </>
    );
}
