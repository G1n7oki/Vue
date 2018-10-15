import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/uitl'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'
import {SET_PLAYLIST} from "./mutation-types";
import {SET_SEQUENCE_LIST} from "./mutation-types";

const findIndex = (list, song) => {
  return list.findIndex(item => {
    return item.id === song.id;
  })
};

export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = ({commit}, {list}) => {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = ({commit, state}, song) => {
  let playlist = state.playlist.slice(),
    sequenceList = state.sequenceList.slice(),
    currentIndex = state.currentIndex;

  let currentSong = playlist[currentIndex];
  let fpIndex = findIndex(playlist, song);
  currentIndex++;
  playlist.splice(currentIndex, 0, song);

  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentIndex, 0, song);

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

export const deleteSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const deleteSong = ({commit, state}, song) => {
  let playlist = state.playlist.slice(),
    sequenceList = state.sequenceList.slice(),
    currentIndex = state.currentIndex;

  let pIndex = findIndex(playlist, song);
  playlist.splice(pIndex, 1);

  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);

  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);

  const playingState = playlist.length > 0;
  commit(types.SET_PLAYING_STATE, playingState);
};

export const deleteSongList = ({commit}) => {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const savePlayHistory = ({commit}, song) => {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};

export const saveFavoriteList = ({commit}, song) => {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song));
};

export const deleteFavoriteList = ({commit}, song) => {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}