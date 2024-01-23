import {createEvent, createStore} from 'effector';

const setTeaAlarm = createEvent();

export const $teaAlarmStrore = createStore({
  alarms: [
    {
      id: 1,
      time: '7:30 AM',
      by: 'Vitalii',
      teaType: 'Black Tea',
      brewingData: {
        time: {minutes: '2', seconds: '0'},
        temperature: '90',
        waterAmount: '100',
      },
      preset: {
        title: '',
        img: '',
        id: 0,
      },
    },
    {
      id: 2,
      time: '7:50 AM',
      by: 'John',
      teaType: 'Puer Tea',
      brewingData: {
        time: {minutes: '2', seconds: '30'},
        temperature: '90',
        waterAmount: '250',
      },
    },
  ],
}).on(setTeaAlarm, (state, teaAlarms) => ({
  ...state,
  alarms: teaAlarms,
}));
