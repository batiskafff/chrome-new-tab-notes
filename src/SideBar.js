import React, { Component } from "react";
import styled, {css} from 'styled-components';
import {Consumer, selectPage, addPage, mutate} from './state/data';
import {SortableHandle, SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
let List = styled.ul`
    border-right: 1px solid #ddd;
    text-decoration: none;
    list-style: none !important;
    padding: 0px;
    margin: 0px;
`;

let RemoveIcon = styled.span`
    color: gray;
    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: none;
    padding-right: 10px;
`

let StyledHandle = styled.span`
color: gray;
padding: 10px;
transform: rotate(90deg);
:hover {
    cursor: move;
}`;

let DragHandleBase = () => (<StyledHandle>|||</StyledHandle>);

const DragHandle = SortableHandle(DragHandleBase);

let AddButton = styled.button`
    background-color: dodgerblue;
    padding: 10px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    margin-top: auto;
    display: flex;
    flex-grow: 1;
    margin-top: 10px;
    margin-left: auto;
    margin-right: 10px;
`



let SortableList = SortableContainer(({items, selectedIndex}) => (
    <List>
        {items.map((id, index) => {
            console.log('items', items, id, index);
            return (
            <SortableListItem key={`item-${index}`} i={index} index={index} value={id} selected={index === selectedIndex} />
        )})}
        <AddButton onClick={addPage}>+ Add</AddButton>
    </List>
));



let ListItem = styled.li`
    padding: 10px;
    padding-right: 5px;
    border-bottom: 1px solid #ddd;
    margin-left: 0px;
    cursor: pointer;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #b9b9b9;
    color: gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    :hover ${RemoveIcon} {
        display: block;
    }
    ${props => props.selected && `
        background-color: lightblue;
    `}
`;

let Wrapper = styled.div`
    align-items: center;
    display: flex;
`

let SortableListItem = SortableElement(({i, value, selected}) => (
<ListItem 
    onClick={() =>{
        selectPage(i);
    }}
    selected={selected}>
    <Wrapper>
        <DragHandle />
        <Consumer select={[state => state.pages[value]]}>
            {page => getPreviewText(page)}
        </Consumer>
    </Wrapper>
    <RemoveIcon>X</RemoveIcon>
</ListItem>));


export default (props) => (
    <Consumer select={[state => state.sideBarOrder, state => state.selectedIndex]}>
    {
        (sideBarOrder, selectedIndex) => (
            <SortableList
                useDragHandle={true}
                items={sideBarOrder}
                selectedIndex={selectedIndex}
                onSortEnd={({oldIndex,newIndex}) => {
                    mutate(draft => {
                        draft.sideBarOrder = arrayMove(sideBarOrder,oldIndex,newIndex);
                        selectPage(newIndex);
                    });
                }}
            />
        )
    }
    </Consumer>
);



function getPreviewText(raw) {
    let previewText = '';
    if (raw) {
      try {
        let state = EditorState.createWithContent(convertFromRaw(raw));
        previewText = state.getCurrentContent().getPlainText().substr(0, 20);
      } catch(e) {
        console.error('there was an error', e);
      }
    }
    
    if (!previewText) {
      previewText =  <i>empty page</i>
    }

    return previewText;
}