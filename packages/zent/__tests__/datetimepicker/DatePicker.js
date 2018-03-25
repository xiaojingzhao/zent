import React from 'react';
import { Simulate } from 'react-dom/test-utils';
import { formatDate } from 'zan-utils/date';
import every from 'lodash/every';

import DatePicker from 'datetimepicker/DatePicker';
import { setTime, isSameDate } from 'datetimepicker/utils';

const simulateRawWithTimers = (node, event, ...arg) => {
  Simulate[event](node, ...arg);
  jest.runAllTimers();
};

const HOURS = 10;
const MINUTES = 10;
const SECONDS = 10;

const TIME = '10:10:10';

describe('DateTimePicker', () => {
  it('DatePicker not show footer', () => {
    const wrapper = mount(<DatePicker />);
    wrapper.find('.picker-input').simulate('click');

    const pop = document.querySelector('.zent-popover-content');
    simulateRawWithTimers(pop.querySelectorAll('.panel__cell')[0], 'click');

    wrapper.update();
    expect(wrapper.state('openPanel')).toBe(false);
  });

  it('DatePicker has its default structure', () => {
    /**
     * .zent-datetime-picker
     *   .picker-wrapper
     *     .picker-input
     *       {palceholder||value}
     *       span.zenticon-calendar-o
     */
    const wrapper = mount(<DatePicker showTime isFooterVisble />);
    expect(wrapper.find('DatePicker').length).toBe(1);
    expect(wrapper.find('.picker-input').length).toBe(1);
    expect(wrapper.find('.zenticon').length).toBe(2);
    wrapper.find('.picker-input').simulate('click');
  });

  it('DatePicker has its default behavior(DatePanel, MonthPanel and YearPanel 3 level transition)', () => {
    const wrapper = mount(<DatePicker isFooterVisble />);
    wrapper.find('.picker-input').simulate('click');

    const pop = document.querySelector('.zent-popover-content');
    expect(pop.querySelectorAll('.date-panel').length).toBe(1);
    expect(pop.querySelectorAll('.month-panel').length).toBe(0);
    expect(pop.querySelectorAll('.year-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .panel__title')[0],
      'click'
    );
    expect(pop.querySelectorAll('.date-panel').length).toBe(1);
    expect(pop.querySelectorAll('.month-panel').length).toBe(1);
    expect(pop.querySelectorAll('.year-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.month-panel .panel__title')[0],
      'click'
    );
    expect(pop.querySelectorAll('.date-panel').length).toBe(1);
    expect(pop.querySelectorAll('.month-panel').length).toBe(1);
    expect(pop.querySelectorAll('.year-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.year-panel .panel__cell--current')[0],
      'click'
    );
    expect(pop.querySelectorAll('.date-panel').length).toBe(1);
    expect(pop.querySelectorAll('.month-panel').length).toBe(1);
    expect(pop.querySelectorAll('.year-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.month-panel .panel__cell--current')[0],
      'click'
    );
    expect(pop.querySelectorAll('.date-panel').length).toBe(1);
    expect(pop.querySelectorAll('.month-panel').length).toBe(0);
    expect(pop.querySelectorAll('.year-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .panel__cell--current')[0],
      'click'
    );
    simulateRawWithTimers(
      pop.querySelectorAll('.panel__footer .btn--confirm')[0],
      'click'
    );
  });

  it('DatePicker with showTime switch (some kind of 5-level panel)', () => {
    const wrapper = mount(<DatePicker showTime isFooterVisble />);
    wrapper.find('.picker-input').simulate('click');

    const pop = document.querySelector('.zent-popover-content');
    // simulateRawWithTimers(pop.querySelectorAll('.link--current')[0], 'click');
    // simulateRawWithTimers(pop.querySelectorAll('.btn--confirm')[0], 'click');

    // wrapper.find('.picker-input').simulate('click');
    wrapper.update();
    expect(pop.querySelectorAll('.time-panel').length).toBe(1);
    expect(pop.querySelectorAll('.time-panel .time__number').length).toBe(3);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[0],
      'click'
    );
    expect(pop.querySelectorAll('.hour-panel').length).toBe(1);
    expect(pop.querySelectorAll('.hour-panel .zenticon').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.hour-panel .zenticon')[0],
      'click'
    );
    expect(pop.querySelectorAll('.hour-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[1],
      'click'
    );
    expect(pop.querySelectorAll('.minute-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.minute-panel .zenticon')[0],
      'click'
    );
    expect(pop.querySelectorAll('.minute-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[2],
      'click'
    );
    expect(pop.querySelectorAll('.second-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.second-panel .zenticon')[0],
      'click'
    );
    expect(pop.querySelectorAll('.second-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[0],
      'click'
    );
    expect(pop.querySelectorAll('.hour-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.hour-panel .panel__cell--current')[0],
      'click'
    );
    expect(pop.querySelectorAll('.hour-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[1],
      'click'
    );
    expect(pop.querySelectorAll('.minute-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.minute-panel .panel__cell--current')[0],
      'click'
    );
    expect(pop.querySelectorAll('.minute-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[2],
      'click'
    );
    expect(pop.querySelectorAll('.second-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.second-panel .panel__cell--current')[0],
      'click'
    );
    expect(pop.querySelectorAll('.second-panel').length).toBe(0);
  });

  it('There are prev and next pager in Date/Month/YearPanel', () => {
    const getMonthNumber = string => +string.match(/\d{4}.{1}(\d{1,2})/)[1];
    const getYearNumber = string => +string.match(/(\d{4})/)[1];
    const getYearRangeTail = string => +string.match(/(\d{4}).*(\d{4})/)[2];
    const wrapper = mount(<DatePicker showTime isFooterVisble />);

    wrapper.find('.picker-input').simulate('click');
    const pop = document.querySelector('.zent-popover-content');

    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .zenticon-right')[0],
      'click'
    );

    let prev = getMonthNumber(
      pop.querySelector('.date-panel .panel__title').innerHTML
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .zenticon-right')[1],
      'click'
    );

    let header = getMonthNumber(
      pop.querySelector('.date-panel .panel__title').innerHTML
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .zenticon-right')[1],
      'click'
    );

    let next = getMonthNumber(
      pop.querySelector('.date-panel .panel__title').innerHTML
    );

    if (header === 12) {
      expect(prev).toBe(11);
      expect(next).toBe(1);
    } else if (header === 1) {
      expect(prev).toBe(12);
      expect(next).toBe(2);
    } else {
      expect(header - prev).toBe(1);
      expect(header - next).toBe(-1);
    }

    // MonthPanel
    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .panel__title')[0],
      'click'
    );
    expect(pop.querySelectorAll('.month-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.month-panel .zenticon-right')[0],
      'click'
    );
    prev = getYearNumber(
      pop.querySelector('.month-panel .panel__title').innerHTML
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.month-panel .zenticon-right')[1],
      'click'
    );
    header = getYearNumber(
      pop.querySelector('.month-panel .panel__title').innerHTML
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.month-panel .zenticon-right')[1],
      'click'
    );
    next = getYearNumber(
      pop.querySelector('.month-panel .panel__title').innerHTML
    );

    expect(header - prev).toBe(1);
    expect(next - header).toBe(1);

    // YearPanel
    simulateRawWithTimers(
      pop.querySelectorAll('.month-panel .panel__title')[0],
      'click'
    );
    expect(pop.querySelectorAll('.year-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.year-panel .zenticon-right')[0],
      'click'
    );
    prev = getYearRangeTail(
      pop.querySelector('.year-panel .panel__title').innerHTML
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.year-panel .zenticon-right')[1],
      'click'
    );
    header = getYearRangeTail(
      pop.querySelector('.year-panel .panel__title').innerHTML
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.year-panel .zenticon-right')[1],
      'click'
    );
    next = getYearRangeTail(
      pop.querySelector('.year-panel .panel__title').innerHTML
    );

    expect(next - header).toBe(12);
    expect(header - prev).toBe(12);

    // HACK: branch with unused noop onClick
    simulateRawWithTimers(
      pop.querySelectorAll('.year-panel .panel__title')[0],
      'click'
    );
  });

  it('DatePicker is a controlled component', () => {
    let wrapper;
    const onChangeMock = jest.fn().mockImplementation(value => {
      wrapper.setProps({ value });
    });
    const hoverMock = jest.fn();
    wrapper = mount(
      <DatePicker
        value="2017-01-01"
        onChange={onChangeMock}
        onHover={hoverMock}
        isFooterVisble
      />
    );
    wrapper.find('.picker-input').simulate('click');
    const pop = document.querySelector('.zent-popover-content');

    // Today Button(only put the current selected and active)
    simulateRawWithTimers(
      pop.querySelector('.panel__footer .link--current'),
      'click'
    );
    simulateRawWithTimers(
      pop.querySelector('.panel__footer .btn--confirm'),
      'click'
    );

    expect(onChangeMock.mock.calls.length).toBe(1);
    expect(wrapper.prop('value')).toBe(formatDate(new Date(), 'YYYY-MM-DD'));

    // click other date
    wrapper.find('.picker-input').simulate('click');

    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .zenticon-right')[0],
      'click'
    );
    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .panel__cell')[1],
      'click'
    );
    simulateRawWithTimers(
      pop.querySelectorAll('.panel__footer .btn--confirm')[0],
      'click'
    );

    expect(onChangeMock.mock.calls.length).toBe(2);
    expect(pop.prop('value')).not.toBe(formatDate(new Date(), 'YYYY-MM-DD'));

    // hover event
    // BUG: onHover is not revealed
    wrapper.find('.picker-input').simulate('click');

    simulateRawWithTimers(
      pop.querySelectorAll('.date-panel .panel__cell')[2],
      'mouseover'
    );
    expect(hoverMock.mock.calls.length).toBe(0);
  });

  // HACK: branch description is not clear
  it('DatePicker will set actived to Date.now() when value prop is unable to parse', () => {
    let wrapper = mount(<DatePicker value={'2001年9月11日'} isFooterVisble />);
    expect(
      wrapper.find('DatePicker').instance().state.actived instanceof Date
    ).toBe(true);

    wrapper = mount(<DatePicker isFooterVisble />);
    wrapper.setProps({ prefix: 'zent-custom' });
    expect(wrapper.find('.zent-custom-datetime-picker').length).toBe(1);
    wrapper.setProps({ value: false });
    expect(wrapper.find('DatePicker').instance().state.value).toBe(undefined);
    wrapper.setProps({ value: '2011-01-01' });
    wrapper.setProps({ format: null });

    wrapper.find('.picker-input').simulate('click');
    const click = new Event('click');
    document.dispatchEvent(click);
    wrapper.update();
    expect(wrapper.find('ClosablePortal').prop('visible')).toBe(false);
    expect(wrapper.state('openPanel')).toBe(false);
  });

  it('DatePicker support value whose type is number or DateObj', () => {
    let pop;
    let wrapper;
    const changeValue = w => {
      w.find('.picker-input').simulate('click');

      pop = document.querySelector('.zent-popover-content');
      pop.find('PanelFooter .link--current').simulate('click');
      pop.find('PanelFooter .btn--confirm').simulate('click');
    };

    const onChangeMock = jest.fn().mockImplementation(value => {
      wrapper.setProps({ value });
    });
    wrapper = mount(
      <DatePicker
        onChange={onChangeMock}
        value={new Date(2017, 1, 1).getTime()}
        isFooterVisble
      />
    );
    changeValue(wrapper);
    expect(typeof onChangeMock.mock.calls[0][0]).toBe('number');
    wrapper = mount(
      <DatePicker onChange={onChangeMock} value={new Date()} isFooterVisble />
    );
    changeValue(wrapper);
    expect(onChangeMock.mock.calls[1][0] instanceof Date).toBe(true);
  });

  it('DatePicker has disable prop', () => {
    // total disable switch
    const getMonthNumber = string => +string.match(/\d{4}.{1}(\d{1,2})/)[1];
    const getYearNumber = string => +string.match(/(\d{4})/)[1];
    let wrapper = mount(<DatePicker disabled isFooterVisble />);
    expect(wrapper.find('DatePanel').length).toBe(0);
    wrapper.find('.picker-input').simulate('click');
    expect(wrapper.find('DatePanel').length).toBe(0);

    // disabledTime function
    const disFunc = val => {
      return val.getFullYear() > 2000;
    };
    wrapper = mount(<DatePicker disabledDate={disFunc} isFooterVisble />);
    wrapper.find('.picker-input').simulate('click');
    let pop = document.querySelector('.zent-popover-content');
    let disabled = every(pop.querySelectorAll('.panel__cell'), item =>
      item.classList.contains('panel__cell--disabled')
    );
    expect(disabled).toBe(true);

    // max
    const now = new Date();
    wrapper = mount(<DatePicker max="2010.01.01" isFooterVisble />);
    wrapper.find('.picker-input').simulate('click');
    pop = document.querySelector('.zent-popover-content');
    expect(
      getMonthNumber(pop.querySelector('.date-panel .panel__title').innerHTML)
    ).toBe(now.getMonth() + 1);
    expect(
      getYearNumber(pop.querySelector('.date-panel .panel__title').innerHTML)
    ).toBe(now.getFullYear());

    disabled = every(pop.querySelectorAll('.panel__cell'), item =>
      item.classList.contains('panel__cell--disabled')
    );

    // min
    wrapper = mount(<DatePicker min="3000.01.01" isFooterVisble />);
    wrapper.find('.picker-input').simulate('click');
    pop = document.querySelector('.zent-popover-content');
    expect(
      getMonthNumber(pop.querySelector('.date-panel .panel__title').innerHTML)
    ).toBe(now.getMonth() + 1);
    expect(
      getYearNumber(pop.querySelector('.date-panel .panel__title').innerHTML)
    ).toBe(now.getFullYear());

    disabled = every(pop.querySelector('.panel__cell'), item =>
      item.classList.contains('panel__cell--disabled')
    );
    expect(disabled).toBe(true);

    // when disabled, the current link is hidden
    expect(pop.find('.link--current').length).toBe(0);
    pop.find('.btn--confirm').simulate('click');
    expect(pop.find('DatePanel').length).toBe(1);
  });

  it('supports disabledTime callback', () => {
    const getDisabledTime = () => {
      return {
        disabledHour: () => false,
        disabledMinute: () => false,
        disabledSecond: () => false,
      };
    };
    const wrapper = mount(
      <DatePicker showTime disabledTime={getDisabledTime} isFooterVisble />
    );
    wrapper.find('.picker-input').simulate('click');
    const pop = document.querySelector('.zent-popover-content');
    expect(pop.querySelectorAll('.time-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[0],
      'click'
    );
    expect(pop.querySelector('.hour-panel').length).toBe(1);

    simulateRawWithTimers(
      pop.querySelector('.hour-panel .link--prev'),
      'click'
    );
    expect(pop.querySelectorAll('.hour-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[1],
      'click'
    );
    expect(pop.querySelectorAll('.minute-panel').length).toBe(1);
    simulateRawWithTimers(
      pop.querySelector('.minute-panel .link--prev'),
      'click'
    );
    expect(pop.querySelectorAll('.minute-panel').length).toBe(0);

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[2],
      'click'
    );
    expect(pop.querySelectorAll('.second-panel').length).toBe(1);
    simulateRawWithTimers(
      pop.querySelector('.second-panel .link--prev'),
      'click'
    );
    expect(pop.querySelectorAll('.second-panel').length).toBe(0);
  });

  it('support disabled time with min', () => {
    const now = setTime(new Date(), TIME);

    const wrapper = mount(<DatePicker showTime min={now} isFooterVisble />);
    wrapper.find('.picker-input').simulate('click');
    const pop = document.querySelector('.zent-popover-content');

    simulateRawWithTimers(
      pop.querySelector('.date-panel .panel__cell--current'),
      'click'
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[0],
      'click'
    );
    expect(
      pop
        .querySelectorAll('.hour-panel .panel__cell')
        [HOURS - 1].classList.contains('panel__cell--disabled')
    ).toBe(true);

    simulateRawWithTimers(
      pop.querySelectorAll('.hour-panel .panel__cell')[HOURS],
      'click'
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[1],
      'click'
    );
    expect(
      pop
        .querySelectorAll('.minute-panel .panel__cell')
        [MINUTES - 1].classList.contains('panel__cell--disabled')
    ).toBe(true);

    simulateRawWithTimers(
      pop.querySelectorAll('.minute-panel .panel__cell')[MINUTES],
      'click'
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[2],
      'click'
    );
    expect(
      pop
        .querySelectorAll('.second-panel .panel__cell')
        [SECONDS - 1].classList.contains('panel__cell--disabled')
    ).toBe(true);
  });

  it('support disabled time with max', () => {
    const now = setTime(new Date(), TIME);

    const wrapper = mount(<DatePicker showTime max={now} isFooterVisble />);
    wrapper.find('.picker-input').simulate('click');
    const pop = document.querySelector('.zent-popover-content');

    simulateRawWithTimers(
      pop.querySelector('.date-panel .panel__cell--current'),
      'click'
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[0],
      'click'
    );
    expect(
      pop
        .querySelectorAll('.hour-panel .panel__cell')
        [HOURS + 1].classList.contains('panel__cell--disabled')
    ).toBe(true);

    simulateRawWithTimers(
      pop.querySelectorAll('.hour-panel .panel__cell')[HOURS],
      'click'
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[1],
      'click'
    );
    expect(
      pop
        .querySelectorAll('.minute-panel .panel__cell')
        [MINUTES + 1].classList.contains('panel__cell--disabled')
    ).toBe(true);

    simulateRawWithTimers(
      pop.querySelectorAll('.minute-panel .panel__cell')[MINUTES],
      'click'
    );

    simulateRawWithTimers(
      pop.querySelectorAll('.time-panel .time__number')[2],
      'click'
    );
    expect(
      pop
        .querySelectorAll('.second-panel .panel__cell')
        [SECONDS + 1].classList.contains('panel__cell--disabled')
    ).toBe(true);
  });

  it('support set actived date with defaultValue', () => {
    const today = new Date();
    const wrapper = mount(<DatePicker defaultValue={today} />);
    expect(isSameDate(wrapper.state('actived'), today)).toBe(true);
  });

  it('support set return value with valueType', () => {
    const valueType = 'number';
    const wrapper = mount(<DatePicker valueType={valueType} />);
    expect(wrapper.instance().retType).toBe(valueType);
  });

  it('support disabled clear input with onBeforeClear api', () => {
    const today = new Date();
    const wrapper = mount(
      <DatePicker onBeforeClear={() => false} value={today} />
    );
    wrapper.find('.picker-input .zenticon-close-circle').simulate('click');
    expect(isSameDate(wrapper.prop('value'), today)).toBe(true);
  });

  it('Support get actived date with getDate method', () => {
    const today = new Date();
    const wrapper = mount(<DatePicker value={today} />);
    expect(isSameDate(wrapper.instance().getDate(), today)).toBe(true);
  });
});
