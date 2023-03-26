import { Accordion, AccordionTab } from 'primereact/accordion';

import { BuyingPowerGraph } from './ResultChart';


export default function ResultSummary({ result, initialSalary = 1000 }) {
    return (
        <>
            <BuyingPowerGraph data={result.periods} initialSalary={initialSalary} />

            <Accordion activeIndex={0}>
                <AccordionTab header="Raw Data">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </AccordionTab>
            </Accordion>



        </>
    );
}
