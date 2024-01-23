import {createEvent, createStore} from 'effector';

export const addTeaAlarm = createEvent();
export const deleteTeaAlarm = createEvent();

export const $teaAlarmStrore = createStore({
  alarms: [
    {
      id: 1,
      time: {hours: '7', minutes: '50'},
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
      cleaning: false,
    },
    {
      id: 2,
      time: {hours: '7', minutes: '50'},
      by: 'John',
      teaType: 'Puer Tea',
      brewingData: {
        time: {minutes: '2', seconds: '30'},
        temperature: '90',
        waterAmount: '250',
      },
      preset: {
        title: '',
        img: '',
        id: 0,
      },
      cleaning: false,
    },
  ],
})
  .on(addTeaAlarm, (state, teaAlarm) => ({
    ...state,
    alarms: [...state.alarms, teaAlarm],
  }))
  .on(deleteTeaAlarm, (state, teaAlarm) => {
    console.log(teaAlarm);
    return {
      ...state,
      alarms: state.alarms.filter(item => item.id !== teaAlarm.id),
    };
  });
