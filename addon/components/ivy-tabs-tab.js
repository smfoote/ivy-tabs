import Component from 'ember-component';
import computed, { readOnly } from 'ember-computed';
import on from 'ember-evented/on';
import { once } from 'ember-runloop';

/**
 * @module ivy-tabs
 */

/**
 * @class IvyTabComponent
 * @namespace IvyTabs
 * @extends Ember.Component
 */
export default Component.extend({
  tagName: 'a',
  attributeBindings: ['aria-controls', 'aria-expanded', 'aria-selected', 'href', 'selected', 'tabindex'],
  classNames: ['ivy-tabs-tab'],
  classNameBindings: ['active'],

  init() {
    this._super(...arguments);
    once(this, this._registerWithTabList);
  },

  willDestroy() {
    this._super(...arguments);
    once(this, this._unregisterWithTabList);
  },

  /**
   * Tells screenreaders which panel this tab controls.
   *
   * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-controls
   *
   * @property aria-controls
   * @type String
   * @readOnly
   */
  'aria-controls': readOnly('tabPanel.elementId'),

  /**
   * Tells screenreaders whether or not this tab's panel is expanded.
   *
   * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-expanded
   *
   * @property aria-expanded
   * @type String
   * @readOnly
   */
  'aria-expanded': readOnly('aria-selected'),

  /**
   * Tells screenreaders whether or not this tab is selected.
   *
   * See http://www.w3.org/TR/wai-aria/states_and_properties#aria-selected
   *
   * @property aria-selected
   * @type String
   */
  'aria-selected': computed('isSelected', function() {
    return this.get('isSelected') + ''; // coerce to 'true' or 'false'
  }),

  /**
   * The `role` attribute of the tab element.
   *
   * See http://www.w3.org/TR/wai-aria/roles#tab
   *
   * @property ariaRole
   * @type String
   * @default 'tab'
   */
  ariaRole: 'tab',

  /**
   * The `selected` attribute of the tab element. If the tab's `isSelected`
   * property is `true` this will be the literal string 'selected', otherwise
   * it will be `undefined`.
   *
   * @property selected
   * @type String
   */
  selected: computed('isSelected', function() {
    if (this.get('isSelected')) { return 'selected'; }
  }),

  /**
   * Makes the selected tab keyboard tabbable, and prevents tabs from getting
   * focus when clicked with a mouse.
   *
   * @property tabindex
   * @type Number
   */
  tabindex: computed('isSelected', function() {
    if (this.get('isSelected')) { return 0; }
  }),

  /**
   * Accessed as a className binding to apply the tab's `activeClass` CSS class
   * to the element when the tab's `isSelected` property is true.
   *
   * @property active
   * @type String
   * @readOnly
   */
  active: computed('isSelected', function() {
    if (this.get('isSelected')) { return this.get('activeClass'); }
  }),

  /**
   * The CSS class to apply to a tab's element when its `isSelected` property
   * is `true`.
   *
   * @property activeClass
   * @type String
   * @default 'active'
   */
  activeClass: 'active',

  href: computed('tabPanel.elementId', 'tagName', function() {
    if (this.get('tagName') !== 'a') {
      return;
    }

    return '#' + this.get('tabPanel.elementId');
  }).readOnly(),

  /**
   * The index of this tab in the `ivy-tabs-tablist` component.
   *
   * @property index
   * @type Number
   */
  index: computed('tabs.[]', function() {
    return this.get('tabs').indexOf(this);
  }),

  /**
   * Whether or not this tab is selected.
   *
   * @property isSelected
   * @type Boolean
   */
  isSelected: computed('tabList.selectedTab', function() {
    return this.get('tabList.selectedTab') === this;
  }),

  /**
   * Object to uniquely identify this tab within the tabList.
   *
   * @property model
   * @type Object
   */
  model: null,

  /**
   * Called when the user clicks on the tab. Selects this tab.
   *
   * @method select
   */
  select() {
    this.sendAction('on-select', this.get('model'));
  },

  selectOnClickOrTouch: on('click', 'touchEnd', function(event) {
    event.preventDefault();
    this.select();
  }),

  /**
   * The `ivy-tabs-tablist` component this tab belongs to.
   *
   * @property tabList
   * @type IvyTabs.IvyTabListComponent
   * @default null
   */
  tabList: null,

  /**
   * The `ivy-tabs-tabpanel` associated with this tab.
   *
   * @property tabPanel
   * @type IvyTabs.IvyTabPanelComponent
   */
  tabPanel: computed('tabPanels.@each.model', 'model', function() {
    return this.get('tabPanels').findBy('model', this.get('model'));
  }),

  /**
   * The array of all `ivy-tabs-tabpanel` instances within the `ivy-tabs`
   * component.
   *
   * @property tabPanels
   * @type Array | IvyTabs.IvyTabPanelComponent
   * @readOnly
   */
  tabPanels: readOnly('tabsContainer.tabPanels'),

  /**
   * The array of all `ivy-tabs-tab` instances within the `ivy-tabs-tablist` component.
   *
   * @property tabs
   * @type Array | IvyTabs.IvyTabComponent
   * @readOnly
   */
  tabs: readOnly('tabList.tabs'),

  /**
   * The `ivy-tabs` component.
   *
   * @property tabsContainer
   * @type IvyTabs.IvyTabsComponent
   * @readOnly
   */
  tabsContainer: readOnly('tabList.tabsContainer'),

  _registerWithTabList() {
    this.get('tabList').registerTab(this);
  },

  _unregisterWithTabList() {
    this.get('tabList').unregisterTab(this);
  }
}).reopenClass({
  positionalParams: ['model']
});
