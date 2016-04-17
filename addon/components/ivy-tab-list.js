import Ember from 'ember';
import layout from '../templates/components/ivy-tab-list';

/**
 * @module ivy-tabs
 */

/**
 * @class IvyTabListComponent
 * @namespace IvyTabs
 * @extends Ember.Component
 */
export default Ember.Component.extend({
  layout: layout,

  tagName: 'ul',
  attributeBindings: ['aria-multiselectable', 'role'],
  classNames: ['ivy-tab-list'],

  init() {
    this._super(...arguments);
    Ember.run.once(this, this._registerWithTabsContainer);
  },

  willDestroy() {
    this._super(...arguments);
    Ember.run.once(this, this._unregisterWithTabsContainer);
  },

  /**
   * Tells screenreaders that only one tab can be selected at a time.
   *
   * @property aria-multiselectable
   * @type String
   * @default 'false'
   */
  'aria-multiselectable': 'false',

  /**
   * The `role` attribute of the tab list element.
   *
   * See http://www.w3.org/TR/wai-aria/roles#tablist
   *
   * @property role
   * @type String
   * @default 'tablist'
   */
  role: 'tablist',

  /**
   * Gives focus to the selected tab.
   *
   * @method focusSelectedTab
   */
  focusSelectedTab() {
    this.get('selectedTab').$().focus();
  },

  /**
   * Event handler for navigating tabs via arrow keys. The left (or up) arrow
   * selects the previous tab, while the right (or down) arrow selects the next
   * tab.
   *
   * @method navigateOnKeyDown
   * @param {Event} event
   */
  navigateOnKeyDown: Ember.on('keyDown', function(event) {
    switch (event.keyCode) {
    case 37: /* left */
    case 38: /* up */
      this.selectPreviousTab();
      break;
    case 39: /* right */
    case 40: /* down */
      this.selectNextTab();
      break;
    default:
      return;
    }

    event.preventDefault();
    Ember.run.scheduleOnce('afterRender', this, this.focusSelectedTab);
  }),

  /**
   * Adds a tab to the `tabs` array.
   *
   * @method registerTab
   * @param {IvyTabs.IvyTabComponent} tab
   */
  registerTab(tab) {
    this.get('tabs').pushObject(tab);
  },

  /**
   * Selects the next tab in the list, if any.
   *
   * @method selectNextTab
   */
  selectNextTab() {
    let index = this.get('selected-index') + 1;
    if (index === this.get('tabs.length')) { index = 0; }
    this.selectTabByIndex(index);
  },

  /**
   * Selects the previous tab in the list, if any.
   *
   * @method selectPreviousTab
   */
  selectPreviousTab() {
    let index = this.get('selected-index') - 1;

    // Previous from the first tab should select the last tab.
    if (index < 0) { index = this.get('tabs.length') - 1; }
    // This would only happen if there are no tabs, so stay at 0.
    if (index < 0) { index = 0; }

    this.selectTabByIndex(index);
  },

  'selected-index': Ember.computed.alias('tabsContainer.selected-index'),

  /**
   * The currently-selected `ivy-tab` instance.
   *
   * @property selectedTab
   * @type IvyTabs.IvyTabComponent
   */
  selectedTab: Ember.computed(function() {
    return this.get('tabs').objectAt(this.get('selected-index'));
  }).property('selected-index', 'tabs.[]'),

  /**
   * Select the given tab.
   *
   * @method selectTab
   * @param {IvyTabs.IvyTabComponent} tab
   */
  selectTab(tab) {
    this.selectTabByIndex(this.get('tabs').indexOf(tab));
  },

  /**
   * Select the tab at `index`.
   *
   * @method selectTabByIndex
   * @param {Number} index
   */
  selectTabByIndex(index) {
    this.sendAction('on-select', index);
  },

  tabs: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  _deprecatedParentViewBasedTabsContainer: Ember.computed('parentView', function() {
    Ember.deprecate('Inferring `tabsContainer` from `parentView` on `{{ivy-tab-list}}` is deprecated. Please assign in an instance of `{{ivy-tabs}}` to the `tabsContainer` property.', false, {
      id: 'ivy-tabs.ivy-tab-list.tabs-container-missing',
      until: '2.0.0'
    });
    return this.get('parentView');
  }).readOnly(),

  /**
   * The `ivy-tabs` component.
   *
   * @property tabsContainer
   * @type IvyTabs.IvyTabsComponent
   * @readOnly
   */
  tabsContainer: Ember.computed.oneWay('_deprecatedParentViewBasedTabsContainer'),

  /**
   * Removes a tab from the `tabs` array.
   *
   * @method unregisterTab
   * @param {IvyTabs.IvyTabComponent} tab
   */
  unregisterTab(tab) {
    const index = tab.get('index');
    this.get('tabs').removeObject(tab);

    if (index < this.get('selected-index')) {
      this.selectPreviousTab();
    } else if (tab.get('isSelected')) {
      if (index !== 0) {
        this.selectPreviousTab();
      }
    }
  },

  _registerWithTabsContainer() {
    this.get('tabsContainer').registerTabList(this);
  },

  _unregisterWithTabsContainer() {
    this.get('tabsContainer').unregisterTabList(this);
  }
});