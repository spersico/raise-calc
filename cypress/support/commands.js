Cypress.Commands.add('getDropdownList', () => {
  cy.get('.p-autocomplete-panel').find('li').click();
});

Cypress.Commands.add('getDatePicker', () => {
  cy.get('.p-datepicker.p-component .p-monthpicker').find('.p-monthpicker-month').first().click();
});