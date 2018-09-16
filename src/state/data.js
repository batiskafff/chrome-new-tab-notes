import React from 'react';
import createState from 'react-copy-write'
import styled from 'styled-components';


export const localStorageId = 'meow1';

let initialState;

try {
    let stored = window.localStorage.getItem(localStorageId);
    if (stored) {
        initialState = JSON.parse(stored);
    } else {
        initialState = JSON.parse(`{
            "pages":{},
            "sideBarOrder": ["default-page"],
            "selectedIndex": 0
        }`);
    }
    
} catch(e) {
    initialState = JSON.parse(`{
        "pages":{},
        "sideBarOrder": ["default-page"],
        "selectedIndex": 0
    }`);
}

console.log('creating state', initialState);

const {
  Provider,
  Consumer,
  createSelector,
  mutate,
} = createState(initialState);

export {Provider, Consumer, mutate, createSelector};

export function addPage() {
    console.log('adding page');
    let id = getRandomId(10);
    mutate(draft => {
        draft.sideBarOrder.push(id);
        selectPage(draft.sideBarOrder.length - 1);
    });
}

export function selectPage(index) {
    mutate(draft => {
        draft.selectedIndex = index;
    });
}

export function updatePage(id, updated) {
    mutate(draft => {
        draft.pages[id] = updated;
    });
}

let Hidden = styled.div`
    display: none;
`

export const StateSaver = (props) => (<Consumer select={[state => state]}>{
    (state) => {
        console.log('update state!', state);
        window.localStorage.setItem(localStorageId, JSON.stringify(state));
        return (<Hidden></Hidden>);
    }
}</Consumer>)

function getRandomId(length) {
    // 生成する文字列に含める文字セット
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charsLength = chars.length;
    var randomId = '';
    
    // 生成する文字列の長さが指定されていなければデフォルトで20文字
    if (!length) {
      length = 20;
    }
  
    for(var i=0; i<length; i++) {
      randomId += chars[Math.floor(Math.random() * charsLength)];
    }
  
    return randomId;
  }