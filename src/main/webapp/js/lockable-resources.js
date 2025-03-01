// SPDX-License-Identifier: MIT
// Copyright (c) 2020, Tobias Gruetzmacher

function find_resource_name(element) {
  var row = element.up('tr');
  var resourceName = row.getAttribute('data-resource-name');
  return resourceName;
}

function resource_action(button, action) {
  // TODO: Migrate to form:link after Jenkins 2.233 (for button-styled links)
  var form = document.createElement('form');
  var resourceName = find_resource_name(button);
  form.setAttribute('method', 'POST');
  form.setAttribute('action', action + "?resource=" + encodeURIComponent(resourceName));
  crumb.appendToForm(form);
  document.body.appendChild(form);
  form.submit();
  notificationBar.show(action + ' was successfully performed on ' + resourceName, notificationBar.SUCCESS);
}

function replaceNote(element, resourceName) {
  var d = document.getElementById("note-" + resourceName);
  $(d).innerHTML = "<div class='spinner-right' style='flex-grow: 1;'>loading...</div>";
  new Ajax.Request(
    "noteForm",
    {
      parameters: { resource: resourceName },
      onComplete: function (x) {
        d.innerHTML = x.responseText;
        evalInnerHtmlScripts(x.responseText, function () {
          Behaviour.applySubtree(d);
          d.getElementsByTagName("TEXTAREA")[0].focus();
        });
        layoutUpdateCallback.call();
      }
    }
  );
  return false;
}
