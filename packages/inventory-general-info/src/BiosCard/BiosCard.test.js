/* eslint-disable camelcase */
import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import BiosCard from './BiosCard';
import configureStore from 'redux-mock-store';
import { biosTest } from '../__mock__/selectors';

describe('BiosCard', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = { systemProfileStore: {
            systemProfile: {
                loaded: true,
                ...biosTest,
                cpu_flags: [ 'one' ]
            }
        } };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {} });
        const wrapper = render(<BiosCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const store = mockStore(initialState);
        const wrapper = render(<BiosCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data - wrong date', () => {
        const store = mockStore({
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...biosTest,
                    bios_release_date: 'test',
                    cpu_flags: [ 'one' ]
                }
            }
        });
        const wrapper = render(<BiosCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
