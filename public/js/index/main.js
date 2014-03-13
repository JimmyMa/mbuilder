require.config({
    paths: {
        "knockout": "/assets/js/knockout-2.2.1/knockout-2.2.1",
        "jquery": "/assets/js/jquery.mobile-1.3.1/jquery-1.9.1.min",
        "text": "/assets/js/require/text",
        "bootstrap": "/assets/js/bootstrap/js/bootstrap.min"
    },
    shim: {
        "bootstrap": ["jquery"]
    }
});

require(["knockout", "app", "jquery", "bootstrap", "text", "stringTemplateEngine"], function(ko, App, $) {
    var vm = new App();

    //simple client-side routing - update hash when current section is changed
    vm.currentSection.subscribe(function(newValue) {
        location.hash = newValue.name;
    });

    var updateSection = function() {
        vm.updateSection(location.hash.substr(1));
    };

    //respond to hashchange event
    window.onhashchange = updateSection;

    //initialize
    updateSection();

    window.alert = function(text) {
      $("#alert .modal-body").html("<p>" + text + "</p>").parent().modal();
    };

    ko.applyBindings(vm);
});
