<div class="ui-calendar-month">
{{#each items}}
<ul class="ui-calendar-month-column">
    {{#each this}}
    <li class="{{#unless available}}disabled-month{{/unless}}" data-role="month" data-value="{{value}}">{{_ label}}</li>
    {{/each}}
</ul>
{{/each}}
</div>
