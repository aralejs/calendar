define(function(require, exports, module) {
    var Handlebars = require('handlebars');
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
module.exports = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.day),stack1 == null || stack1 === false ? stack1 : stack1.items), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n        <li class=\"ui-calendar-day ui-calendar-day-";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-role=\"day\" data-value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['_']),stack1 ? stack1.call(depth0, depth0.label, options) : helperMissing.call(depth0, "_", depth0.label, options)))
    + "</li>\n        ";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.date),stack1 == null || stack1 === false ? stack1 : stack1.items), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        ";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <ul class=\"ui-calendar-date-column\">\n            ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n        ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n            <li class=\"ui-calendar-day-";
  if (stack1 = helpers.day) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.day; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  if (stack1 = helpers.className) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.className; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n            ";
  stack1 = helpers.unless.call(depth0, depth0.available, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n            \"\n            data-role=\"date\" data-value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"\n            >";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.label; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n            ";
  return buffer;
  }
function program7(depth0,data) {
  
  
  return "disabled-date";
  }

function program9(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.month),stack1 == null || stack1 === false ? stack1 : stack1.items), {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        ";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <ul class=\"ui-calendar-month-column\">\n            ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n        ";
  return buffer;
  }
function program11(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n            <li data-role=\"month\" data-value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['_']),stack1 ? stack1.call(depth0, depth0.label, options) : helperMissing.call(depth0, "_", depth0.label, options)))
    + "</li>\n            ";
  return buffer;
  }

function program13(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n        ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.year),stack1 == null || stack1 === false ? stack1 : stack1.items), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        ";
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <ul class=\"ui-calendar-year-column\">\n            ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n        ";
  return buffer;
  }
function program15(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n            <li data-role=\"";
  if (stack1 = helpers.role) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.role; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" data-value=\"";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['_']),stack1 ? stack1.call(depth0, depth0.label, options) : helperMissing.call(depth0, "_", depth0.label, options)))
    + "</li>\n            ";
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <li class=\"ui-calendar-time\" colspan=\"2\" data-role=\"time\"><span class=\"ui-calendar-hour\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.time),stack1 == null || stack1 === false ? stack1 : stack1.hour)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span> : "
    + escapeExpression(((stack1 = ((stack1 = depth0.time),stack1 == null || stack1 === false ? stack1 : stack1.minute)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</li>\n        ";
  return buffer;
  }

  buffer += "<div class=\"ui-calendar\">\n    <ul class=\"ui-calendar-navigation\" data-role=\"navigation-container\">\n        <li class=\"ui-calendar-previous-year\" data-role=\"prev-year\">&lt;&lt;</li>\n        <li class=\"ui-calendar-previous-month\" data-role=\"prev-month\">&lt;</li>\n        <li class=\"ui-calendar-month-year\" data-role=\"month-year-container\">\n        <span class=\"month\" data-role=\"mode-month\" data-value=\""
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.month),stack1 == null || stack1 === false ? stack1 : stack1.current)),stack1 == null || stack1 === false ? stack1 : stack1.value)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['_']),stack1 ? stack1.call(depth0, ((stack1 = ((stack1 = depth0.month),stack1 == null || stack1 === false ? stack1 : stack1.current)),stack1 == null || stack1 === false ? stack1 : stack1.label), options) : helperMissing.call(depth0, "_", ((stack1 = ((stack1 = depth0.month),stack1 == null || stack1 === false ? stack1 : stack1.current)),stack1 == null || stack1 === false ? stack1 : stack1.label), options)))
    + "</span>\n        <span class=\"year\" data-role=\"mode-year\">"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.year),stack1 == null || stack1 === false ? stack1 : stack1.current)),stack1 == null || stack1 === false ? stack1 : stack1.label)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n        </li>\n        <li class=\"ui-calendar-next-month\" data-role=\"next-month\">&gt;</li>\n        <li class=\"ui-calendar-next-year\" data-role=\"next-year\">&gt;&gt;</li>\n    </ul>\n\n    <ul class=\"ui-calendar-control\" data-role=\"pannel-container\">\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.mode),stack1 == null || stack1 === false ? stack1 : stack1.date), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </ul>\n\n    <div class=\"ui-calendar-data-container\" data-role=\"data-container\">\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.mode),stack1 == null || stack1 === false ? stack1 : stack1.date), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.mode),stack1 == null || stack1 === false ? stack1 : stack1.month), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.mode),stack1 == null || stack1 === false ? stack1 : stack1.year), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </div>\n\n    <ul class=\"ui-calendar-footer\" data-role=\"time-container\">\n        <li class=\"ui-calendar-today\" data-role=\"today\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['_']),stack1 ? stack1.call(depth0, ((stack1 = depth0.message),stack1 == null || stack1 === false ? stack1 : stack1.today), options) : helperMissing.call(depth0, "_", ((stack1 = depth0.message),stack1 == null || stack1 === false ? stack1 : stack1.today), options)))
    + "</li>\n        ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.mode),stack1 == null || stack1 === false ? stack1 : stack1.time), {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </ul>\n</div>\n";
  return buffer;
  });
})();
});
