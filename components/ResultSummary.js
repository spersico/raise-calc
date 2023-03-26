import { Accordion, AccordionTab } from 'primereact/accordion';

import { BuyingPowerGraph } from './ResultChart';


export default function ResultSummary({ country }) {
    return (
        <>
            <BuyingPowerGraph data={country.periods} />

            <Accordion activeIndex={0}>
                <AccordionTab header="Raw Data">
                    <pre>{JSON.stringify(country, null, 2)}</pre>
                </AccordionTab>
            </Accordion>



        </>
    );
}
