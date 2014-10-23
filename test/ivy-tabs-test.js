moduleForComponent('ivy-tabs', 'component:ivy-tabs', {
  needs: [
    'component:ivy-tab',
    'component:ivy-tab-list',
    'component:ivy-tab-panel'
  ]
});

test('selects first tab by default', function() {
  var component = this.subject({
    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  ok(component.$('#tab1').is('[aria-selected=true]'), 'tab1 is selected');
  ok(component.$('#tab2').is('[aria-selected=false]'), 'tab2 is not selected');
  ok(component.$('#panel1').is(':visible'), 'panel1 is visible');
  ok(component.$('#panel2').is(':not(:visible)'), 'panel2 is not visible');
});

test('selects tab by selectedIndex', function() {
  var component = this.subject({
    selectedIndex: 1,

    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  ok(component.$('#tab1').is('[aria-selected=false]'), 'tab1 is not selected');
  ok(component.$('#tab2').is('[aria-selected=true]'), 'tab2 is selected');
  ok(component.$('#panel1').is(':not(:visible)'), 'panel1 is not visible');
  ok(component.$('#panel2').is(':visible'), 'panel2 is visible');

  Ember.run(function() {
    component.set('selectedIndex', 0);
  });

  ok(component.$('#tab1').is('[aria-selected=true]'), 'tab1 is selected');
  ok(component.$('#tab2').is('[aria-selected=false]'), 'tab2 is not selected');
  ok(component.$('#panel1').is(':visible'), 'panel1 is visible');
  ok(component.$('#panel2').is(':not(:visible)'), 'panel2 is not visible');
});

test('selects tab on click', function() {
  var component = this.subject({
    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  Ember.run(function() {
    component.$('#tab2').click();
  });

  ok(component.$('#tab1').is('[aria-selected=false]'), 'tab1 is not selected');
  ok(component.$('#tab2').is('[aria-selected=true]'), 'tab2 is selected');
  ok(component.$('#panel1').is(':not(:visible)'), 'panel1 is not visible');
  ok(component.$('#panel2').is(':visible'), 'panel2 is visible');
});

test('WAI-ARIA attributes', function() {
  var component = this.subject({
    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list id="tablist"}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  var tablist = component.$('#tablist');
  equal(tablist.attr('aria-multiselectable'), 'false', 'tablist: aria-multiselectable');
  equal(tablist.attr('role'), 'tablist', 'tablist: role');

  var tab = component.$('#tab1');
  equal(tab.attr('role'), 'tab', 'tab1: role');
  equal(tab.attr('aria-controls'), 'panel1', 'tab1: aria-controls');

  var tabpanel = component.$('#panel1');
  equal(tabpanel.attr('role'), 'tabpanel', 'panel1: role');
  equal(tabpanel.attr('aria-labeledby'), 'tab1', 'panel1: aria-labeledby');
});

test('selected tab attributes', function() {
  var component = this.subject({
    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list id="tablist"}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  var tab = component.$('#tab1');
  ok(tab.hasClass('active'), 'has "active" class');
  equal(tab.attr('selected'), 'selected', 'selected');
  equal(tab.attr('aria-selected'), 'true', 'aria-selected');
  equal(tab.attr('aria-expanded'), 'true', 'aria-expanded');
  equal(tab.attr('tabindex'), '0', 'tabindex');
});

test('selected panel attributes', function() {
  var component = this.subject({
    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list id="tablist"}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  var panel = component.$('#panel1');
  ok(panel.hasClass('active'), 'has "active" class');
});

test('deselected tab attributes', function() {
  var component = this.subject({
    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list id="tablist"}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  var tab = component.$('#tab2');
  ok(!tab.hasClass('active'), 'does not have "active" class');
  equal(tab.attr('selected'), undefined, 'selected');
  equal(tab.attr('aria-selected'), 'false', 'aria-selected');
  equal(tab.attr('aria-expanded'), 'false', 'aria-expanded');
  equal(tab.attr('tabindex'), undefined, 'tabindex');
});

test('deselected panel attributes', function() {
  var component = this.subject({
    template: Ember.Handlebars.compile(
      '{{#ivy-tab-list id="tablist"}}' +
      '  {{#ivy-tab id="tab1"}}tab 1{{/ivy-tab}}' +
      '  {{#ivy-tab id="tab2"}}tab 2{{/ivy-tab}}' +
      '{{/ivy-tab-list}}' +
      '{{#ivy-tab-panel id="panel1"}}panel 1{{/ivy-tab-panel}}' +
      '{{#ivy-tab-panel id="panel2"}}panel 2{{/ivy-tab-panel}}'
    )
  });
  this.append();

  var panel = component.$('#panel2');
  ok(!panel.hasClass('active'), 'does not have "active" class');
});