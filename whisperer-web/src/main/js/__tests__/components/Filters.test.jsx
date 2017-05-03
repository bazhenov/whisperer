import React from "react";
import Filters from "../../components/Filters.jsx";
import renderer from "react-test-renderer";
import { buildFilters, buildFilterValues, emptyFilterValues } from '../../utils';
import { Set, Map } from 'immutable'
import {mount} from "enzyme";
import toJson from 'enzyme-to-json';

describe('Filters', () => {
	const props = {
		filters: buildFilters(
			Set(['search-coord2.akod.loc', 'search-coord3.akod.loc']),
			Set(['c.f.s.SearchEngine', 'c.f.s.EngineContext']),
			Set(['qtp-1', 'qtp-2', 'qtp-3', 'qtp-4'])
		),
		filtersValues: buildFilterValues(
			Map({
				'search-coord2.akod.loc': 5,
				'search-coord3.akod.loc': 3,
				'search-coord4.akod.loc': 1,
				'search-coord5.akod.loc': 0
			}),
			Map({
				'c.f.s.SearchEngine': 5,
				'c.f.s.EngineContext': 3,
				'a.n.o.ther': 0
			}),
			Map({
				'qtp-1': 5,
				'qtp-2': 3,
				'qtp-3': 0
			}),
		),
		updateFilters: () => {}
	};
	it('rendering', () => {
		expect(renderer.create(
			<Filters { ...props } />
		).toJSON()).toMatchSnapshot();

		expect(renderer.create(
			<Filters { ...props } filtersValues={emptyFilterValues()} />
		).toJSON()).toMatchSnapshot();
	});

	describe('interactions', () => {
		it('adding filter', done => {
			const updateFilters = filters => {
				expect(filters).toEqual(
					buildFilters(
						props.filters.hostNames.add('search-coord4.akod.loc'),
						props.filters.packageNames,
						props.filters.threadNames,
					)
				);
				done();
			};
			mount(
				<Filters { ...props } updateFilters={updateFilters} />
			).find('input')
				.filterWhere(chk => chk.props().value === 'search-coord4.akod.loc')
				.simulate('change',{ target: { checked: true, name: 'hostNames', value: 'search-coord4.akod.loc' } });
		});
		it('removing filter', done => {
			const updateFilters = filters => {
				expect(filters).toEqual(
					buildFilters(
						props.filters.hostNames.remove('search-coord3.akod.loc'),
						props.filters.packageNames,
						props.filters.threadNames,
					)
				);
				done();
			};
			mount(
				<Filters { ...props } updateFilters={updateFilters} />
			).find('input')
				.filterWhere(chk => chk.props().value === 'search-coord3.akod.loc')
				.simulate('change',{ target: { checked: false, name: 'hostNames', value: 'search-coord3.akod.loc' } });
		});
		it('filters filtering', () => {
			const wrapper = mount(
				<Filters { ...props } />
			);
			wrapper.find('input')
				.filterWhere(chk => chk.props().name === 'packageNameFilter')
				.simulate('change', { target: { name: 'packageNameFilter', value: 'c.f.s' } });
			expect(toJson(wrapper)).toMatchSnapshot();
		});
	});
});