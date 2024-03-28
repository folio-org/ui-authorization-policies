import React from 'react';
import { fireEvent, cleanup } from '@folio/jest-config-stripes/testing-library/react';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../../test/helpers/translationsProperties';
import '@folio/jest-config-stripes/testing-library/jest-dom';

import SearchForm from './SearchForm';

const setSearchTerm = jest.fn();
const onSubmit = jest.fn();

describe('SearchForm component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders SearchField and Button components', () => {
    const { getByRole } = renderWithIntl(
      <SearchForm
        searchTerm=""
        setSearchTerm={setSearchTerm}
        onSubmit={onSubmit}
      />,
      translationsProperties
    );
    expect(getByRole('searchbox')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('enables the search button when the search field is not empty', () => {
    const searchTerm = 'Test search term';
    const { getByRole, getByTestId } = renderWithIntl(
      <SearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSubmit={onSubmit}
      />,
      translationsProperties
    );

    expect(getByRole('searchbox')).toHaveValue(searchTerm);
    expect(getByTestId('search-button')).toBeEnabled();
  });

  it('calls setSearchTerm when the search field content changes', () => {
    const { getByRole } = renderWithIntl(
      <SearchForm
        searchTerm=""
        setSearchTerm={setSearchTerm}
        onSubmit={onSubmit}
      />,
      translationsProperties
    );

    fireEvent.change(getByRole('searchbox'), {
      target: { value: 'New test search term' },
    });

    expect(setSearchTerm).toHaveBeenCalledWith('New test search term');
  });

  it('calls onSubmit handler', () => {
    const { getByRole, getByTestId } = renderWithIntl(
      <SearchForm
        searchTerm=""
        setSearchTerm={setSearchTerm}
        onSubmit={onSubmit}
      />,
      translationsProperties
    );

    fireEvent.change(getByRole('searchbox'), {
      target: { value: 'New test search term' },
    });

    fireEvent.click(getByTestId('search-button'));

    expect(onSubmit).toHaveBeenCalled();
  });
});
