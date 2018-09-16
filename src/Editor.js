import React, { Component } from "react";
import EditorBase from "draft-js-plugins-editor";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import "draft-js-linkify-plugin/lib/plugin.css";
import styled from 'styled-components';
import "./App.css";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";


let Editor = styled(EditorBase)`
    flex-grow: 1;
    display: flex;
`

const linkifyPlugin = createLinkifyPlugin({
  component: props => (
    // eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
    <a
      {...props}
      onClick={() => {
        window.location.href = props.href;
      }}
    />
  )
});

const plugins = [createMarkdownShortcutsPlugin(), linkifyPlugin];

export default class extends Component {
  static get defaultProps() {
    return {
      id: "default-state"
    };
  }

  componentDidMount() {
      this.mounted = true;
  }

  constructor(props, context) {
        super(props, context);
        
        let editorState;
        let raw = props.initialState;
        if (raw) {
            try {
                editorState = EditorState.createWithContent(convertFromRaw(raw));
            } catch(e) {
                console.log('there was an error getting the state');
            }
            
        }
        if (!editorState) {
            editorState = EditorState.createEmpty();
        }
        this.state = {
            editorState
        }
  }

  shouldComponentUpdate(nextProps, nextState) {
      console.log('should update?!?!!??!');
      if (nextState !== this.state) {
          return true;
      } else {
          false;
      }
  }

  onChange = editorState => {

    this.setState({
      editorState
    });
    if (this.mounted) {
        let raw = convertToRaw(editorState.getCurrentContent());
        this.props.onChange(raw);
    }
  };

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
        plugins={plugins}
      />
    );
  }
}
