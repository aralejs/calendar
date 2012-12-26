<div class="ui-calendar-day">
  <ul class="ui-calendar-day-column">
    {{#each day.items}}
    <li class="ui-calendar-day ui-calendar-day-{{value}}" data-role="day" data-value="{{value}}">{{_ label}}</li>
    {{/each}}
  </ul>
</div>
<div class="ui-calendar-date">
  {{#each date.items}}
  <ul class="ui-calendar-date-column">
    {{#each this}}
    <li class="ui-calendar-day-{{day}}
    {{#unless available}}disabled-date{{/unless}}
    "
    data-role="date" data-value="{{value}}"
    >{{label}}</li>
    {{/each}}
  </ul>
  {{/each}}
</div>
