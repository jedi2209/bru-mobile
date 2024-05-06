import {createEffect, createStore} from 'effector';
import {
  addPresset,
  deletePresset,
  getUserPressets,
  updatePresset,
} from '../../utils/db/pressets';
import {defaultPresets} from '../const/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getPressetsFx = createEffect(async () => {
  const pressets = await getUserPressets();
  return pressets.sort((x, y) => y.created_at - x.created_at);
});

export const addPressetToStoreFx = createEffect(async presset => {
  const newPresset = await addPresset(presset);
  return newPresset;
});

export const updatePressetFx = createEffect(async presset => {
  const updatedDefaults = JSON.parse(
    await AsyncStorage.getItem('updatedDefaults'),
  );
  const newPresset = await updatePresset(presset, updatedDefaults);
  return newPresset;
});

export const deletePressetFx = createEffect(async id => {
  if (defaultPresets.includes(id)) {
    return id;
  }
  await deletePresset(id);
  return id;
});

export const $pressetsStore = createStore([])
  .on(getPressetsFx.doneData, (_, pressets) => pressets)
  .on(addPressetToStoreFx.doneData, (store, presset) =>
    [...store, presset].sort((x, y) => y.created_at - x.created_at),
  )
  .on(updatePressetFx.doneData, (store, newPresset, updatedDefaults) =>
    store
      .filter(presset => {
        if (updatedDefaults?.includes(presset.id)) {
          return false;
        }
        return true;
      })
      .map(presset => {
        if (presset.id === newPresset.id) {
          return {...presset, ...newPresset};
        }
        return presset;
      }),
  )
  .on(deletePressetFx.doneData, (store, id) =>
    store.filter(presset => presset.id !== id),
  );
