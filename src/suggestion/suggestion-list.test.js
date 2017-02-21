import { shallow } from 'enzyme';
import { assert } from 'chai';
import sinon from 'sinon';
import React from 'react';
import  SuggestionList from './suggestion-list';
import  SuggestionListContainer from './suggestion-list-container';
import { KeyCodes } from '../util/types';

function suggestions() {
  return [
    {header: '1'},
    {header: '2'}
  ];
}

function renderSuggestion(suggestion) {
  return <h1>{suggestion.header}</h1>;
}

function renderNoSuggestion() {
  return <h2>No Match found</h2>;
}

function shallowSuggestionList(props = propsSuggestionList()) {
  return shallow(
    <SuggestionList
      {...props}
    />);
}

function shallowSuggestionListContainer(props = propsSuggestionListContainer()) {
  return shallow(
    <SuggestionListContainer
      {...props}
    />);
}

function propsSuggestionList(_suggestions = suggestions()) {
  return {
    suggestions: _suggestions,
    onSelect: () => {},
    highlightedIndex: 1,
    renderSuggestion,
    renderNoSuggestion,
    refHighlightedSuggestion: ()=>{},
    onKeyDown: () => {}
  };
}

function propsSuggestionListContainer(_suggestions = suggestions()) {
  return {
    suggestions: _suggestions,
    onSelect: () => {},
    renderSuggestion,
    renderNoSuggestion,
  };
}

describe('<SuggestionList />', () => {

  it('highlighted <Suggestion> set to highlightedIndex', () => {
    const wrapper = shallowSuggestionList();
    const ul = wrapper.find('ul');

    assert.equal(ul.children().length, 2);
    assert.isFalse(ul.childAt(0).props().isHighlighted);
    assert.isTrue(ul.childAt(1).props().isHighlighted);
  });

  it('should renderNoSuggestions when suggestions is empty', () => {
    const renderNoMatchesSpy = sinon.spy();
    const wrapper = shallowSuggestionList({...propsSuggestionList(), suggestions: [], renderNoMatches: renderNoMatchesSpy});
    const ul = wrapper.find('ul');
    assert.equal(ul.children().length, 1);
    assert.isTrue(renderNoMatchesSpy.calledOnce);
  });
});

describe('<SuggestionListContainer />', () => {

  it('should render <SuggestionsList> when suggestions', () => {
    const wrapper = shallowSuggestionListContainer();
    assert.equal(wrapper.find('SuggestionList').length, 1);
  });

  it('should increment highlightedIndex on keyboard.DOWN', () => {
    const wrapper = shallowSuggestionListContainer();
    const spyPreventDefault = sinon.spy();
    wrapper.simulate('keydown', {which: KeyCodes.DOWN, preventDefault: spyPreventDefault});

    assert.equal(wrapper.state('highlightedIndex'), 0);
    assert.isTrue(spyPreventDefault.calledOnce);
  });

  it('should decrement highlightedIndex on keyboard.UP', () => {
    const wrapper = shallowSuggestionListContainer();
    wrapper.setState({highlightedIndex: 1});
    const spyPreventDefault = sinon.spy();
    wrapper.simulate('keydown', {which: KeyCodes.UP, preventDefault: spyPreventDefault});

    assert.equal(wrapper.state('highlightedIndex'), 0);
    assert.isTrue(spyPreventDefault.calledOnce);
  });

  it('should reset highlightedIndex on keyboard.HOME', () => {
    const wrapper = shallowSuggestionListContainer();
    wrapper.setState({highlightedIndex: 1});
    wrapper.simulate('keydown', {which: KeyCodes.HOME});

    assert.equal(wrapper.state('highlightedIndex'), 0);
  });

  it('should set highlightedIndex to suggestions end on keyboard.END', () => {
    const wrapper = shallowSuggestionListContainer();
    wrapper.simulate('keydown', {which: KeyCodes.END});

    assert.equal(wrapper.state('highlightedIndex'), 1);
  });

  it('should call onClose prop on keyboard.ESC', () => {
    const spyOnClose = sinon.spy();
    const wrapper = shallowSuggestionListContainer({...propsSuggestionListContainer(), onClose: spyOnClose});
    wrapper.simulate('keydown', {which: KeyCodes.ESC});

    assert.isTrue(spyOnClose.calledOnce);
  });

  it('should call onSuggestionSelect with highlightedItem on keyboard.ENTER', () => {
    const spyOnSelect = sinon.spy();
    const wrapper = shallowSuggestionListContainer({...propsSuggestionListContainer(), onSelect: spyOnSelect});
    wrapper.setState({highlightedIndex: 1});
    wrapper.simulate('keydown', {which: KeyCodes.ENTER});
    const item = suggestions()[1];

    assert.isTrue(spyOnSelect.calledWith(item));
  });

  it('should call onBlur with highlightedItem on keyboard.TAB', () => {
    const spyOnBlur = sinon.spy();
    const wrapper = shallowSuggestionListContainer({...propsSuggestionListContainer(), onBlur: spyOnBlur});
    wrapper.setState({highlightedIndex: 1});
    wrapper.simulate('keydown', {which: KeyCodes.TAB});
    const item = suggestions()[1];

    assert.isTrue(spyOnBlur.calledWith(item));
  });
});
