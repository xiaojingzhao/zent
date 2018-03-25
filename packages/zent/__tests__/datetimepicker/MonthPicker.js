import React from 'react';

import { Simulate } from 'react-dom/test-utils';

import MonthPicker from 'datetimepicker/MonthPicker';
import formatDate from 'zan-utils/date/formatDate';

const simulateRawWithTimers = (node, event, ...arg) => {
  Simulate[event](node, ...arg);
  jest.runAllTimers();
};

describe('MonthPicker', () => {
  it('MonthPicker not show footer ', () => {
    let pop;
    const wrapper = mount(<MonthPicker />);
    wrapper.find('.picker-input').simulate('click');

    pop = document.querySelector('.zent-popover-content');

    expect(pop.querySelectorAll('.month-panel').length).toBe(1);

    simulateRawWithTimers(pop.querySelectorAll('.panel__cell')[1], 'click');

    expect(wrapper.state('openPanel')).toBe(false);
  });

  it('MonthPicker has 2 level panel', () => {
    let pop;
    const wrapper = mount(<MonthPicker isFooterVisble />);
    const inst = wrapper.instance();
    expect(inst.state.openPanel).toBe(false);
    expect(inst.state.showPlaceholder).toBe(true);
    wrapper.find('.picker-input').simulate('click');
    expect(inst.state.openPanel).toBe(true);

    pop = document.querySelector('.zent-popover-content');

    expect(pop.querySelectorAll('.month-panel').length).toBe(1);
    expect(pop.querySelectorAll('.grid-cell').length).toBe(12);

    const click = new Event('click');
    document.dispatchEvent(click);
    wrapper.update();
    expect(inst.state.openPanel).toBe(false);
    expect(wrapper.find('ClosablePortal').prop('visible')).toBe(false);
    wrapper.find('.picker-input').simulate('click');

    simulateRawWithTimers(pop.querySelectorAll('.panel__title')[0], 'click');
    expect(pop.querySelectorAll('.year-panel').length).toBe(1);
    expect(pop.querySelectorAll('.year-panel .grid-cell').length).toBe(12);

    simulateRawWithTimers(
      pop.querySelectorAll('.year-panel .panel__title')[1],
      'click'
    );
    expect(pop.querySelectorAll('.year-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.month-panel .panel__title')[1],
      'click'
    );
    simulateRawWithTimers(pop.querySelector('.btn--confirm'), 'click');
    expect(wrapper.find('ClosablePortal').prop('visible')).toBe(false);

    wrapper.find('.picker-input').simulate('click');
    simulateRawWithTimers(pop.querySelector('.link--current'), 'click');
    simulateRawWithTimers(pop.querySelector('.btn--confirm'), 'click');

    expect(wrapper.find('ClosablePortal').prop('visible')).toBe(false);
    expect(inst.state.selected.getMonth()).toBe(new Date().getMonth());
  });

  it('MonthPicker return empty string when click clear icon', () => {
    let wrapper;
    const onChangeMock = jest.fn();
    wrapper = mount(
      <MonthPicker value="2010-01" onChange={onChangeMock} isFooterVisble />
    );
    wrapper
      .find('.zenticon-close-circle')
      .at(0)
      .simulate('click');
    expect(onChangeMock.mock.calls[0][0].length).toBe(0);
  });

  it('MonthPicker support default value', () => {
    let wrapper;
    wrapper = mount(<MonthPicker defaultValue="2010-01" isFooterVisble />);
    expect(wrapper.instance().state.actived).toBeInstanceOf(Date);

    wrapper = mount(<MonthPicker vaule="xxxx-xx" isFooterVisble />);
    expect(wrapper.instance().state.showPlaceholder).toBe(true);
  });

  it('MonthPicker is a controlled component', () => {
    let wrapper;
    let pop;
    const onChangeMock = jest.fn().mockImplementation(value => {
      wrapper.setProps({ value });
    });
    wrapper = mount(
      <MonthPicker value="2010-01" onChange={onChangeMock} isFooterVisble />
    );

    const inst = wrapper.instance();
    expect(inst.state.showPlaceholder).toBe(false);
    wrapper.find('.picker-input').simulate('click');

    pop = document.querySelector('.zent-popover-content');

    expect(inst.state.actived.getFullYear()).toBe(2010);
    expect(inst.state.actived.getMonth()).toBe(0);

    simulateRawWithTimers(pop.querySelector('.link--current'), 'click');
    wrapper.update();
    expect(inst.state.actived.getMonth()).toBe(new Date().getMonth());

    simulateRawWithTimers(pop.querySelector('.btn--confirm'), 'click');
    expect(onChangeMock.mock.calls.length).toBe(1);
    expect(onChangeMock.mock.calls[0][0]).toBe(
      formatDate(new Date(), 'YYYY-MM')
    );
  });
});
