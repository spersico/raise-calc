describe('My First Test', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('check my title', () => {
		cy.get('[data-cy=main-title]').should('contain', 'Buying Power Evolution');
	});

	it.only('check my $$', () => {
		cy.get('[data-cy=form-country-picker]').should('be.visible').type
			('Argentina').type('{enter}').then(() => {
				cy.getDropdownList('.p-dropdown-item').should('be.visible');
			});

		cy.get('[data-cy=form-salary-input]').should('be.visible').type
			('3000').type('{enter}');

		cy.get('[data-cy=form-date-picker]').should('be.visible').click().then(() => {
			cy.getDatePicker()
		});

		cy.get('[data-cy=form-button]').should('be.visible').should('contain', 'Show me my buying power evolution').click()
	});
});
