(function($) {
  $.scrollee = function(element, options) {
    var defaults = {
      itemScroll: 400,
      // onFoo: function() {}
    };

    var plugin = this;

    plugin.settings = {};

    var $element = $(element),
      element = element;

    var items = [];

    plugin.init = function() {
      plugin.settings = $.extend({}, defaults, options);
      $element.find(".scrollee-item").each(function() {
        var $this = $(this);
        items.push({
          title: $this.find(".scrollee-item-title").text(),
          image: $this.find(".scrollee-item-image").attr("src"),
          link: $this.find(".scrollee-item-link").attr("href")
        });
      });
      createStructure();
    };

    plugin.foo_public_method = function() {
      // code goes here
    };

    var calc = {
      offsetTop: 0,
      itemHeight: 100,
      miniItemHeight: 30
    };

    var doCalc = function() {
      calc.offsetTop = $element.offset().top;
      calc.itemHeight = $element.find(".scrollee-big-list").height();
      calc.miniItemHeight = $element.find(".scrollee-small-list li").height();
    };

    var prevItem = -1;
    var dir = 1;

    var timeout1 = null;
    var timeout2 = null;

    var handleScroll = function() {
      var delta = $(window).scrollTop() - calc.offsetTop;
      var itemWithProgress = delta / plugin.settings.itemScroll;
      var itemIndex = Math.floor(itemWithProgress);

      if (itemIndex > prevItem) {
        dir = 1;
      } else if (itemIndex < prevItem) {
        dir = -1;
      } else {
        dir = 0;
      }

      if (dir === 0) {
        return;
      }

      prevItem = itemIndex;

      if (itemIndex >= items.length) {
        itemIndex = items.length - 1;
      }

      $element.find(".scrollee-big-list ul").css({
        transform: "translate3d(0, " + -(itemIndex * calc.itemHeight) + "px, 0)"
      });

      $element
        .find(".scrollee-backgrounds")
        .removeClass("anim-up")
        .removeClass("anim-down")
        .addClass(dir === 1 ? "anim-down" : "anim-up");

      $element.find(".scrollee-backgrounds img").removeClass("prevActive");
      $element.find(".scrollee-backgrounds img.active").addClass("prevActive");
      $element.find(".scrollee-backgrounds img").removeClass("active");

      var $img = $element.find(
        ".scrollee-backgrounds img:nth-child(" + (itemIndex + 1) + ")"
      );

      $img.addClass("active");

      $element.find(".scrollee-small-list ul").css({
        transform:
          "translate3d(0, " +
          -(itemIndex * calc.miniItemHeight + calc.miniItemHeight) +
          "px, 0)"
      });
    };

    var initEvents = function() {
      $(window).unbind("scroll", handleScroll);
      $(window).unbind("resize", doCalc);

      $(window).bind("resize", doCalc);
      $(window).bind("scroll", handleScroll);
    };

    var createStructure = function() {
      $element.removeClass("initialized");
      $element.find(".scrollee-dynamic").remove();
      var $dynamicContent = $("<div />", { class: "scrollee-dynamic" });

      var $list = $("<div />", { class: "scrollee-small-list" });
      var $listUl = $("<ul />");
      for (var i = 0; i < items.length; i++) {
        $listUl.append($("<li />", { text: items[i].title }));
      }
      $list.append($listUl);

      var $bigList = $list.clone();
      $bigList.removeClass("scrollee-small-list").addClass("scrollee-big-list");

      var $backgrounds = $("<div />", { class: "scrollee-backgrounds" });
      var $backgroundImages = $("<div />", {
        class: "scrollee-backgrounds-images"
      });
      for (var i = 0; i < items.length; i++) {
        $backgroundImages.append($("<img />", { src: items[i].image }));
      }
      $backgrounds.append($backgroundImages);
      $backgrounds.append($("<div />", { class: "overlay" }));

      var $content = $("<div />", { class: "scrollee-content" });
      for (var i = 0; i < items.length; i++) {
        var $c = $("<div />");
        var $link = $("<a />", { href: items[i].link, text: "Learn More" });
        $link.appendTo($c);
        $c.appendTo($content);
      }

      $backgrounds.appendTo($dynamicContent);

      $("<div />", { class: "scrollee-content-wrap container" })
        .append($("<div />", { class: "scrollee-content-top" }))
        .append($bigList)
        .append(
          $("<div />", { class: "scrollee-content-bottom" })
            .append($content)
            .append($list)
        )
        .appendTo($dynamicContent);

      $dynamicContent.appendTo($element);
      $element.css({
        height: window.innerHeight + items.length * plugin.settings.itemScroll
      });
      $element.addClass("initialized");

      doCalc();
      initEvents();
      handleScroll();
    };

    plugin.init();
  };

  $.fn.scrollee = function(options) {
    return this.each(function() {
      if (undefined === $(this).data("scrollee")) {
        var plugin = new $.scrollee(this, options);
        $(this).data("scrollee", plugin);
      }
    });
  };
})(jQuery);
