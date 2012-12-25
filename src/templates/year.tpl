<div class="ui-calendar-year" data-role="month-table">
  {{#each items}}
  <ul class="ui-calendar-year-column">
    {{#each this}}
    <li {{#unless available}}class="disabled-element"{{/unless}} data-role="{{role}}" data-value="{{value}}">{{_ label}}</li>
    {{/each}}
  </ul>
  {{/each}}
</div>
