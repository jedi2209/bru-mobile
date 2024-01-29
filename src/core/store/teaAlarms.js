import {createEffect, createStore} from 'effector';
import {
  createTeaAlarm,
  deleteTeaAlarm,
  getUserTeaAlarms,
  updateTeaAlarm,
} from '../../utils/db/teaAlarms';

export const getTeaAlarmsFx = createEffect(async () => {
  return await getUserTeaAlarms();
});

export const addTeaAlarmFx = createEffect(async teaAlarm => {
  return await createTeaAlarm(teaAlarm);
});

export const updateTeaAlarmFx = createEffect(async newTeaAlarm => {
  const teaAlarm = await updateTeaAlarm(newTeaAlarm);
  return teaAlarm;
});

export const deleteTeaAlarmFx = createEffect(async id => {
  await deleteTeaAlarm(id);
  return id;
});

export const $teaAlarmsStrore = createStore(null)
  .on(getTeaAlarmsFx.doneData, (_, alarms) => alarms)
  .on(addTeaAlarmFx.doneData, (state, teaAlarm) => [...state, teaAlarm])
  .on(updateTeaAlarmFx.doneData, (state, newTeaAlarm) =>
    state.map(teaAlarm => {
      if (teaAlarm.id === newTeaAlarm.id) {
        return {...teaAlarm, ...newTeaAlarm};
      }
      return teaAlarm;
    }),
  )
  .on(deleteTeaAlarmFx.doneData, (state, id) =>
    state.filter(teaAlarm => teaAlarm.id !== id),
  );
